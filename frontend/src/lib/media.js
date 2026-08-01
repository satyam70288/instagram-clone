import { server } from '@/constant/config';

/** Build a usable media URL for absolute, relative, or Windows-style paths. */
export function resolveMediaUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const normalized = String(path).replace(/\\/g, '/').replace(/^\/+/, '');
  const base = (server || '').replace(/\/+$/, '');
  return base ? `${base}/${normalized}` : `/${normalized}`;
}
