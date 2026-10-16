import { kv } from '@vercel/kv';

export async function saveUid(uid, data) {
  await kv.set(`uid:${uid}`, data);
  await kv.sadd('uids:all', String(uid));
  return data;
}

export async function getUid(uid) {
  if (!uid) return null;
  return await kv.get(`uid:${uid}`);
}
