import { Bot } from "grammy";
import "dotenv/config";
import { handleStart } from "./handlers/start.js";
import { handleMedia } from "./handlers/media.js";

if (!process.env.BOT_TOKEN) {
  throw new Error("❌ BOT_TOKEN .env faylida ko'rsatilmagan!");
}

export const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", handleStart);
bot.on("message:text", handleMedia);