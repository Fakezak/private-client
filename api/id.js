export default function handler(req, res) {
  // CORS & Cache
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");

  // Handshake Headers
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-session", "valid");
  res.setHeader("x-handshake", "accepted");

  // 🌟 Whitelist Headers 🌟
  res.setHeader("x-whitelist", "true");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-protection", "active");

  // Calculate exactly 2 months from right now
  const now = new Date();
  const expiresDate = new Date(now);
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  const expiresISO = expiresDate.toISOString();
  
  res.setHeader("x-protection-expires", expiresISO);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // =========================================================
  // MULTI-FORMAT PAYLOAD
  // =========================================================
  
  // 1. JSON (For Javascript / WebGL games)
  const jsonResponse = {
    status: "OK",
    clearance: {
      is_blacklisted: false,
      is_banned: false,
      is_suspended: false,
      protection_active: true,
      protection_duration: "2 months",
      expires_at: expiresISO
    }
  };

  // 2. C# / Plain Text (For Unity / C# games)
  // Unity games often look for specific Key=Value strings
  const csResponse = `OK\n` +
    `STATUS=OK\n` +
    `IS_BLACKLISTED=false\n` +
    `IS_BANNED=false\n` +
    `IS_SUSPENDED=false\n` +
    `PROTECTION_ACTIVE=true\n` +
    `DURATION=2_MONTHS\n` +
    `EXPIRES=${expiresISO}`;

  // 🌟 We send the C# string, but format it so JS can still read it.
  // If the game parses JSON, it might fail, so we send plain text.
  // We'll make the text look like JSON but include the C# keys.
  
  res.setHeader("content-type", "text/plain");
  
  // Return the plain text format (Safest for C# reading line-by-line)
  return res.status(200).send(csResponse);
}
