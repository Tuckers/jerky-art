import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function requireAuth(request: Request, env: App.Platform['env'] | undefined): Response | null {
  const expected = env?.WRITE_TOKEN;
  if (!expected) return json({ error: 'WRITE_TOKEN not configured on server' }, { status: 500 });
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (token !== expected) return json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

function kv(platform: App.Platform | undefined): KVNamespace {
  const ns = platform?.env?.STORAGE_KV;
  if (!ns) throw error(500, 'STORAGE_KV binding not configured');
  return ns;
}

export const GET: RequestHandler = async ({ url, platform }) => {
  const key = url.searchParams.get('key');
  if (!key) return json({ error: 'Missing ?key=' }, { status: 400 });
  const value = await kv(platform).get(key);
  if (value === null) return json(null);
  return json({ key, value, shared: false });
};

export const POST: RequestHandler = async ({ request, url, platform }) => {
  const authErr = requireAuth(request, platform?.env);
  if (authErr) return authErr;
  const key = url.searchParams.get('key');
  if (!key) return json({ error: 'Missing ?key=' }, { status: 400 });
  const value = await request.text();
  if (value.length > 24 * 1024 * 1024) {
    return json({ error: 'Value too large (>24 MiB)' }, { status: 413 });
  }
  await kv(platform).put(key, value);
  return json({ key, value, shared: false });
};

export const DELETE: RequestHandler = async ({ request, url, platform }) => {
  const authErr = requireAuth(request, platform?.env);
  if (authErr) return authErr;
  const key = url.searchParams.get('key');
  if (!key) return json({ error: 'Missing ?key=' }, { status: 400 });
  await kv(platform).delete(key);
  return json({ key, deleted: true, shared: false });
};
