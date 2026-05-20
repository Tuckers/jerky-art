// /api/storage/list  -- GET, returns keys filtered by prefix
// Public (no auth required) so initial loads work without prompting.

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const prefix = url.searchParams.get('prefix') || '';

  // KV's list returns up to 1000 keys per call; paginate through all of them.
  const allKeys = [];
  let cursor;
  let complete = false;
  while (!complete) {
    const result = await env.STORAGE_KV.list({ prefix, cursor });
    for (const k of result.keys) allKeys.push(k.name);
    complete = result.list_complete;
    cursor = result.cursor;
    if (allKeys.length > 5000) break; // safety net
  }

  return json({ keys: allKeys, prefix, shared: false });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
