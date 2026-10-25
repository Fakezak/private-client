export default function handler(req, res) {
  // 1. CORS & Standard Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2. Get User ID
  const playerId = req.query.id || "unknown";

  // 3. Send Error Headers
  res.setHeader("x-auth", "failed");
  res.setHeader("x-session", "invalid");
  res.setHeader("x-error", "true");
  res.setHeader("x-error-message", "Server connection failed. Please try again later.");

  // 4. Send Error in the Body
  // If the game reads the body for "OK", it will now see "ERROR"
  // This usually triggers the game's built-in error popup and keeps you at the login screen.
  
  return res.status(403).send("ERROR");
}
