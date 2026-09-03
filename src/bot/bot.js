import { Bot, InputFile } from "grammy";
import "dotenv/config";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { downloadMedia, cleanupFile } from "../services/downloader.js";
import { logDownload } from "../services/supabase.js";

export const bot = new Bot(process.env.BOT_TOKEN);

bot.use(userMiddleware);

bot.command("start", (ctx) => {
  ctx.reply(`Xush kelibsiz, ${ctx.from.first_name}! 🚀\nYouTube yoki Instagram video havolasini yuboring.`);
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;

  if (text.startsWith("http://") || text.startsWith("https://")) {
    const statusMsg = await ctx.reply("⏳ Video yuklab olinmoqda, kuting...");

    try {
      const { filePath, platform } = await downloadMedia(text);

      await ctx.api.editMessageText(ctx.chat.id, statusMsg.message_id, "📤 Video Telegram'ga yuklanmoqda...");

      await ctx.replyWithVideo(new InputFile(filePath), {
        caption: `✅ Video muvaffaqiyatli yuklab olindi!\n\n🤖 @${ctx.me.username}`,
      });

      await logDownload(ctx.from.id, text, platform);

      cleanupFile(filePath);

      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);

    } catch (error) {
      await ctx.api.editMessageText(ctx.chat.id, statusMsg.message_id, `❌ Xatolik: ${error.message}`);
    }
  } else {
    ctx.reply("Iltimos, to'g'ri YouTube yoki Instagram havolasini yuboring.");
  }
});
