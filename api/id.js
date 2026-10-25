import { Redis } from '@upstash/redis';
import CryptoJS from 'crypto-js';

// Initialize Redis
const redis = Redis.fromEnv();

// Security Keys (MUST MATCH GAME)
const ADMIN_KEY = "Xk9vP2mQ8zL5wR7tY4nB6cD1fG3hJ0aS"; 
const AES_KEY = "MySuperSecretKey123";

// =========================================================
// 1. MASSIVE ERROR TEXT GENERATOR
// =========================================================
const ERROR_TEXTS = [
  "CRITICAL ERROR: Auth Server Rejected Connection.",
  "FATAL: HWID Ban Detected. Account Terminated.",
  "SECURITY VIOLATION: Memory injection detected.",
  "ERROR 403: Forbidden. Socket closed by remote host.",
  "WARNING: Unauthorized modification of game files.",
  "DATABASE FAILURE: Failed to fetch user profile.",
  "SYSTEM HALT: Security token is invalid or expired.",
  "BANNED: This device has been permanently blacklisted.",
  "ERROR 500: Internal Server Error - Connection dropped.",
  "FATAL: Encryption key mismatch. Terminating.",
  "ALERT: Anti-cheat triggered. Logging IP and HWID.",
  "ERROR: Session hijacking attempt detected.",
  "WARNING: Multiple login attempts from different devices.",
  "SYSTEM ERROR: Packet loss corrupted the handshake.",
  "BANNED: Account flagged for unauthorized currency.",
  "CRITICAL: Failed to establish secure socket layer.",
  "ERROR 404: Player profile not found in database.",
  "FATAL: Cheat engine signature detected in memory.",
  "SECURITY: VPN/Proxy connection blocked.",
  "ERROR: Malformed packet received from client.",
  "WARNING: Game integrity check failed.",
  "SYSTEM: Server maintenance in progress. Please wait.",
  "ERROR 401: Unauthorized access. Invalid credentials.",
  "FATAL: Client version mismatch. Update required.",
  "BANNED: Violation of Terms of Service Section 4.2.",
  "ERROR: Failed to decrypt payload. Invalid AES key.",
  "WARNING: Suspicious network traffic detected.",
  "FATAL: Hardware ID is permanently locked out.",
  "SYSTEM: Database connection timed out.",
  "ERROR: Socket timeout. Failed to receive handshake.",
  "BANNED: Exploiting bugs for unfair advantage.",
  "CRITICAL: Server is rejecting all connections.",
  "ERROR: Invalid session token. Please re-login.",
  "FATAL: Unknown authentication error.",
  "WARNING: Too many requests. Rate limit exceeded.",
  "BANNED: Account linked to known cheat provider.",
  "ERROR: Failed to load ban list from Redis.",
  "SYSTEM: Memory protection triggered.",
  "FATAL: Integrity of game files compromised.",
  "ERROR 502: Bad Gateway. Server is down.",
  "WARNING: Unauthorized API access attempt.",
  "BANNED: Sharing account credentials.",
  "SYSTEM: Network firewall blocked the connection.",
  "ERROR: Payload size exceeds maximum limit.",
  "FATAL: Client crash prevented by anti-cheat.",
  "ERROR: Deserialization of packet failed.",
  "BANNED: Using unauthorized third-party software.",
  "WARNING: High packet loss detected.",
  "SYSTEM: Forced disconnect initiated by server.",
  "FATAL: Account suspended for suspicious activity.",
  "ERROR: Missing payload in request body."
];

// =========================================================
// 2. FAKE DATA GENERATOR (Pocket, Wallet, Stats)
// =========================================================
const FAKE_POCKET_DATA = {
  wallet: {
    uc: 0,
    diamonds: 0,
    coins: -999999,
    gold: -999999,
    gems: -999999,
  },
  inventory: {
    weapons: [],
    skins: [],
    characters: [],
    pets: [],
    items: []
  },
  stats: {
    level: -1,
    xp: -999999,
    rank: "BANNED",
    kd: 0.00,
    wins: 0,
    losses: 999999
  },
  bank: {
    balance: -999999,
    debt: 999999,
    is_frozen: true
  },
  security: {
    is_flagged: true,
    is_locked: true,
    is_hwid_banned: true,
    trust_score: 0
  }
};

// =========================================================
// 3. MAIN HANDLER
// =========================================================
export default async function handler(req, res) {
  
  // --- CORS SETUP ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // =========================================================
  // 4. GAME GET REQUEST (Ban Check)
  // =========================================================
  if (req.method === 'GET') {
    try {
      // 4.1. Force a generic error if no payload is sent
      const encryptedPayload = req.query.payload; 
      if (!encryptedPayload) {
        // Send an encrypted fatal error even if no payload is provided
        const fatalNoPayloadError = {
          isBanned: true,
          reason: "ERROR: Missing payload. Connection rejected.",
          timeLeftMs: 9999999999,
          error_ui: "show_fatal_popup",
          errors: ERROR_TEXTS.slice(0, 10) // Send first 10 errors
        };
        const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(fatalNoPayloadError), AES_KEY).toString();
        return res.status(400).json({ data: encryptedResponse });
      }

      // 4.2. Decrypt the payload
      let playerId = "unknown";
      try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedPayload, AES_KEY);
        playerId = decryptedBytes.toString(CryptoJS.enc.Utf8);
        if (!playerId) throw new Error("Decryption failed");
      } catch (e) {
        // If decryption fails, send a massive encryption error
        const encryptionError = {
          isBanned: true,
          reason: "FATAL: Encryption mismatch. HWID flagged.",
          timeLeftMs: 9999999999,
          error_ui: "show_fatal_popup",
          errors: ERROR_TEXTS.slice(10, 20)
        };
        const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(encryptionError), AES_KEY).toString();
        return res.status(500).json({ data: encryptedResponse });
      }

      // 4.3. Check Redis for Bans
      const bannedUsers = await redis.get('banned_users') || [];
      const banDurationMs = 365 * 24 * 60 * 60 * 1000; // 1 Year Ban
      const now = Date.now();
      
      const userBan = bannedUsers.find(ban => ban.id === playerId);

      let responseData = { isBanned: false };

      // 4.4. If the user IS banned, spam the errors
      if (userBan) {
        const expireTime = userBan.bannedAt + banDurationMs;
        if (now <= expireTime) {
          // Randomly select 25 errors to spam
          const shuffledErrors = ERROR_TEXTS.sort(() => 0.5 - Math.random()).slice(0, 25);
          
          responseData = { 
            isBanned: true, 
            reason: userBan.reason || "PERMANENT BAN: Security Violation",
            timeLeftMs: expireTime - now,
            error_ui: "show_fatal_popup",
            errors: shuffledErrors,
            pocket: FAKE_POCKET_DATA // Send the fake wiped pocket data
          };
        }
      }

      // 4.5. Encrypt the response before sending it back
      const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(responseData), AES_KEY).toString();
      
      // 4.6. Force socket disconnect after sending
      res.setHeader('Connection', 'close');
      return res.status(200).json({ data: encryptedResponse });

    } catch (error) {
      // 4.7. If Redis crashes, send a database error trap
      const dbError = {
        isBanned: true,
        reason: "DATABASE ERROR: Connection failed.",
        timeLeftMs: 9999999999,
        error_ui: "show_fatal_popup",
        errors: ERROR_TEXTS.slice(20, 30)
      };
      const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(dbError), AES_KEY).toString();
      return res.status(500).json({ data: encryptedResponse });
    }
  }

  // =========================================================
  // 5. ADMIN POST REQUEST (Ban User)
  // =========================================================
  if (req.method === 'POST') {
    // 5.1. Authorization Check
    if (req.headers.authorization !== `Bearer ${ADMIN_KEY}`) {
      return res.status(401).json({ error: "Unauthorized Admin Access" });
    }

    const { id, reason } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: "Missing User ID" });
    }

    try {
      let bannedUsers = await redis.get('banned_users') || [];
      
      // Check if user is already banned
      if (!bannedUsers.find(b => b.id === id)) {
        bannedUsers.push({ 
          id, 
          reason: reason || "No reason provided", 
          bannedAt: Date.now() 
        });
        
        // Save to Redis
        await redis.set('banned_users', bannedUsers);
        
        // Return success
        return res.status(200).json({ 
          success: true, 
          message: `User ${id} has been banned.`,
          total_bans: bannedUsers.length
        });
      } else {
        return res.status(200).json({ 
          success: true, 
          message: `User ${id} is already banned.` 
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Database error: " + error.message });
    }
  }

  // =========================================================
  // 6. FALLBACK FOR UNSUPPORTED METHODS
  // =========================================================
  return res.status(405).json({ error: "Method not allowed" });
}
