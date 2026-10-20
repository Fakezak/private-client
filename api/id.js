// api/id.js — returns OK + TP + Aim Lock (On Fire)
export default function handler(req, res) {
  // Allow the game to read it (CORS)
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");

  // Handshake and Trust Headers
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-session", "valid");
  res.setHeader("x-handshake", "accepted");

  // 🌟 Teleport Command Headers 🌟
  res.setHeader("x-tp-enabled", "true");
  res.setHeader("x-tp-mode", "map_marker");

  // 🌟 Aim Lock Command Headers (Triggered on Fire) 🌟
  res.setHeader("x-aim-lock", "true");
  res.setHeader("x-aim-trigger", "on_fire"); 
  res.setHeader("x-aim-stickiness", "100");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 🌟 Commands in the body text 🌟
  const responseText = JSON.stringify({
    status: "OK",
    features: {
      teleport: true,
      tp_mode: "map_marker",
      aim_lock: true,
      aim_trigger: "on_fire", // Tells client to only lock when firing
      aim_smoothness: 1.0     // Max stickiness
    }
  });

  res.setHeader("content-type", "application/json"); // Switched to JSON for easier parsing
  return res.status(200).send(responseText);
}
