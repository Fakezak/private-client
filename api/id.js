// api/id.js — returns OK + sky data
export default function handler(req, res) {
  // Allow the game to read it (CORS)
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");

  // Handshake and Trust Headers
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-session", "valid");
  res.setHeader("x-handshake", "accepted");

  // Sky Command Headers
  res.setHeader("x-sky-color", "black");
  res.setHeader("x-sky-hex", "#000000");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // =========================================================
  // BODY RESPONSE
  // We send "OK" first so the game loads.
  // Then we add JSON and SKY_BLACK in case the game reads it.
  // =========================================================
  
  const responseText = "OK SKY_BLACK {\"status\":\"ok\",\"sky\":\"black\",\"skyColor\":\"#000000\"}";

  res.setHeader("content-type", "text/plain");
  return res.status(200).send(responseText);
}
