import { MongoClient, Db } from 'mongodb';
import crypto from 'node:crypto';
import { formatZipCode } from './utils/permitFormatters';
import { formatCurrentTimestamp } from './utils/formatters';

interface Env {
  MONGODB_URI?: string;
  MONGODB_DB_NAME?: string;
  ADMIN_PASSCODE?: string;
  ASSETS: {
    fetch: (req: Request) => Promise<Response>;
  };
}

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

// Module-scoped MongoClient pool for warm Cloudflare Worker isolates
let cachedClient: MongoClient | null = null;
let cachedUri: string | null = null;
let indexesEnsured = false;

// Per-IP login rate limiter (5 failed attempts per 60s window per isolate)
const LOGIN_WINDOW_MS = 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) return false;
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
  if (val === null || val === undefined || typeof val !== 'string') return null;
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

function verifySignedAdminToken(authHeader: string | null, signingKey: string | null): boolean {
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

async function resolveSigningKey(db: Db | null, env: Env): Promise<string | null> {
  const envPass = (env.ADMIN_PASSCODE || '').trim();
  if (envPass) {
    return crypto.createHash('sha256').update(`env:${envPass}`).digest('hex');
  }
  if (db) {
    const doc = await db.collection('meta').findOne({ _id: 'admin_auth' as unknown as any });
    if (doc && typeof doc.hash === 'string' && doc.hash) {
      return doc.hash;
    }
  }
  return null;
}

function jsonResponse(data: unknown, status = 200, allowPublicCors = false): Response {
  const headers: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store, no-cache, must-revalidate',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin'
  };
  if (allowPublicCors) {
    headers['access-control-allow-origin'] = '*';
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function sanitizeMortgageDoc(body: Record<string, unknown>, id: string) {
  return {
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

function sanitizePermitDoc(body: Record<string, unknown>, id: string) {
  const rawZip = typeof body.zip === 'number' || typeof body.zip === 'string' ? body.zip : '';
  const doc: Record<string, unknown> = {
    recordId: id,
    zip: formatZipCode(rawZip),
    City: sanitizeString(body.City, 120),
    County: sanitizeString(body.County, 120).toUpperCase(),
    State: sanitizeString(body.State || 'FL', 20).toUpperCase(),
    PAlink: sanitizeNullableUrl(body.PAlink, 500),
    PermitByCounty: sanitizeNullableUrl(body.PermitByCounty, 500),
    PermitByCity: sanitizeNullableUrl(body.PermitByCity, 500),
    Terrain: sanitizeString(body.Terrain, 10) || undefined,
    LastUpdated: sanitizeString(body.LastUpdated, 40) || formatCurrentTimestamp()
  };
  if (typeof body.lat === 'number' && Number.isFinite(body.lat)) {
    doc.lat = body.lat;
  }
  if (typeof body.long === 'number' && Number.isFinite(body.long)) {
    doc.long = body.long;
  }
  return doc;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (!path.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    const dbName = (env.MONGODB_DB_NAME || 'fl_insurebase').trim() || 'fl_insurebase';
    const uri = (env.MONGODB_URI || '').trim();

    async function withDb<T>(fn: (db: Db) => Promise<T>): Promise<T | null> {
      if (!uri) return null;
      try {
        if (!cachedClient || cachedUri !== uri) {
          if (cachedClient) {
            await cachedClient.close().catch(() => {});
          }
          cachedClient = new MongoClient(uri, {
            serverSelectionTimeoutMS: 6000,
            maxPoolSize: 2,
            maxIdleTimeMS: 30000
          });
          await cachedClient.connect();
          cachedUri = uri;
          indexesEnsured = false;
        }
        const db = cachedClient.db(dbName);
        if (!indexesEnsured) {
          indexesEnsured = true;
          Promise.all([
            db.collection('mortgages').createIndex({ recordId: 1 }, { unique: true }).catch(() => {}),
            db.collection('permits').createIndex({ recordId: 1 }, { unique: true }).catch(() => {}),
            db.collection('carriers').createIndex({ id: 1 }, { unique: true }).catch(() => {})
          ]).catch(() => {});
        }
        return await fn(db);
      } catch (err) {
        if (cachedClient) {
          await cachedClient.close().catch(() => {});
        }
        cachedClient = null;
        cachedUri = null;
        indexesEnsured = false;
        throw err;
      }
    }

    try {
      if (path === '/api/auth/status' && request.method === 'GET') {
        const envPass = (env.ADMIN_PASSCODE || '').trim();
        let dbClaimed = false;
        let dbConnected = false;
        if (uri) {
          await withDb(async (db) => {
            dbConnected = true;
            const doc = await db.collection('meta').findOne({ _id: 'admin_auth' as unknown as any });
            dbClaimed = Boolean(doc && doc.hash && doc.salt);
          });
        }
        return jsonResponse({
          configured: Boolean(envPass || dbClaimed),
          dbConnected,
          dbName
        });
      }

      if (path === '/api/auth/setup' && request.method === 'POST') {
        const clientIp = getClientIp(request);
        if (isRateLimited(clientIp)) {
          return jsonResponse(
            { error: 'Too many authentication attempts. Please wait 60 seconds and try again.' },
            429
          );
        }

        if ((env.ADMIN_PASSCODE || '').trim()) {
          return jsonResponse({ error: 'Admin passcode is already configured.' }, 403);
        }
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const passcode = sanitizeString(body.passcode, 128);
        if (!passcode || passcode.length < 4) {
          return jsonResponse({ error: 'Passcode must be at least 4 characters.' }, 400);
        }
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = hashPasswordScrypt(passcode, salt);

        const saved = await withDb(async (db) => {
          const existing = await db.collection('meta').findOne({ _id: 'admin_auth' as unknown as any });
          if (existing && existing.hash) return false;
          await db.collection('meta').updateOne(
            { _id: 'admin_auth' as unknown as any },
            { $set: { salt, hash, updatedAt: new Date().toISOString() } },
            { upsert: true }
          );
          return true;
        });

        if (saved === false) {
          return jsonResponse({ error: 'Admin passcode has already been claimed.' }, 403);
        }
        clearFailedAttempts(clientIp);
        const token = createSignedAdminToken(hash);
        return jsonResponse({ token, configured: true });
      }

      if (path === '/api/auth/login' && request.method === 'POST') {
        const clientIp = getClientIp(request);
        if (isRateLimited(clientIp)) {
          return jsonResponse(
            { error: 'Too many failed login attempts. Please wait 60 seconds and try again.' },
            429
          );
        }

        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const passcode = sanitizeString(body.passcode, 128);
        const envPass = (env.ADMIN_PASSCODE || '').trim();
        let valid = false;
        let signingKey: string | null = null;

        if (envPass) {
          valid = verifyEnvPasscode(passcode, envPass);
          signingKey = crypto.createHash('sha256').update(`env:${envPass}`).digest('hex');
        } else {
          await withDb(async (db) => {
            const doc = await db.collection('meta').findOne({ _id: 'admin_auth' as unknown as any });
            if (doc && typeof doc.salt === 'string' && typeof doc.hash === 'string') {
              valid = verifyPasswordScrypt(passcode, doc.salt, doc.hash);
              signingKey = doc.hash;
            }
          });
        }
        if (!valid || !signingKey) {
          recordFailedAttempt(clientIp);
          return jsonResponse({ error: 'Invalid admin passcode.' }, 401);
        }
        clearFailedAttempts(clientIp);
        const token = createSignedAdminToken(signingKey);
        return jsonResponse({ token });
      }

      if (path === '/api/auth/logout' && request.method === 'POST') {
        return jsonResponse({ ok: true });
      }

      if (path === '/api/records' && request.method === 'GET') {
        if (!uri) {
          return jsonResponse(
            { source: 'static', dbConnected: false, mortgages: null, permits: null, carriers: null },
            200,
            true
          );
        }
        const data = await withDb(async (db) => {
          const [rawMortgages, rawPermits, rawCarriers] = await Promise.all([
            db.collection('mortgages').find({}).toArray(),
            db.collection('permits').find({}).toArray(),
            db.collection('carriers').find({}).toArray()
          ]);
          return {
            source: 'mongodb',
            dbConnected: true,
            dbName,
            mortgages: rawMortgages.map((doc) => ({ ...doc, _id: { $oid: String(doc.recordId || doc._id) } })),
            permits: rawPermits.map((doc) => ({ ...doc, _id: { $oid: String(doc.recordId || doc._id) } })),
            carriers: rawCarriers.map((doc) => ({ ...doc, id: String(doc.id || doc.recordId || doc._id) }))
          };
        });
        return jsonResponse(data || { source: 'static', dbConnected: false }, 200, true);
      }

      // All mutation routes require stateless HMAC-verified admin token
      const authHeader = request.headers.get('authorization');
      if (!uri) {
        return jsonResponse({ error: 'MongoDB is not configured.' }, 503);
      }

      const mutationResult = await withDb(async (db) => {
        const signingKey = await resolveSigningKey(db, env);
        if (!verifySignedAdminToken(authHeader, signingKey)) {
          return { unauthorized: true };
        }

        if (path === '/api/mortgages/batch' && request.method === 'POST') {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const rawRecords = Array.isArray(body.records) ? body.records : [];
          const mode = body.mode === 'replace' ? 'replace' : 'merge';
          const bulkOps: any[] = [];
          const incomingIds: string[] = [];

          for (const item of rawRecords) {
            if (!item || typeof item !== 'object') continue;
            const rawId = item.recordId || (item._id && item._id.$oid) || item._id || item.id;
            const id = sanitizeId(String(rawId || '')) || crypto.randomBytes(12).toString('hex');
            const clean = sanitizeMortgageDoc(item, id);
            if (!clean.Name) continue;
            incomingIds.push(id);
            bulkOps.push({
              updateOne: {
                filter: { recordId: id },
                update: { $set: clean },
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
          return { data: { ok: true, count: bulkOps.length } };
        }

        if (path.startsWith('/api/mortgages')) {
          const idFromUrl = sanitizeId(path.split('/')[3] || '');
          if (request.method === 'DELETE' && idFromUrl) {
            await db.collection('mortgages').deleteOne({ recordId: idFromUrl });
            return { data: { ok: true } };
          }
          const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
          const id = idFromUrl || sanitizeId(body.recordId || body.id) || crypto.randomBytes(12).toString('hex');
          const clean = sanitizeMortgageDoc(body, id);
          await db.collection('mortgages').updateOne({ recordId: id }, { $set: clean }, { upsert: true });
          return { data: { ok: true, record: { ...clean, _id: { $oid: id } } } };
        }

        if (path === '/api/permits/batch' && request.method === 'POST') {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const rawRecords = Array.isArray(body.records) ? body.records : [];
          const mode = body.mode === 'replace' ? 'replace' : 'merge';
          const bulkOps: any[] = [];
          const incomingIds: string[] = [];

          for (const item of rawRecords) {
            if (!item || typeof item !== 'object') continue;
            const rawId = item.recordId || (item._id && item._id.$oid) || item._id || item.id;
            const id = sanitizeId(String(rawId || '')) || crypto.randomBytes(12).toString('hex');
            const clean = sanitizePermitDoc(item, id);
            if (!clean.zip && !clean.City) continue;
            incomingIds.push(id);
            bulkOps.push({
              updateOne: {
                filter: { recordId: id },
                update: { $set: clean },
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
          return { data: { ok: true, count: bulkOps.length } };
        }

        if (path === '/api/permits/bulk-links' && request.method === 'POST') {
          const options = (await request.json().catch(() => ({}))) as Record<string, any>;
          const normCity = sanitizeString(options.targetCity, 120).toUpperCase();
          const normCounty = sanitizeString(options.targetCounty, 120).toUpperCase();
          const zipsSet = new Set(
            (Array.isArray(options.customZips) ? options.customZips : []).map((z: any) => formatZipCode(z))
          );
          const idsSet =
            Array.isArray(options.selectedRecordIds) && options.selectedRecordIds.length > 0
              ? new Set(options.selectedRecordIds.map((id: any) => sanitizeId(id)))
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
            if (options.scope === 'city') matches = normCity ? recCity === normCity : false;
            else if (options.scope === 'county') matches = normCounty ? recCounty === normCounty : false;
            else if (options.scope === 'city_and_county')
              matches = (normCity ? recCity === normCity : true) && (normCounty ? recCounty === normCounty : true);
            else if (options.scope === 'zips') matches = zipsSet.has(recZip);
            else if (options.scope === 'filtered') matches = idsSet ? idsSet.has(recId) : true;
            if (!matches) continue;

            const updates: Record<string, any> = {};
            if (options.updatePaLink && (!options.onlyIfEmpty || !rec.PAlink)) {
              updates.PAlink = sanitizeNullableUrl(options.newPaLink, 500);
            }
            if (options.updateCountyPermitLink && (!options.onlyIfEmpty || !rec.PermitByCounty)) {
              updates.PermitByCounty = sanitizeNullableUrl(options.newCountyPermitLink, 500);
            }
            if (options.updateCityPermitLink && (!options.onlyIfEmpty || !rec.PermitByCity)) {
              updates.PermitByCity = sanitizeNullableUrl(options.newCityPermitLink, 500);
            }
            if (Object.keys(updates).length > 0) {
              updates.LastUpdated = now;
              bulkOps.push({ updateOne: { filter: { recordId: recId }, update: { $set: updates } } });
            }
          }
          if (bulkOps.length > 0) {
            await db.collection('permits').bulkWrite(bulkOps, { ordered: false });
          }
          return { data: { ok: true, updatedCount: bulkOps.length } };
        }

        if (path.startsWith('/api/permits')) {
          const idFromUrl = sanitizeId(path.split('/')[3] || '');
          if (request.method === 'DELETE' && idFromUrl) {
            await db.collection('permits').deleteOne({ recordId: idFromUrl });
            return { data: { ok: true } };
          }
          const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
          const id = idFromUrl || sanitizeId(body.recordId || body.id) || crypto.randomBytes(12).toString('hex');
          const clean = sanitizePermitDoc(body, id);
          await db.collection('permits').updateOne({ recordId: id }, { $set: clean }, { upsert: true });
          return { data: { ok: true, record: { ...clean, _id: { $oid: id } } } };
        }

        if (path.startsWith('/api/carriers')) {
          const idFromUrl = sanitizeId(path.split('/')[3] || '');
          if (request.method === 'DELETE' && idFromUrl) {
            await db.collection('carriers').deleteOne({ id: idFromUrl });
            return { data: { ok: true } };
          }
          const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
          const id = idFromUrl || sanitizeId(body.id) || crypto.randomBytes(8).toString('hex');
          const clean = {
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
          await db.collection('carriers').updateOne({ id }, { $set: clean }, { upsert: true });
          return { data: { ok: true, record: clean } };
        }

        return { notFound: true };
      });

      if (!mutationResult) {
        return jsonResponse({ error: 'Database unavailable' }, 503);
      }
      if ('unauthorized' in mutationResult && mutationResult.unauthorized) {
        return jsonResponse({ error: 'Unauthorized. Valid Admin session required.' }, 401);
      }
      if ('notFound' in mutationResult && mutationResult.notFound) {
        return jsonResponse({ error: 'Not found' }, 404);
      }
      return jsonResponse(mutationResult.data);
    } catch (err) {
      console.error('Worker API error:', err instanceof Error ? err.message : 'Unknown error');
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  }
};
