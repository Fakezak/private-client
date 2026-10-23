export default function handler(req, res) {
  // 1. CORS & Standard Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");
  res.setHeader("access-control-allow-origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2. Get User ID (Even though we don't ban, good to echo it back)
  const playerId = req.query.id || "unknown";

  // 3. Send Clearance Headers (The game reads these to check status)
  res.setHeader("x-user-uid", playerId);
  res.setHeader("x-auth", "success");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-whitelist", "true");
  
  // 4. Optional: 2-Month protection notice
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresDate.toISOString());

  // 5. Send "OK" so the game loads normally
  return res.status(200).send("OK");
}
