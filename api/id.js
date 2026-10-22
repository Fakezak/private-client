export default function handler(req, res) {
  // 1. Setup CORS and standard headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2. Get user ID and current time
  const playerId = req.query.id || "unknown";
  const timestamp = new Date().toISOString();

  // 3. Create the Metadata
  const metadata = {
    server_name: "Private Client Mod Server",
    version: "2.0.1",
    author: "Fakezak",
    timestamp: timestamp,
    status: "operational"
  };

  // 4. Create the Cheat Payload (Aim & Spray)
  const payload = {
    uid: playerId,
    meta: metadata,
    mods: {
      fire_rate_multiplier: 2.0,       // Faster spray
      snap_to_head: true,              // Auto lock to head
      force_bone: "head",              // Always target head bone
      ignore_aim_origin: true,         // If aiming at foot/body, redirect to head
      visible_check: false,            // Ignore walls
      no_recoil: true
    }
  };

  const payloadString = JSON.stringify(payload);

  // 5. Send the payload and metadata in the headers
  res.setHeader("x-mod-data", payloadString);
  res.setHeader("x-server-meta", JSON.stringify(metadata));
  res.setHeader("x-ban", "false");
  
  // 6. The body just says OK so the game logs in normally
  return res.status(200).send("OK");
}
