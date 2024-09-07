// import { NextApiRequest, NextApiResponse } from "next";
// import TelegramBot from "node-telegram-bot-api";

// // Initialize your bot
// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string);

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     const { body } = req;

//     // Process the update received from Telegram
//     try {
//       await bot.processUpdate(body);
//       res.status(200).json({ message: "OK" });
//     } catch (error) {
//       console.error("Error processing update:", error);
//       res.status(500).json({ error: "Error processing update" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }

// // Define your bot commands and logic here
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Welcome to your NextJS Telegram Bot!");
// });

// // Disable Next.js body parsing
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
