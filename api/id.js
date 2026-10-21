export default function handler(req, res) {
  // 1. CORS & Cache Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  // 2. Calculate 2 Months Protection
  const now = new Date();
  const expiresDate = new Date(now);
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  const expiresISO = expiresDate.toISOString();

  // 3. Trust & Clearance Headers
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresISO);

  // 4. Feature Headers (Backup)
  res.setHeader("x-speed", "3.0");
  res.setHeader("x-fire-rate", "2.0");
  res.setHeader("x-sky", "black");
  res.setHeader("x-esp", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 5. UNITY C# BODY
  const unityResponse = 
    "OK\n" +
    "STATUS=OK\n" +
    "IS_BLACKLISTED=false\n" +
    "IS_BANNED=false\n" +
    "IS_SUSPENDED=false\n" +
    "PROTECTION_ACTIVE=true\n" +
    "PROTECTION_DURATION=2_MONTHS\n" +
    `PROTECTION_EXPIRES=${expiresISO}\n` +
    // Player Mods
    "WALK_SPEED_MULTIPLIER=3.0\n" +
    "RUN_SPEED_MULTIPLIER=3.0\n" +
    "FIRE_RATE_MULTIPLIER=2.0\n" +
    // Sky Mod
    "SKY_TEXTURE=black\n" +
    "SKY_COLOR=#000000\n" +
    // ESP Mods
    "ESP_ENABLED=true\n" +
    "ESP_PLAYER_LOCATION=true\n" +
    "ESP_DRAW_LINES=true\n" +
    "ESP_DRAW_BOXES=true\n" +
    "ESP_COLOR=#FF0000";

  return res.status(200).send(unityResponse);
}
