import { readFileSync } from "fs";
import { join } from "path";

// 5 days in milliseconds
const SUSPENSION_MS = 5 * 24 * 60 * 60 * 1000; 

export default function handler(req, res) {
  // 1. CORS & Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const playerId = req.query.id;

  // 2. If no ID is sent, allow them
  if (!playerId) {
    return res.status(200).send("OK");
  }

  // 3. Read the bans.json file
  let bans = {};
  try {
    const bansPath = join(process.cwd(), "bans.json");
    const rawData = readFileSync(bansPath, "utf8");
    bans = JSON.parse(rawData);
  } catch (error) {
    // If the file is missing or broken, just load the game
    return res.status(200).send("OK");
  }

  // 4. Check if the user is in the ban list
  const banStart = bans[playerId];
  
  if (!banStart) {
    // User is NOT banned
    return res.status(200).send("OK");
  }

  // 5. Check the 5-day timer
  const startTime = Date.parse(banStart);
  const endTime = startTime + SUSPENSION_MS;
  const now = Date.now();

  if (now >= endTime) {
    // The 5 days have passed, auto-unban them
    return res.status(200).send("OK");
  }

  // 6. Still suspended!
  const endDate = new Date(endTime).toISOString();
  return res.status(200).send(`SUSPENDED ${endDate}`);
}
