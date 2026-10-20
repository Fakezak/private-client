// api/id.js — returns OK + Teleport command
export default function handler(req, res) {
  // Allow the game to read it (CORS)
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");

  // Handshake and Trust Headers (so the game loads normally)
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-session", "valid");
  res.setHeader("x-handshake", "accepted");

  // 🌟 The Teleport Command Headers 🌟
  res.setHeader("x-feature", "teleport");
  res.setHeader("x-tp-enabled", "true");
  res.setHeader("x-tp-mode", "map_marker");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // =========================================================
  // BODY RESPONSE
  // We send "OK" so the game loads, and include the JSON 
  // command for the teleport feature in case the game reads it.
  // =========================================================
  
  const responseText = "OK ENABLE_TELEPORT {\"status\":\"ok\",\"features\":{\"teleport\":true,\"mode\":\"map_marker\"}}";

  res.setHeader("content-type", "text/plain");
  return res.status(200).send(responseText);
}
