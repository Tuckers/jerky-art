// Thin client over the KV-backed /api/storage endpoints.
// Reads are public; writes require the WRITE_TOKEN passed as a bearer token.

const AUTH_TOKEN_KEY = 'jerky-auth-token';

function getAuthToken(): string {
  let t = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!t) {
    t = prompt('Enter your collection edit token to save changes:');
    if (t) localStorage.setItem(AUTH_TOKEN_KEY, t.trim());
  }
  return t ? t.trim() : '';
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function authedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  if (!token) throw new Error('Auth token required');
  const headers = { ...(init.headers || {}), Authorization: `Bearer ${token}` };
  const res = await fetch(url, { ...init, headers });
  if (res.status === 401) {
    clearAuthToken();
    alert('Invalid edit token — please re-enter it on your next change.');
  }
  return res;
}

export async function storageGet(key: string): Promise<string | null> {
  const r = await fetch(`/api/storage?key=${encodeURIComponent(key)}`);
  if (!r.ok) return null;
  const body = (await r.json()) as { value?: string } | null;
  return body && typeof body.value === 'string' ? body.value : null;
}

export async function storageSet(key: string, value: string): Promise<boolean> {
  const r = await authedFetch(`/api/storage?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: value
  });
  return r.ok;
}

export async function storageDelete(key: string): Promise<boolean> {
  const r = await authedFetch(`/api/storage?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
  return r.ok;
}

export async function storageList(prefix: string): Promise<string[]> {
  const q = prefix ? `?prefix=${encodeURIComponent(prefix)}` : '';
  const r = await fetch(`/api/storage/list${q}`);
  if (!r.ok) return [];
  const body = (await r.json()) as { keys?: string[] };
  return Array.isArray(body.keys) ? body.keys : [];
}
