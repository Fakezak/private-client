/**
 * Private Client Server - Universal Auth & Mod Handler
 * 
 * This script acts as a custom authentication and handshake server.
 * It handles login requests, clears bans, calculates 2-month protection,
 * and injects normal game mods (speed, XP, reload, etc.) via headers.
 */

export default function handler(req, res) {
  // =========================================================
  // 1. CORS & STANDARD HEADERS
  // =========================================================
  // Allow the Unity game to connect from any origin
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, OPTIONS");
  res.setHeader("access-control-allow-headers", "*");
  
  // Ensure the game always gets fresh data and never caches an old response
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("pragma", "no-cache");
  res.setHeader("expires", "0");

  // Handle CORS Preflight (browser/Unity checks before actual request)
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // =========================================================
  // 2. DYNAMIC USER IDENTIFICATION
  // =========================================================
  // The game passes the UID in the URL: ?id=12345678
  const queryParams = req.query || {};
  const playerId = queryParams.id || queryParams.uid || queryParams.user || "unknown_user";
  const gameVersion = queryParams.ver || "1.0.0";

  // =========================================================
  // 3. DATE CALCULATIONS (2 MONTH PROTECTION)
  // =========================================================
  const now = new Date();
  
  // Calculate exactly 2 months from today
  const expiresDate = new Date(now);
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  const expiresISO = expiresDate.toISOString();
  
  // Calculate ban timestamps
  const currentTimestamp = now.getTime();

  // =========================================================
  // 4. AUTHENTICATION & CLEARANCE HEADERS
  // =========================================================
  // Tell the game the user is fully whitelisted and not banned
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "success");
  res.setHeader("x-session", "valid");
  res.setHeader("x-handshake", "accepted");
  res.setHeader("x-trust", "high");

  res.setHeader("x-user-uid", playerId);
  res.setHeader("x-user-version", gameVersion);
  
  res.setHeader("x-whitelist", "true");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresISO);
  res.setHeader("x-server-time", String(currentTimestamp));

  // =========================================================
  // 5. THE "WOW UPDATE" LOGIN MESSAGE
  // =========================================================
  // Hidden in headers to prevent text parser (datatype) errors
  res.setHeader("x-auth-notice", "WOW UPDATE! Login successful.");
  res.setHeader("x-auth-notice-color", "green");
  res.setHeader("x-auth-notice-type", "success");
  res.setHeader("x-auth-notice-bg", "rgba(0,0,0,0.8)");

  // =========================================================
  // 6. GAME MODS & NORMAL CHEATS (HEADERS)
  // =========================================================
  // XP & Progression
  res.setHeader("x-xp-multiplier", "4.0");
  res.setHeader("x-coin-multiplier", "2.0");
  
  // Movement
  res.setHeader("x-speed-multiplier", "2.0");
  res.setHeader("x-walk-speed", "2.0");
  res.setHeader("x-run-speed", "2.0");
  
  // Weapon Stats (Normal Bug Cheats)
  res.setHeader("x-fire-rate", "1.5");
  res.setHeader("x-no-recoil", "true");
  res.setHeader("x-unlimited-ammo", "true");
  res.setHeader("x-fast-reload", "true");
  res.setHeader("x-no-spread", "true");
  
  // Visuals
  res.setHeader("x-sky-color", "black");
  res.setHeader("x-esp-enabled", "false"); // Aim/ESP turned off as requested

  // =========================================================
  // 7. BUILD THE RESPONSE BODY
  // =========================================================
  // To ensure the game logs in without "datatype errors", 
  // we keep the body strictly "OK".
  // All the extra info is safely stored in the headers above.
  
  const responseBody = "OK";

  // =========================================================
  // 8. SEND RESPONSE
  // =========================================================
  // Status 200 means "HTTP OK" (successful request)
  return res.status(200).send(responseBody);
}
