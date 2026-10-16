import { kv } from '@vercel/kv';

export async function getAccount(token) {
  if (!token) return null;
  return await kv.get(`account:${token}`);
}

export async function saveAccount(token, data) {
  await kv.set(`account:${token}`, data);
  return data;
}

export async function deleteAccount(token) {
  await kv.del(`account:${token}`);
}
