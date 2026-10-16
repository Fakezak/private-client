import { kv } from '@vercel/kv';
import { getAccount, saveAccount } from '../lib/store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Server-Secret');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // Parse token — supports ?=abc, ?token=abc, ?t=abc
  let token = req.query.token || req.query.t || null;
  if (!token) {
    const raw = req.url || '';
    const qi = raw.indexOf('?');
    if (qi !== -1) {
      const qs = raw.slice(qi + 1);
      if (qs.startsWith('=')) token = decodeURIComponent(qs.slice(1).split('&')[0]);
    }
  }

  const wantsJSON =
    (req.headers.accept || '').includes('application/json') ||
    req.headers['x-server-secret']; // game clients send secret

  // ---------- BROWSER VIEW (white, says OK) ----------
  if (!wantsJSON) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const status = token ? 'OK' : 'OK';
    return res.status(200).send(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>OK</title>
<style>
  html,body{margin:0;padding:0;background:#ffffff;color:#111;font-family:system-ui,Segoe UI,Arial,sans-serif;height:100%}
  .wrap{display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column}
  h1{font-size:96px;margin:0;letter-spacing:8px}
  p{margin:12px 0 0;color:#666;font-size:14px}
  code{background:#f2f2f2;padding:2px 6px;border-radius:4px}
</style>
</head>
<body>
  <div class="wrap">
    <h1>${status}</h1>
    <p>private-client server is running${token ? ' • token <code>' + token + '</code>' : ''}</p>
  </div>
</body>
</html>`);
  }

  // ---------- GAME CLIENT (JSON) ----------
  if (!token) return res.status(400).json({ ok:false, reset:true, reason:'missing_token' });
  if (typeof token !== 'string' || !/^[a-f0-9]{16}$/i.test(token)) {
    return res.status(400).json({ ok:false, reset:true, reason:'invalid_token_format' });
  }

  try {
    let account = await getAccount(token);
    if (!account) {
      account = { id: crypto.randomUUID(), token, username:null, created_at:Date.now(), last_seen:Date.now(), banned:false };
      await saveAccount(token, account);
      return res.status(200).json({
        ok:true, account_id:account.id, token:account.token, username:account.username,
        reset:true, new_account:true, banned:false, server:'private'
      });
    }
    if (account.banned) {
      return res.status(200).json({ ok:false, account_id:account.id, token:account.token, reset:false, banned:true, reason:'banned' });
    }
    account.last_seen = Date.now();
    await saveAccount(token, account);
    return res.status(200).json({
      ok:true, account_id:account.id, token:account.token, username:account.username,
      reset:false, new_account:false, banned:false, created_at:account.created_at, server:'private'
    });
  } catch (err) {
    console.error('account_error', err);
    return res.status(500).json({ ok:false, reset:false, reason:'server_error' });
  }
}
