export default function handler(req, res) {
  // 1. Clean CORS & Cache Headers
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  // 2. Calculate 2 Months
  const now = new Date();
  const expiresDate = new Date(now);
  expiresDate.setMonth(expiresDate.getMonth() + 2);
  const expiresISO = expiresDate.toISOString();

  // 3. Unity Trust & Clearance Headers
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-blacklist", "false");
  res.setHeader("x-ban", "false");
  res.setHeader("x-suspension", "none");
  res.setHeader("x-protection", "active");
  res.setHeader("x-protection-expires", expiresISO);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 4. UNITY C# BODY
  // Unity will read this line-by-line using .Split('\n') or .Contains()
  const unityResponse = 
    "OK\n" +
    "STATUS=OK\n" +
    "IS_BLACKLISTED=false\n" +
    "IS_BANNED=false\n" +
    "IS_SUSPENDED=false\n" +
    "PROTECTION_ACTIVE=true\n" +
    "PROTECTION_DURATION=2_MONTHS\n" +
    `PROTECTION_EXPIRES=${expiresISO}`;

  return res.status(200).send(unityResponse);
}
