import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform }) => {
  const ns = platform?.env?.STORAGE_KV;
  if (!ns) throw error(500, 'STORAGE_KV binding not configured');

  const prefix = url.searchParams.get('prefix') || '';
  const allKeys: string[] = [];
  let cursor: string | undefined;
  let complete = false;
  while (!complete) {
    const result = await ns.list({ prefix, cursor });
    for (const k of result.keys) allKeys.push(k.name);
    complete = result.list_complete;
    cursor = (result as { cursor?: string }).cursor;
    if (allKeys.length > 5000) break;
  }

  return json({ keys: allKeys, prefix, shared: false });
};
