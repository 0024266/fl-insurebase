import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { MongoClient, Db } from 'mongodb';
import crypto from 'crypto';
import path from 'path';
import { INITIAL_DATASET } from './src/data/initialRecords';
import { INITIAL_FLORIDA_PERMIT_DATASET } from './src/data/initialPermitRecords';
import { INITIAL_CARRIER_RECORDS } from './src/data/initialCarriers';
import { deduplicateRecords, getRecordId, formatCurrentTimestamp } from './src/utils/formatters';
import { deduplicatePermitRecords, getPermitRecordId, formatZipCode } from './src/utils/permitFormatters';
import { MortgageRecord } from './src/types/mortgage';
import { FloridaZipRecord, BulkUpdateLinksOptions } from './src/types/permits';
import { CarrierRecord } from './src/types/carrier';

const PORT = 3000;
const DB_NAME = (process.env.MONGODB_DB_NAME || 'fl_insurebase').trim() || 'fl_insurebase';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let seedPromise: Promise<void> | null = null;

// In-memory fallback auth state when DB is not yet connected
let fallbackAdminAuth: { salt: string; hash: string } | null = null;
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Per-IP login rate limiter (5 failed attempts per 60s window)
const LOGIN_WINDOW_MS = 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    return false;
  }
  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearFailedAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

function sanitizeString(val: unknown, maxLen = 2000): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

function sanitizeNullableString(val: unknown, maxLen = 2000): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val !== 'string') return null;
  const trimmed = val.trim().slice(0, maxLen);
  return trimmed ? trimmed : null;
}

function sanitizeUrl(val: unknown, maxLen = 500): string {
  if (typeof val !== 'string') return '';
  const trimmed = val.trim().slice(0, maxLen);
  if (!trimmed) return '';
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function sanitizeNullableUrl(val: unknown, maxLen = 500): string | null {
  const cleaned = sanitizeUrl(val, maxLen);
  return cleaned ? cleaned : null;
}

function sanitizeId(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
}

function hashPasswordScrypt(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPasswordScrypt(password: string, salt: string, expectedHashHex: string): boolean {
  try {
    const derived = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHashHex, 'hex');
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function verifyEnvPasscode(entered: string, configured: string): boolean {
  try {
    const a = Buffer.from(entered.trim(), 'utf8');
    const b = Buffer.from(configured.trim(), 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function createSignedAdminToken(signingKey: string): string {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `admin.${expiresAt}`;
  const sig = crypto.createHmac('sha256', signingKey).update(payload).digest('hex');
  return `${expiresAt}.${sig}`;
}

function verifySignedAdminToken(authHeader: string | undefined, signingKey: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ') || !signingKey) return false;
  const token = authHeader.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [expiresAtStr, sigHex] = parts;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const payload = `admin.${expiresAt}`;
  const expectedSig = crypto.createHmac('sha256', signingKey).update(payload).digest('hex');
  try {
    const a = Buffer.from(sigHex, 'hex');
    const b = Buffer.from(expectedSig, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function resolveSigningKey(): Promise<string | null> {
  const envPass = (process.env.ADMIN_PASSCODE || '').trim();
  if (envPass) {
    return crypto.createHash('sha256').update(`env:${envPass}`).digest('hex');
  }
  const db = await getDb();
  if (db) {
    const doc = await db.collection('meta').findOne({ _id: 'admin_auth' as unknown as any });
    if (doc && typeof doc.hash === 'string' && doc.hash) {
      return doc.hash;
    }
  }
  if (fallbackAdminAuth) {
    return fallbackAdminAuth.hash;
  }
  return null;
}

async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const signingKey = await resolveSigningKey();
  if (!verifySignedAdminToken(req.headers.authorization, signingKey)) {
    res.status(401).json({ error: 'Unauthorized. Valid Admin session required.' });
    return;
  }
  next();
}

async function getDb(): Promise<Db | null> {
  const uri = (process.env.MONGODB_URI || '').trim();
  if (!uri) return null;

  if (mongoDb) return mongoDb;

  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 6000
      });
      await mongoClient.connect();
    }
    mongoDb = mongoClient.db(DB_NAME);

    if (!seedPromise) {
      seedPromise = ensureSeeded(mongoDb);
    }
    await seedPromise;
    return mongoDb;
  } catch (err) {
    console.error('MongoDB connection error:', err instanceof Error ? err.message : 'Unknown error');
    mongoClient = null;
    mongoDb = null;
    seedPromise = null;
    return null;
  }
}

async function ensureSeeded(db: Db): Promise<void> {
  const mCol = db.collection('mortgages');
  if ((await mCol.countDocuments()) === 0) {
    const mortgages = deduplicateRecords(INITIAL_DATASET).map((r) => {
      const recordId = getRecordId(r);
      const { _id, ...rest } = r;
      return { _id: recordId as unknown as any, recordId, ...rest };
    });
    if (mortgages.length > 0) {
      await mCol.insertMany(mortgages, { ordered: false }).catch(() => {});
    }
  }
  await mCol.createIndex({ recordId: 1 }, { unique: true }).catch(() => {});

  const pCol = db.collection('permits');
  if ((await pCol.countDocuments()) === 0) {
    const permits = deduplicatePermitRecords(INITIAL_FLORIDA_PERMIT_DATASET).map((r) => {
      const recordId = getPermitRecordId(r);
      const { _id, ...rest } = r;
      return { _id: recordId as unknown as any, recordId, ...rest };
    });
    if (permits.length > 0) {
      await pCol.insertMany(permits, { ordered: false }).catch(() => {});
    }
  }
  await pCol.createIndex({ recordId: 1 }, { unique: true }).catch(() => {});

  const cCol = db.collection('carriers');
  if ((await cCol.countDocuments()) === 0) {
    const carriers = INITIAL_CARRIER_RECORDS.map((r) => ({
      _id: r.id as unknown as any,
      recordId: r.id,
      ...r
    }));
    if (carriers.length > 0) {
      await cCol.insertMany(carriers, { ordered: false }).catch(() => {});
    }
  }
  await cCol.createIndex({ id: 1 }, { unique: true }).catch(() => {});
}

function sanitizeMortgageInput(body: Record<string, unknown>, id: string): MortgageRecord & { recordId: string } {
  return {
    _id: { $oid: id },
    recordId: id,
    Name: sanitizeString(body.Name, 300),
    Name2: sanitizeNullableString(body.Name2, 300),
    Address: sanitizeNullableString(body.Address, 300),
    City: sanitizeNullableString(body.City, 120),
    State: sanitizeNullableString(body.State, 40),
    ZIP: sanitizeNullableString(body.ZIP, 30),
    Telephone: sanitizeNullableString(body.Telephone, 60),
    Telephone2: sanitizeNullableString(body.Telephone2, 60),
    FAX: sanitizeNullableString(body.FAX, 60),
    email: sanitizeNullableString(body.email, 200),
    Online: sanitizeNullableUrl(body.Online, 500),
    Notes: sanitizeNullableString(body.Notes, 2000),
    LastUpdated: sanitizeString(body.LastUpdated, 40) || formatCurrentTimestamp()
  };
}

function sanitizePermitInput(body: Record<string, unknown>, id: string): FloridaZipRecord & { recordId: string } {
  const rawZip = typeof body.zip === 'number' || typeof body.zip === 'string' ? body.zip : '';
  return {
    _id: { $oid: id },
    recordId: id,
    zip: formatZipCode(rawZip),
    City: sanitizeString(body.City, 120),
    County: sanitizeString(body.County, 120).toUpperCase(),
    State: sanitizeString(body.State || 'FL', 20).toUpperCase(),
    PAlink: sanitizeNullableUrl(body.PAlink, 500),
    PermitByCounty: sanitizeNullableUrl(body.PermitByCounty, 500),
    PermitByCity: sanitizeNullableUrl(body.PermitByCity, 500),
    Terrain: sanitizeString(body.Terrain, 10) || undefined,
    lat: typeof body.lat === 'number' && Number.isFinite(body.lat) ? body.lat : undefined,
    long: typeof body.long === 'number' && Number.isFinite(body.long) ? body.long : undefined,
    LastUpdated: sanitizeString(body.LastUpdated, 40) || formatCurrentTimestamp()
  };
}

function sanitizeCarrierInput(body: Record<string, unknown>, id: string): CarrierRecord & { recordId: string } {
  return {
    id,
    recordId: id,
    Carrier: sanitizeString(body.Carrier, 250),
    AgentPortalLogin: sanitizeUrl(body.AgentPortalLogin, 500),
    ForAgents: sanitizeString(body.ForAgents, 100),
    Payments: sanitizeUrl(body.Payments, 500),
    PublicWebsite: sanitizeUrl(body.PublicWebsite, 500),
    OtherNames: sanitizeString(body.OtherNames, 300),
    ClaimsPhone: sanitizeString(body.ClaimsPhone, 100),
    ClaimsEmail: sanitizeString(body.ClaimsEmail, 200),
    CustomerServicePhone: sanitizeString(body.CustomerServicePhone, 100),
    CustomerServiceEmail: sanitizeString(body.CustomerServiceEmail, 200),
    CC_Fee: sanitizeString(body.CC_Fee, 300),
    Notes: sanitizeString(body.Notes, 2000),
    Personal: Boolean(body.Personal),
    Commercial: Boolean(body.Commercial),
    Auto: Boolean(body.Auto),
    Home: Boolean(body.Home),
    Liability: Boolean(body.Liability),
    Health: Boolean(body.Health),
    Flood: Boolean(body.Flood),
    CitizensTakeout: Boolean(body.CitizensTakeout),
    LastUpdated: sanitizeString(body.LastUpdated, 40) || new Date().toISOString().slice(0, 10)
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Baseline security headers for all API endpoints
  app.use('/api', (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    next();
  });

  // --- 1. Admin Auth Status, First-Run Claim Setup & Login ---
  app.get('/api/auth/status', async (_req: Request, res: Response) => {
    const envPass = (process.env.ADMIN_PASSCODE || '').trim();
    const db = await getDb();
    let dbClaimed = false;
    if (db) {
      const doc = await db.collection('meta').findOne({ _id: 'admin_auth' as unknown as any });
      dbClaimed = Boolean(doc && doc.hash && doc.salt);
    }
    const configured = Boolean(envPass || dbClaimed || fallbackAdminAuth);
    res.json({
      configured,
      dbConnected: Boolean(db),
      dbName: DB_NAME
    });
  });

  app.post('/api/auth/setup', async (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      res.status(429).json({ error: 'Too many authentication attempts. Please wait 60 seconds and try again.' });
      return;
    }

    const envPass = (process.env.ADMIN_PASSCODE || '').trim();
    if (envPass) {
      res.status(403).json({ error: 'Admin passcode is already configured via environment secret.' });
      return;
    }

    const db = await getDb();
    if (db) {
      const existing = await db.collection('meta').findOne({ _id: 'admin_auth' as unknown as any });
      if (existing && existing.hash) {
        res.status(403).json({ error: 'Admin passcode has already been claimed.' });
        return;
      }
    } else if (fallbackAdminAuth) {
      res.status(403).json({ error: 'Admin passcode has already been claimed.' });
      return;
    }

    const passcode = sanitizeString(req.body?.passcode, 128);
    if (!passcode || passcode.length < 4) {
      res.status(400).json({ error: 'Passcode must be at least 4 characters.' });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPasswordScrypt(passcode, salt);

    if (db) {
      await db.collection('meta').updateOne(
        { _id: 'admin_auth' as unknown as any },
        { $set: { salt, hash, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } else {
      fallbackAdminAuth = { salt, hash };
    }

    clearFailedAttempts(clientIp);
    const token = createSignedAdminToken(hash);
    res.json({ token, configured: true });
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      res.status(429).json({ error: 'Too many failed login attempts. Please wait 60 seconds and try again.' });
      return;
    }

    const passcode = sanitizeString(req.body?.passcode, 128);
    if (!passcode) {
      res.status(400).json({ error: 'Passcode is required.' });
      return;
    }

    const envPass = (process.env.ADMIN_PASSCODE || '').trim();
    let isValid = false;
    let signingKey: string | null = null;

    if (envPass) {
      isValid = verifyEnvPasscode(passcode, envPass);
      signingKey = crypto.createHash('sha256').update(`env:${envPass}`).digest('hex');
    } else {
      const db = await getDb();
      if (db) {
        const doc = await db.collection('meta').findOne({ _id: 'admin_auth' as unknown as any });
        if (doc && typeof doc.salt === 'string' && typeof doc.hash === 'string') {
          isValid = verifyPasswordScrypt(passcode, doc.salt, doc.hash);
          signingKey = doc.hash;
        }
      } else if (fallbackAdminAuth) {
        isValid = verifyPasswordScrypt(passcode, fallbackAdminAuth.salt, fallbackAdminAuth.hash);
        signingKey = fallbackAdminAuth.hash;
      }
    }

    if (!isValid || !signingKey) {
      recordFailedAttempt(clientIp);
      res.status(401).json({ error: 'Invalid admin passcode. Please check credentials and try again.' });
      return;
    }

    clearFailedAttempts(clientIp);
    const token = createSignedAdminToken(signingKey);
    res.json({ token });
  });

  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // --- 2. Public Directory Read Route ---
  app.get('/api/records', async (_req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      // Fallback: pull live MongoDB records from the production Cloudflare Worker endpoint
      try {
        const remoteRes = await fetch('https://fl-insurebase.info-dir.workers.dev/api/records');
        if (remoteRes.ok) {
          const remoteData = await remoteRes.json();
          if (remoteData && remoteData.source === 'mongodb') {
            res.json(remoteData);
            return;
          }
        }
      } catch {
        // ignore fallback error
      }
      res.json({
        source: 'static',
        dbConnected: false,
        mortgages: null,
        permits: null,
        carriers: null
      });
      return;
    }

    try {
      const [rawMortgages, rawPermits, rawCarriers] = await Promise.all([
        db.collection('mortgages').find({}).toArray(),
        db.collection('permits').find({}).toArray(),
        db.collection('carriers').find({}).toArray()
      ]);

      const mortgages = rawMortgages.map((doc) => ({
        ...doc,
        _id: { $oid: String(doc.recordId || doc._id) }
      }));

      const permits = rawPermits.map((doc) => ({
        ...doc,
        _id: { $oid: String(doc.recordId || doc._id) }
      }));

      const carriers = rawCarriers.map((doc) => ({
        ...doc,
        id: String(doc.id || doc.recordId || doc._id)
      }));

      res.json({
        source: 'mongodb',
        dbConnected: true,
        dbName: DB_NAME,
        mortgages,
        permits,
        carriers
      });
    } catch (err) {
      console.error('Error fetching records from MongoDB:', err);
      res.status(500).json({ error: 'Failed to load records from database.' });
    }
  });

  // --- 3. Protected Mortgagee CRUD & Batch Import Routes ---
  app.post('/api/mortgages/batch', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const rawRecords = Array.isArray(req.body?.records) ? req.body.records : [];
    const mode = req.body?.mode === 'replace' ? 'replace' : 'merge';
    if (rawRecords.length === 0) {
      res.status(400).json({ error: 'No records provided for batch sync.' });
      return;
    }

    const bulkOps: any[] = [];
    const incomingIds: string[] = [];

    for (const item of rawRecords) {
      if (!item || typeof item !== 'object') continue;
      const rawId = item.recordId || (item._id && item._id.$oid) || item._id || item.id;
      const id = sanitizeId(String(rawId || '')) || crypto.randomBytes(12).toString('hex');
      const clean = sanitizeMortgageInput(item, id);
      if (!clean.Name) continue;
      const { _id, ...docFields } = clean;
      incomingIds.push(id);
      bulkOps.push({
        updateOne: {
          filter: { recordId: id },
          update: { $set: { ...docFields, recordId: id } },
          upsert: true
        }
      });
    }

    if (mode === 'replace' && incomingIds.length > 0) {
      await db.collection('mortgages').deleteMany({ recordId: { $nin: incomingIds } });
    }
    if (bulkOps.length > 0) {
      await db.collection('mortgages').bulkWrite(bulkOps, { ordered: false });
    }

    res.json({ ok: true, count: bulkOps.length });
  });

  app.post('/api/mortgages', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected. Set MONGODB_URI in Secrets.' });
      return;
    }
    const id = sanitizeId(req.body?.recordId || req.body?.id) || crypto.randomBytes(12).toString('hex');
    const clean = sanitizeMortgageInput(req.body || {}, id);
    const { _id, ...docFields } = clean;
    await db.collection('mortgages').updateOne(
      { recordId: id },
      { $set: { ...docFields, recordId: id } },
      { upsert: true }
    );
    res.json({ ok: true, record: clean });
  });

  app.put('/api/mortgages/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const id = sanitizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid record ID.' });
      return;
    }
    const clean = sanitizeMortgageInput(req.body || {}, id);
    const { _id, ...docFields } = clean;
    await db.collection('mortgages').updateOne(
      { recordId: id },
      { $set: { ...docFields, recordId: id } },
      { upsert: true }
    );
    res.json({ ok: true, record: clean });
  });

  app.delete('/api/mortgages/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const id = sanitizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid record ID.' });
      return;
    }
    await db.collection('mortgages').deleteOne({ recordId: id });
    res.json({ ok: true });
  });

  // --- 4. Protected FL Property / Permits CRUD, Batch & Bulk Update Routes ---
  app.post('/api/permits/batch', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const rawRecords = Array.isArray(req.body?.records) ? req.body.records : [];
    const mode = req.body?.mode === 'replace' ? 'replace' : 'merge';
    if (rawRecords.length === 0) {
      res.status(400).json({ error: 'No permit records provided for batch sync.' });
      return;
    }

    const bulkOps: any[] = [];
    const incomingIds: string[] = [];

    for (const item of rawRecords) {
      if (!item || typeof item !== 'object') continue;
      const rawId = item.recordId || (item._id && item._id.$oid) || item._id || item.id;
      const id = sanitizeId(String(rawId || '')) || crypto.randomBytes(12).toString('hex');
      const clean = sanitizePermitInput(item, id);
      if (!clean.zip && !clean.City) continue;
      const { _id, ...docFields } = clean;
      incomingIds.push(id);
      bulkOps.push({
        updateOne: {
          filter: { recordId: id },
          update: { $set: { ...docFields, recordId: id } },
          upsert: true
        }
      });
    }

    if (mode === 'replace' && incomingIds.length > 0) {
      await db.collection('permits').deleteMany({ recordId: { $nin: incomingIds } });
    }
    if (bulkOps.length > 0) {
      await db.collection('permits').bulkWrite(bulkOps, { ordered: false });
    }

    res.json({ ok: true, count: bulkOps.length });
  });

  app.post('/api/permits', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const id = sanitizeId(req.body?.recordId || req.body?.id) || crypto.randomBytes(12).toString('hex');
    const clean = sanitizePermitInput(req.body || {}, id);
    const { _id, ...docFields } = clean;
    await db.collection('permits').updateOne(
      { recordId: id },
      { $set: { ...docFields, recordId: id } },
      { upsert: true }
    );
    res.json({ ok: true, record: clean });
  });

  app.put('/api/permits/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const id = sanitizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid record ID.' });
      return;
    }
    const clean = sanitizePermitInput(req.body || {}, id);
    const { _id, ...docFields } = clean;
    await db.collection('permits').updateOne(
      { recordId: id },
      { $set: { ...docFields, recordId: id } },
      { upsert: true }
    );
    res.json({ ok: true, record: clean });
  });

  app.delete('/api/permits/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const id = sanitizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid record ID.' });
      return;
    }
    await db.collection('permits').deleteOne({ recordId: id });
    res.json({ ok: true });
  });

  app.post('/api/permits/bulk-links', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const options = req.body as BulkUpdateLinksOptions;
    if (!options || typeof options !== 'object') {
      res.status(400).json({ error: 'Invalid bulk update payload.' });
      return;
    }

    const normCity = sanitizeString(options.targetCity, 120).toUpperCase();
    const normCounty = sanitizeString(options.targetCounty, 120).toUpperCase();
    const zipsSet = new Set((Array.isArray(options.customZips) ? options.customZips : []).map((z) => formatZipCode(z)));
    const idsSet =
      Array.isArray(options.selectedRecordIds) && options.selectedRecordIds.length > 0
        ? new Set(options.selectedRecordIds.map((id) => sanitizeId(id)))
        : null;

    const allPermits = await db.collection('permits').find({}).toArray();
    const bulkOps: any[] = [];
    const now = formatCurrentTimestamp();

    for (const rec of allPermits) {
      const recId = String(rec.recordId || rec._id);
      if (idsSet && !idsSet.has(recId)) continue;

      const recCity = String(rec.City || '').trim().toUpperCase();
      const recCounty = String(rec.County || '').trim().toUpperCase();
      const recZip = formatZipCode(rec.zip);

      let matches = false;
      if (options.scope === 'city') {
        matches = normCity ? recCity === normCity : false;
      } else if (options.scope === 'county') {
        matches = normCounty ? recCounty === normCounty : false;
      } else if (options.scope === 'city_and_county') {
        matches = (normCity ? recCity === normCity : true) && (normCounty ? recCounty === normCounty : true);
      } else if (options.scope === 'zips') {
        matches = zipsSet.has(recZip);
      } else if (options.scope === 'filtered') {
        matches = idsSet ? idsSet.has(recId) : true;
      }

      if (!matches) continue;

      const updates: Record<string, any> = {};
      if (options.updatePaLink) {
        const val = sanitizeNullableUrl(options.newPaLink, 500);
        if (!options.onlyIfEmpty || !rec.PAlink) {
          updates.PAlink = val;
        }
      }
      if (options.updateCountyPermitLink) {
        const val = sanitizeNullableUrl(options.newCountyPermitLink, 500);
        if (!options.onlyIfEmpty || !rec.PermitByCounty) {
          updates.PermitByCounty = val;
        }
      }
      if (options.updateCityPermitLink) {
        const val = sanitizeNullableUrl(options.newCityPermitLink, 500);
        if (!options.onlyIfEmpty || !rec.PermitByCity) {
          updates.PermitByCity = val;
        }
      }

      if (Object.keys(updates).length > 0) {
        updates.LastUpdated = now;
        bulkOps.push({
          updateOne: {
            filter: { recordId: recId },
            update: { $set: updates }
          }
        });
      }
    }

    if (bulkOps.length > 0) {
      await db.collection('permits').bulkWrite(bulkOps, { ordered: false });
    }

    res.json({ ok: true, updatedCount: bulkOps.length });
  });

  // --- 5. Protected Insurance Carriers CRUD Routes ---
  app.post('/api/carriers', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const id = sanitizeId(req.body?.id) || crypto.randomBytes(8).toString('hex');
    const clean = sanitizeCarrierInput(req.body || {}, id);
    await db.collection('carriers').updateOne(
      { id },
      { $set: clean },
      { upsert: true }
    );
    res.json({ ok: true, record: clean });
  });

  app.put('/api/carriers/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const id = sanitizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid carrier ID.' });
      return;
    }
    const clean = sanitizeCarrierInput(req.body || {}, id);
    await db.collection('carriers').updateOne(
      { id },
      { $set: clean },
      { upsert: true }
    );
    res.json({ ok: true, record: clean });
  });

  app.delete('/api/carriers/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const db = await getDb();
    if (!db) {
      res.status(503).json({ error: 'MongoDB is not connected.' });
      return;
    }
    const id = sanitizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid carrier ID.' });
      return;
    }
    await db.collection('carriers').deleteOne({ id });
    res.json({ ok: true });
  });

  // --- 6. Mount Vite Dev Server or Production Static Assets ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FL InsureBase server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
