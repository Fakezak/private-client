export default function handler(req, res) {
  // Standard Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  // Calculate 2 Months
  const expiresDate = new Date();
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  const expiresISO = expiresDate.toISOString();

  // 🌟 HIDE ALL THE CHEATS IN THE HEADERS 🌟
  // The game can read these silently without crashing the text parser.
  
  res.setHeader("x-ban", "false");
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresISO);
  
  // Mods
  res.setHeader("x-speed-multiplier", "3.0");
  res.setHeader("x-fire-rate", "2.0");
  res.setHeader("x-sky-color", "black");
  res.setHeader("x-esp-enabled", "true");
  res.setHeader("x-esp-boxes", "true");
  res.setHeader("x-esp-lines", "true");

  // Handle CORS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 🌟 BODY IS JUST "OK" 🌟
  // No extra text. No datatype errors. The game loads normally.
  return res.status(200).send("OK");
}
