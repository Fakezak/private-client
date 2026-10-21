# Private Client V2 - Server & Mod Loader

This repository contains the Vercel server setup for the Unity game client. 
It handles authentication, bypasses bans (2-month protection), injects game mods (4x XP, 2x Speed, No Recoil), and sends a custom green text notice to the player.

---

## 📁 Repository Structure (GitHub / Vercel)

```text
private-client-v2/
├── api/
│   └── id.js               # The main Vercel server logic
├── unity/
│   └── VercelLoader.cs     # The C# script for your Unity Game
├── vercel.json             # Routes the /id endpoint
├── package.json            # Declares the project as an ES Module
└── README.md               # This file
