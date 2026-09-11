const DATA_URL = './data/site-data.json';
let cached = null;
export async function loadData() {
  if (cached) return cached;
  const r = await fetch(DATA_URL, { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  cached = await r.json();
  return cached;
}
