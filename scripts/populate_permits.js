import fs from 'fs';

// Helper to normalize record
function normalizePermit(raw) {
  const id = raw._id && raw._id.$oid ? raw._id.$oid : (typeof raw._id === 'string' ? raw._id : undefined);
  const zip = String(raw.zip).padStart(5, '0');
  const city = (raw.City || raw.city || '').trim();
  const county = (raw.County || raw.county || '').trim().toUpperCase();
  const state = (raw.State || raw.state || 'FL').trim().toUpperCase();
  const pa = raw.PAlink || raw.PALink || raw.paLink || null;
  const countyPermit = raw.PermitByCounty || raw.permitByCounty || null;
  const cityPermit = raw.PermitByCity || raw.permitByCity || null;
  const lat = typeof raw.lat === 'number' ? raw.lat : (raw.lat ? parseFloat(raw.lat) : undefined);
  const long = typeof raw.long === 'number' ? raw.long : (raw.long ? parseFloat(raw.long) : undefined);
  const terrain = (raw.Terrain || raw.terrain || 'B').trim().toUpperCase();

  return {
    _id: id ? { $oid: id } : id,
    zip,
    City: city,
    County: county,
    State: state,
    PAlink: pa && pa.trim() ? pa.trim() : null,
    PermitByCounty: countyPermit && countyPermit.trim() ? countyPermit.trim() : null,
    PermitByCity: cityPermit && cityPermit.trim() ? cityPermit.trim() : null,
    lat: Number.isNaN(lat) ? undefined : lat,
    long: Number.isNaN(long) ? undefined : long,
    Terrain: terrain,
    LastUpdated: '2026-03-20'
  };
}
