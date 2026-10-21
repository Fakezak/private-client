import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req, res) {
  // 1. CORS Headers (Allow the Unity game to download the file)
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2. Check if the game is asking for the DLL
  if (req.query.action === "get_mod") {
    try {
      // Read the DLL from the public folder
      const dllPath = join(process.cwd(), "public", "VercelLoader.dll");
      const dllBuffer = readFileSync(dllPath);

      // Set headers so the game knows it's a binary file
      res.setHeader("content-type", "application/octet-stream");
      res.setHeader("content-disposition", "attachment; filename=\"VercelLoader.dll\"");
      res.setHeader("x-auth", "success");
      
      // Send the raw DLL bytes
      return res.status(200).send(dllBuffer);
      
    } catch (error) {
      return res.status(500).send("Mod file not found.");
    }
  }

  // 3. Standard Login Check (If they just ask for /id)
  const playerId = req.query.id || "unknown";
  
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("x-ban", "false");
  res.setHeader("x-protection", "active");

  // Return OK for login, and give them the URL to download the mod
  res.setHeader("x-mod-url", "https://private-client-ten.vercel.app/id?action=get_mod");
  
  return res.status(200).send("OK");
}
