// api/id.js — returns OK + Teleport + Aim Lock + 2x Fire Rate
export default function handler(req, res) {
  // Allow the game to read it (CORS)
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");

  // Handshake and Trust Headers
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-session", "valid");
  res.setHeader("x-handshake", "accepted");

  // 🌟 New Feature Headers 🌟
  res.setHeader("x-tp-enabled", "true");
  res.setHeader("x-aim-lock", "true");
  res.setHeader("x-fire-rate", "2.0"); 
  res.setHeader("x-activation", "on_input"); // Tells game to trigger on fire/tap

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 🌟 Full Command Payload 🌟
  const responseText = JSON.stringify({
    status: "OK",
    features: {
      teleport: {
        enabled: true,
        mode: "map_marker",
        trigger: "tap_map"    // Turns on when user taps map
      },
      aim_lock: {
        enabled: true,
        mode: "sticky",
        trigger: "on_fire"    // Turns on when user fires
      },
      shooting: {
        fire_rate_multiplier: 2.0, // 2x Speed
        trigger: "on_fire"
      }
    }
  });

  res.setHeader("content-type", "application/json");
  return res.status(200).send(responseText);
}
