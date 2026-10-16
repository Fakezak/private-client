// api/ban.js — ban list + suspension logic

const SUSPENSION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days
const DAY_MS = 24 * 60 * 60 * 1000;

// ============================================================
// BAN LIST — "UID": "ISO date ban started"
// Server adds 5 days. Delete the line to unban.
// ============================================================
export const BANS = {
  "8749607076": "2026-10-15T00:00:00Z",
};

// ============================================================
// isBanned(uid) → returns null if not banned, otherwise info
// ============================================================
export function checkBan(uid) {
  const banStart = BANS[uid];
  if (!banStart) return null;

  const endTime = Date.parse(banStart) + SUSPENSION_MS;
  const now = Date.now();

  if (now >= endTime) return null; // expired

  const daysLeft = Math.max(1, Math.ceil((endTime - now) / DAY_MS));

  return {
    until: new Date(endTime).toISOString(),
    daysLeft,
  };
}

// ============================================================
// Add / remove bans at runtime (in-memory only — resets on deploy)
// ============================================================
export function addBan(uid, startDate) {
  BANS[uid] = startDate || new Date().toISOString();
}

export function removeBan(uid) {
  delete BANS[uid];
}

export { SUSPENSION_MS };
