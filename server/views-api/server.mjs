import http from 'node:http';
import { Pool } from 'pg';

const port = Number(process.env.PORT || 8787);
const databaseUrl = process.env.DATABASE_URL;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 10000
});

const sendJson = (res, status, payload, origin = '') => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
};

const getCorsOrigin = (origin) => {
  if (!origin) return '*';
  if (allowedOrigins.length === 0) return origin;
  return allowedOrigins.includes(origin) ? origin : '';
};

await pool.query(`
  CREATE TABLE IF NOT EXISTS post_views (
    slug TEXT PRIMARY KEY,
    count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

const server = http.createServer(async (req, res) => {
  const origin = getCorsOrigin(req.headers.origin || '');

  if (req.method === 'OPTIONS') {
    if (!origin) return sendJson(res, 403, { error: 'Forbidden' }, '');
    return sendJson(res, 204, {}, origin);
  }

  if (req.url === '/health') {
    return sendJson(res, 200, { ok: true }, origin || '*');
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' }, origin || '*');
  }

  const match = req.url?.match(/^\/views\/([a-z0-9-]+)$/i);
  if (!match) {
    return sendJson(res, 404, { error: 'Not found' }, origin || '*');
  }

  if (req.headers.origin && !origin) {
    return sendJson(res, 403, { error: 'Forbidden origin' }, '');
  }

  const slug = match[1];

  try {
    const result = await pool.query(
      `
        INSERT INTO post_views (slug, count, updated_at)
        VALUES ($1, 1, NOW())
        ON CONFLICT (slug)
        DO UPDATE SET count = post_views.count + 1, updated_at = NOW()
        RETURNING count
      `,
      [slug]
    );

    return sendJson(res, 200, { slug, count: Number(result.rows[0].count) }, origin || '*');
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'Internal server error' }, origin || '*');
  }
});

server.listen(port, () => {
  console.log(`views-api listening on ${port}`);
});
