import { getAccount, saveAccount } from '../lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Server-Secret');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, reason: 'method_not_allowed' });

  const secret = req.headers['x-server-secret'];
  if (process.env.SERVER_SECRET && secret !== process.env.SERVER_SECRET) {
    return res.status(403).json({ ok: false, reason: 'bad_secret' });
  }

  const { token, username } = req.body || {};

  if (!token || typeof token !== 'string' || !/^[a-f0-9]{16}$/i.test(token)) {
    return res.status(400).json({ ok: false, reason: 'invalid_token' });
  }

  if (!username || typeof username !== 'string' || username.length < 3 || username.length > 16) {
    return res.status(400).json({ ok: false, reason: 'invalid_username' });
  }

  const account = await getAccount(token);
  if (!account) {
    return res.status(404).json({ ok: false, reason: 'unknown_token' });
  }

  account.username = username;
  account.last_seen = Date.now();
  await saveAccount(token, account);

  return res.status(200).json({
    ok: true,
    account_id: account.id,
    token: account.token,
    username: account.username
  });
}
