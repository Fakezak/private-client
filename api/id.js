export default function handler(req, res) {
  // 1. Setup CORS
  res.setHeader("content-type", "application/json"); // Send JSON to trigger UI parsers
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2. The Error Payload
  // We send multiple error fields in JSON. If the game reads any of these, it will show an error.
  const errorPayload = {
    status: "ERROR",
    success: false,
    auth: "failed",
    session: "invalid",
    error: "BANNED",
    error_code: 403,
    message: "CRITICAL ERROR: Auth server rejected connection.",
    data: {
      is_banned: true,
      ban_reason: "Security Violation",
      suspension_days: 999,
      blacklist: true,
      error_ui: "show_popup"
    },
    // Spam arrays to break any loop parsers
    errors: [
      "Failed to load user profile.",
      "Could not connect to database.",
      "Invalid session token.",
      "Account permanently locked."
    ]
  };

  // 3. Send the massive error payload with a 500 Internal Server Error status
  // A 500 status tells the game's networking layer "The server is broken."
  return res.status(500).json(errorPayload);
}
