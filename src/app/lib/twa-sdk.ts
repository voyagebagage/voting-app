// src/lib/twa-sdk.ts

import { TelegramWebApp } from "@/telegram";

// let WebApp: TelegramWebApp = null;

// if (typeof window !== "undefined") {
//   WebApp = require("@twa-dev/sdk").default;
// }
const WebApp: TelegramWebApp =
  typeof window !== "undefined" ? require("@twa-dev/sdk").default : null;
export default WebApp;
