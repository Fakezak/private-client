
 // api/id.js
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return res.status(405).json({
      success: false,
      error: "Method not supported"
    });
  }

  return res.status(200).json({
    success: true,
    service: "Free Fire MAX UID diagnostic",
    accountStatus: "unknown",
    verifiedByGarena: false,
    message: "No authorized account-status provider is configured."
  });
}
