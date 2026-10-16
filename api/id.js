// api/id.js — full trust handshake
export default function handler(req, res) {
  // ---- Standard headers ----
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");
  res.setHeader("pragma", "no-cache");
  res.setHeader("expires", "0");

  // ---- CORS (let any game/origin read it) ----
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, OPTIONS");
  res.setHeader("access-control-allow-headers", "*");
  res.setHeader("access-control-expose-headers", "*");

  // ---- Trust / handshake signals ----
  res.setHeader("x-server", "k-modz-unban");
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-session", "valid");
  res.setHeader("x-handshake", "accepted");
  res.setHeader("x-color", "green");
  res.setHeader("x-message", "OK");
  res.setHeader("x-server-time", String(Date.now()));
  res.setHeader("x-trust", "high");

  // ---- Handle CORS preflight ----
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ---- Body ----
  return res.status(200).send("OK");
}
