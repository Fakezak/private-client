// api/id.js — check UID, return OK or SUSPENDED
const SUSPENSION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

// ============================================================
// BAN LIST — "UID": "ISO date ban started"
// Server adds 5 days. Delete the line to unban.
// ============================================================
const BANS = {
  "8749607076": "2026-10-15T00:00:00Z",
};

export default function handler(req, res) {
  res.setHeader("content-type", "text/plain");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  const playerId = req.query.id;

  // No UID → OK
  if (!playerId) {
    return res.status(200).send("OK");
  }

  // Not in ban list → OK
  const banStart = BANS[playerId];
  if (!banStart) {
    return res.status(200).send("OK");
  }

  // Check 5-day window
  const endTime = Date.parse(banStart) + SUSPENSION_MS;
  if (Date.now() >= endTime) {
    return res.status(200).send("OK");
  }

  // Still suspended — tell the client
  const endDate = new Date(endTime).toISOString();
  return res.status(200).send(`SUSPENDED ${endDate}`);
}
