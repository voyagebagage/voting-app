// src/lib/twa-sdk.ts

let WebApp: TelegramWebApp | null = null;

if (typeof window !== "undefined") {
  WebApp = require("@twa-dev/sdk").default;
}

export default WebApp;
