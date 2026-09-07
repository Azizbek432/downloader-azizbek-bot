import { Bot, InputFile } from "grammy";
import "dotenv/config";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { downloadMedia, cleanupFile, getFileSizeInMB } from "../services/downloader.js";
import { logDownload } from "../services/supabase.js";

export const bot = new Bot(process.env.BOT_TOKEN);

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`❌ Global bot xatosi [Update ID: ${ctx.update.update_id}]:`, err.error);
});

bot.use(userMiddleware);

bot.command("start", async (ctx) => {
  return ctx.reply(
    `Xush kelibsiz, ${ctx.from.first_name}! 🚀\n\nYouTube yoki Instagram video havolasini yuboring, men uni tezkor yuklab beraman.`
  );
});

bot.command("help", async (ctx) => {
  const helpMessage = `
📖 **Botdan foydalanish yo'riqnomasi:**

1. YouTube yoki Instagram'dan video havolasini (link) nusxalang.
2. Havolani botga yuboring.
3. Bot bir necha soniyada videoni yuklab beradi.

⚠️ **Eslatma:** Telegram Bot API cheklovi tufayli maksimal **50 MB** gacha bo'lgan videolar yuklanadi.
`;
  return ctx.reply(helpMessage, { parse_mode: "Markdown" });
});

bot.command("about", async (ctx) => {
  const aboutMessage = `
🤖 **@${ctx.me.username}**

Barcha ommabop tarmoqlardan media yuklovchi tezkor bot.

🛠 **Texnologiyalar:** Node.js, grammY, Supabase, yt-dlp
👨‍💻 **Dasturchi:** Azizbek Abdullayev
🚀 **Jamiyat:** CodeNest Community
`;
  return ctx.reply(aboutMessage, { parse_mode: "Markdown" });
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();

  if (text.startsWith("/")) return;

  if (/^https?:\/\//i.test(text)) {
    const statusMsg = await ctx.reply("⏳ Video yuklab olinmoqda, kuting...");
    let downloadedFilePath = null;

    try {
      const { filePath, platform } = await downloadMedia(text);
      downloadedFilePath = filePath;

      const fileSizeMB = getFileSizeInMB(filePath);
      if (fileSizeMB > 50) {
        await ctx.api.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          `⚠️ **Video hajmi juda katta!** (${fileSizeMB.toFixed(1)} MB)\n\nTelegram botlari orqali maksimal 50 MB gacha bo'lgan videolarni yuborish mumkin.`
        );
        return;
      }

      await ctx.api
        .editMessageText(ctx.chat.id, statusMsg.message_id, "📤 Video Telegram'ga yuklanmoqda...")
        .catch(() => {});

      await ctx.replyWithVideo(new InputFile(filePath), {
        caption: `✅ Video muvaffaqiyatli yuklab olindi!\n\n🤖 @${ctx.me.username}`,
      });

      await logDownload(ctx.from.id, text, platform);

      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(() => {});

    } catch (error) {
      console.error("⚠️ Bot process xatosi:", error.message);
      await ctx.api
        .editMessageText(ctx.chat.id, statusMsg.message_id, `❌ Xatolik yuz berdi: ${error.message}`)
        .catch(() => {});
    } finally {
      if (downloadedFilePath) {
        cleanupFile(downloadedFilePath);
      }
    }
  } else {
    await ctx.reply("Iltimos, to'g'ri YouTube yoki Instagram havolasini yuboring.");
  }
});