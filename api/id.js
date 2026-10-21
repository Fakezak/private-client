export default function handler(req, res) {
  // 1. Standard Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  // 2. Detect User UID (Game sends it via ?id=)
  const playerId = req.query.id || "unknown";

  // 3. Calculate 2 Months
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  const expiresISO = expiresDate.toISOString();

  // 4. Clearance & Trust
  res.setHeader("x-ban", "false");
  res.setHeader("x-whitelist", "true");
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresISO);
  res.setHeader("x-user-uid", playerId); // Tells game to trust this UID

  // 🌟 THE "WOW UPDATE" LOGIN MESSAGE 🌟
  res.setHeader("x-auth-notice", "WOW UPDATE! Login successful.");
  res.setHeader("x-auth-notice-color", "green");
  res.setHeader("x-auth-notice-type", "success");

  // 🌟 CHEATS & MODS (Hidden in Headers) 🌟
  res.setHeader("x-xp-multiplier", "4.0");       // 4x XP
  res.setHeader("x-speed-multiplier", "2.0");    // 2x Speed
  res.setHeader("x-fire-rate", "1.5");           // Faster shooting
  res.setHeader("x-no-recoil", "true");          // Normal bug cheat
  res.setHeader("x-unlimited-ammo", "true");     // Normal bug cheat
  res.setHeader("x-fast-reload", "true");        // Normal bug cheat

  // 5. Handle CORS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 🌟 ALLOW LOGIN (Return OK) 🌟
  return res.status(200).send("OK");
}
