import { bot } from "./src/bot/bot.js";

bot.start({
  onStart: (botInfo) => {
    console.log(`🚀 @${botInfo.username} bot muvaffaqiyatli ishga tushdi!`);
  },
});