export default function handler(req, res) {
  // 1. Setup Raw Headers & CORS
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("connection", "close"); // Force the socket to drop after sending

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2. Get User ID
  const playerId = req.query.id || "unknown";

  // 3. The Raw Error Payload (Stringified manually)
  const errorPayload = JSON.stringify({
    status: 403,
    success: false,
    auth: "FAILED",
    session: "INVALID",
    error: "ACCOUNT_BANNED",
    is_banned: true,
    is_blacklisted: true,
    ban_reason: "Security Violation (HWID Locked)",
    message: "CRITICAL ERROR: Account is permanently banned.",
    error_ui: "show_fatal_popup",
    errors: [
      "Handshake failed: Code 403.",
      "Database connection rejected.",
      "Account status: Terminated.",
      "Socket connection closed by remote host."
    ]
  });

  // =========================================================
  // 4. RAW RESPONSE INJECTION
  // We write the raw HTTP headers and body directly.
  // =========================================================
  
  res.writeHead(403, "Forbidden", {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(errorPayload),
    "Connection": "close", // Forces the socket closed
    "X-Raw-Injection": "true"
  });

  // Send the payload and end the socket
  res.write(errorPayload);
  res.end();
}
