import { kv } from '@vercel/kv';
import { getAccount, saveAccount } from '../lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Server-Secret');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ ok: false, reason: 'method_not_allowed' });

  const secret = req.headers['x-server-secret'];
  if (process.env.SERVER_SECRET && secret !== process.env.SERVER_SECRET) {
    return res.status(403).json({ ok: false, reset: false, reason: 'bad_secret' });
  }

  const token = req.query[''] || req.query.token || req.query.t || null;

  if (!token) {
    return res.status(400).json({ ok: false, reset: true, reason: 'missing_token' });
  }

  if (typeof token !== 'string' || !/^[a-f0-9]{16}$/i.test(token)) {
    return res.status(400).json({ ok: false, reset: true, reason: 'invalid_token_format' });
  }

  try {
    let account = await getAccount(token);

    if (!account) {
      account = {
        id: crypto.randomUUID(),
        token,
        username: null,
        created_at: Date.now(),
        last_seen: Date.now(),
        banned: false
      };
      await saveAccount(token, account);

      return res.status(200).json({
        ok: true,
        account_id: account.id,
        token: account.token,
        username: account.username,
        reset: true,
        new_account: true,
        banned: false,
        server: 'private'
      });
    }

    if (account.banned) {
      return res.status(200).json({
        ok: false,
        account_id: account.id,
        token: account.token,
        reset: false,
        banned: true,
        reason: 'banned'
      });
    }

    account.last_seen = Date.now();
    await saveAccount(token, account);

    return res.status(200).json({
      ok: true,
      account_id: account.id,
      token: account.token,
      username: account.username,
      reset: false,
      new_account: false,
      banned: false,
      created_at: account.created_at,
      server: 'private'
    });
  } catch (err) {
    console.error('account_error', err);
    return res.status(500).json({ ok: false, reset: false, reason: 'server_error' });
  }
}
