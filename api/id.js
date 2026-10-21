export default function handler(req, res) {
  // Standard Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  // Calculate 2 Months
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  const expiresISO = expiresDate.toISOString();

  // Trust & Clearance (Hidden in Headers)
  res.setHeader("x-ban", "false");
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresISO);

  // 🌟 THE AUTH SCREEN MESSAGE 🌟
  // We use the headers to tell the game to show a green text notification
  res.setHeader("x-auth-notice", "Return to https://private-client-ten.vercel.app/id to unlock your game UID");
  res.setHeader("x-auth-notice-color", "green");
  res.setHeader("x-auth-notice-type", "error"); // Tells the UI to use the error popup box

  // Handle CORS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Body stays "OK" so the game finishes loading normally
  return res.status(200).send("OK");
}
