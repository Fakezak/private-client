import { saveUid, getUid } from '../lib/store.js';

const ZAKA = 'zaka client v1';

function parseUid(req) {
  let uid =
    req.query.uid ||
    req.query.player_uid ||
    req.query.playerId ||
    req.query.user_id ||
    req.query.userId ||
    req.query.id ||
    null;

  if (!uid) uid = req.headers['x-player-uid'] || req.headers['x-uid'] || null;

  if (!uid && req.method === 'POST' && req.body) {
    uid = req.body.uid || req.body.player_uid || req.body.playerId ||
          req.body.user_id || req.body.userId || req.body.id || null;
  }

  if (!uid) {
    const raw = req.url || '';
    const qi = raw.indexOf('?');
    if (qi !== -1) {
      const qs = raw.slice(qi + 1);
      if (qs.startsWith('=')) uid = decodeURIComponent(qs.slice(1).split('&')[0]);
    }
  }

  return uid;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Server-Secret,X-Player-Uid,Accept');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const secret = req.headers['x-server-secret'];
  if (process.env.SERVER_SECRET && secret !== process.env.SERVER_SECRET) {
    if (!(req.headers.accept || '').includes('text/html')) {
      return res.status(403).json({ ok: false, reason: 'bad_secret' });
    }
  }

  const uid = parseUid(req);
  const isBrowser = (req.headers.accept || '').includes('text/html') && !secret;

  // -------- Browser view (white OK page) --------
  if (isBrowser) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<!doctype html>
<html><head><meta charset="utf-8"><title>OK</title>
<style>html,body{margin:0;background:#fff;color:#111;font-family:system-ui;height:100%}
.wrap{display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column}
h1{font-size:96px;margin:0;letter-spacing:8px}p{margin:12px 0 0;color:#666;font-size:14px}
code{background:#f2f2f2;padding:2px 6px;border-radius:4px}</style></head>
<body><div class="wrap"><h1>OK</h1>
<p>private-client ${uid ? '• uid <code>' + uid + '</code>' : ''}</p></div></body></html>`);
  }

  // -------- Missing UID --------
  if (!uid) {
    return res.status(400).json({
      ok: false, code: 1, status: 1,
      reason: 'missing_uid',
      msg: 'uid required', message: 'uid required', error: 'uid required'
    });
  }

  // -------- LOOKUP: does this player already exist? --------
  let existing = null;
  try {
    existing = await getUid(String(uid));
  } catch (e) {
    console.error('kv_get_error', e);
  }

  const now = Date.now();

  // ---------- EXISTING ACCOUNT ----------
  if (existing) {
    existing.last_seen = now;
    existing.ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    existing.ua = req.headers['user-agent'] || 'unknown';

    try { await saveUid(existing.uid, existing); } catch (e) { console.error('kv_save_error', e); }

    return res.status(200).json({
      code: 0, status: 0, success: true, ok: true,

      msg: ZAKA, message: ZAKA, error: ZAKA, motd: ZAKA,
      banner: ZAKA, lobby_banner: ZAKA, status_text: ZAKA,
      network_error: ZAKA, display_message: ZAKA, server_message: ZAKA,

      uid: existing.uid,
      player_id: existing.uid,
      playerId: existing.uid,
      user_id: existing.uid,
      userId: existing.uid,
      account_id: existing.uid,

      username: existing.username || null,
      display_name: existing.display_name || existing.username || existing.uid,

      token: existing.token || (existing.uid + '_' + now),
      session: existing.token || (existing.uid + '_' + now),
      sessionId: existing.token || (existing.uid + '_' + now),
      session_id: existing.token || (existing.uid + '_' + now),

      reset: false,
      new_account: false,
      is_new: false,
      isNew: false,
      exists: true,
      registered: true,
      needs_registration: false,
      needsRegistration: false,
      create_account: false,
      createAccount: false,

      banned: existing.banned || false,
      created_at: existing.first_seen || existing.created_at || now,

      server: 'https://private-client-ten.vercel.app',
      serverUrl: 'https://private-client-ten.vercel.app',
      server_url: 'https://private-client-ten.vercel.app',
      redirect: 'https://private-client-ten.vercel.app',
      url: 'https://private-client-ten.vercel.app'
    });
  }

  // ---------- NEW ACCOUNT (first time) ----------
  const newRecord = {
    uid: String(uid),
    username: null,
    display_name: null,
    token: String(uid) + '_' + now,
    first_seen: now,
    last_seen: now,
    created_at: now,
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown',
    ua: req.headers['user-agent'] || 'unknown',
    banned: false,
    server: 'private'
  };

  try { await saveUid(newRecord.uid, newRecord); } catch (e) { console.error('kv_save_error', e); }

  return res.status(200).json({
    code: 0, status: 0, success: true, ok: true,

    msg: ZAKA, message: ZAKA, error: ZAKA, motd: ZAKA,
    banner: ZAKA, lobby_banner: ZAKA, status_text: ZAKA,
    network_error: ZAKA, display_message: ZAKA, server_message: ZAKA,

    uid: newRecord.uid,
    player_id: newRecord.uid,
    playerId: newRecord.uid,
    user_id: newRecord.uid,
    userId: newRecord.uid,
    account_id: newRecord.uid,

    username: null,
    display_name: newRecord.uid,

    token: newRecord.token,
    session: newRecord.token,
    sessionId: newRecord.token,
    session_id: newRecord.token,

    reset: true,
    new_account: true,
    is_new: true,
    isNew: true,
    exists: false,
    registered: false,
    needs_registration: true,
    needsRegistration: true,
    create_account: true,
    createAccount: true,

    banned: false,
    created_at: now,

    server: 'https://private-client-ten.vercel.app',
    serverUrl: 'https://private-client-ten.vercel.app',
    server_url: 'https://private-client-ten.vercel.app',
    redirect: 'https://private-client-ten.vercel.app',
    url: 'https://private-client-ten.vercel.app'
  });
}
