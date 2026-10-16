// api/id.js — handler using ban.js
import { checkBan } from "./ban.js";

export default function handler(req, res) {
  res.setHeader("content-type", "text/plain");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  const playerId = req.query.id;

  // No UID → OK
  if (!playerId) {
    return res.status(200).send("OK");
  }

  // Check ban list
  const banInfo = checkBan(playerId);
  if (!banInfo) {
    return res.status(200).send("OK");
  }

  // Still suspended
  return res.status(200).send(`SUSPENDED ${banInfo.until}`);
}
