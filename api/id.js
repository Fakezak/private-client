export default function handler(req, res) {
  // 1. Standard Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  // 2. Calculate 2 Months Protection
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  const expiresISO = expiresDate.toISOString();

  // 3. Clearance & Mods (Hidden in Headers)
  res.setHeader("x-ban", "false");
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresISO);
  
  // 4. 🌟 THE LOGIN MESSAGE 🌟
  // We send the exact text and the color green.
  // Replace the URL below with your actual Vercel URL!
  res.setHeader("x-notice-text", "Return to https://private-client-ten.vercel.app/id to unlock your game UID");
  res.setHeader("x-notice-color", "green");

  // 5. Handle CORS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 6. Body is just OK (No datatype error!)
  return res.status(200).send("OK");
}
