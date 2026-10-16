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

  // -------- Browser view --------
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
      ok: false,
      code: 1,
      status: 1,
      reason: 'missing_uid',
      msg: 'uid required',
      message: 'uid required',
      error: 'uid required'
    });
  }

  // -------- Save UID --------
  const record = {
    uid: String(uid),
    first_seen: Date.now(),
    last_seen: Date.now(),
    ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown',
    ua: req.headers['user-agent'] || 'unknown',
    server: 'private'
  };

  try {
    await saveUid(record.uid, record);
  } catch (e) {
    console.error('kv_save_error', e);
  }

  const sessionToken = record.uid + '_' + Date.now();

  // -------- Response --------
  return res.status(200).json({
    code: 0,
    status: 0,
    success: true,
    ok: true,

    msg: ZAKA,
    message: ZAKA,
    error: ZAKA,
    errorMsg: ZAKA,
    error_msg: ZAKA,
    errmsg: ZAKA,
    info: ZAKA,
    notice: ZAKA,
    motd: ZAKA,
    banner: ZAKA,
    lobby_banner: ZAKA,
    status_text: ZAKA,
    network_error: ZAKA,
    display_message: ZAKA,
    server_message: ZAKA,

    banner_html: `<color=#ff0000>${ZAKA}</color>`,
    banner_source: `\x07ff0000${ZAKA}`,

    uid: record.uid,
    player_id: record.uid,
    playerId: record.uid,
    user_id: record.uid,
    userId: record.uid,
    account_id: record.uid,

    token: sessionToken,
    session: sessionToken,
    sessionId: sessionToken,
    session_id: sessionToken,

    server: 'https://private-client-ten.vercel.app',
    serverUrl: 'https://private-client-ten.vercel.app',
    server_url: 'https://private-client-ten.vercel.app',
    redirect: 'https://private-client-ten.vercel.app',
    url: 'https://private-client-ten.vercel.app'
  });
}
