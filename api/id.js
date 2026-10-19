export default function handler(req, res) {
  res.setHeader("content-type", "text/plain");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", "*");

  // Handshake headers
  res.setHeader("x-status", "ok");
  res.setHeader("x-auth", "ok");
  res.setHeader("x-session", "valid");
  res.setHeader("x-handshake", "accepted");

  // The sky instruction header
  res.setHeader("x-sky-color", "black");
  res.setHeader("x-sky-hex", "#000000");

  // If the client reads the body text, send OK + the command
  return res.status(200).send("OK SKY_BLACK");
}
