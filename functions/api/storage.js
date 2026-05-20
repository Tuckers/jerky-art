// /api/storage  -- GET (read), POST (write), DELETE
// Bindings required on the Pages project:
//   STORAGE_KV   - a KV namespace binding
//   WRITE_TOKEN  - a secret env var used for bearer auth on writes

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function requireAuth(request, env) {
  const expected = env.WRITE_TOKEN;
  if (!expected) {
    return json({ error: 'WRITE_TOKEN not configured on server' }, 500);
  }
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (token !== expected) {
    return json({ error: 'Unauthorized' }, 401);
  }
  return null;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!key) return json({ error: 'Missing ?key=' }, 400);

  const value = await env.STORAGE_KV.get(key);
  if (value === null) return json(null);
  return json({ key, value, shared: false });
}

export async function onRequestPost({ request, env }) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!key) return json({ error: 'Missing ?key=' }, 400);

  const value = await request.text();
  // KV value limit is 25 MiB; reject larger payloads early with a clear message.
  if (value.length > 24 * 1024 * 1024) {
    return json({ error: 'Value too large (>24 MiB)' }, 413);
  }

  await env.STORAGE_KV.put(key, value);
  return json({ key, value, shared: false });
}

export async function onRequestDelete({ request, env }) {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!key) return json({ error: 'Missing ?key=' }, 400);

  await env.STORAGE_KV.delete(key);
  return json({ key, deleted: true, shared: false });
}

// CORS preflight (same-origin in production so usually not needed,
// but harmless if you ever call this from elsewhere).
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
