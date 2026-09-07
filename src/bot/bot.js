import { Bot, InputFile, InlineKeyboard } from "grammy";
import "dotenv/config";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { downloadMedia, cleanupFile, getFileSizeInMB } from "../services/downloader.js";
import { logDownload } from "../services/supabase.js";
import { messages } from "../utils/i18n.js";

export const bot = new Bot(process.env.BOT_TOKEN);

const userLanguages = new Map();

const getLang = (userId) => userLanguages.get(userId) || "uz";

const languageKeyboard = new InlineKeyboard()
  .text("🇺🇿 O'zbekcha", "set_lang_uz")
  .text("🇷🇺 Русский", "set_lang_ru")
  .text("🇬🇧 English", "set_lang_en");

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`❌ Global bot xatosi [Update ID: ${ctx.update.update_id}]:`, err.error);
});

bot.use(userMiddleware);

bot.command("start", async (ctx) => {
  const lang = getLang(ctx.from.id);
  const t = messages[lang];

  await ctx.reply(t.welcome(ctx.from.first_name));
  return ctx.reply(t.select_lang, { reply_markup: languageKeyboard });
});

bot.command("lang", async (ctx) => {
  const lang = getLang(ctx.from.id);
  return ctx.reply(messages[lang].select_lang, { reply_markup: languageKeyboard });
});

bot.callbackQuery(/^set_lang_(uz|ru|en)$/, async (ctx) => {
  const selectedLang = ctx.match[1];
  userLanguages.set(ctx.from.id, selectedLang);

  await ctx.answerCallbackQuery();
  await ctx.editMessageText(messages[selectedLang].lang_changed);
});

bot.command("help", async (ctx) => {
  const lang = getLang(ctx.from.id);
  return ctx.reply(messages[lang].help, { parse_mode: "Markdown" });
});

bot.command("about", async (ctx) => {
  const lang = getLang(ctx.from.id);
  return ctx.reply(messages[lang].about(ctx.me.username), { parse_mode: "Markdown" });
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();
  const lang = getLang(ctx.from.id);
  const t = messages[lang];

  if (text.startsWith("/")) return;

  if (/^https?:\/\//i.test(text)) {
    const statusMsg = await ctx.reply(t.downloading);
    let downloadedFilePath = null;

    try {
      const { filePath, platform } = await downloadMedia(text);
      downloadedFilePath = filePath;

      const fileSizeMB = getFileSizeInMB(filePath);
      if (fileSizeMB > 50) {
        await ctx.api.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          t.too_large(fileSizeMB),
          { parse_mode: "Markdown" }
        );
        return;
      }

      await ctx.api
        .editMessageText(ctx.chat.id, statusMsg.message_id, t.uploading)
        .catch(() => {});

      await ctx.replyWithVideo(new InputFile(filePath), {
        caption: t.success(ctx.me.username),
      });

      await logDownload(ctx.from.id, text, platform);

      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(() => {});

    } catch (error) {
      console.error("⚠️ Bot process xatosi:", error.message);
      await ctx.api
        .editMessageText(ctx.chat.id, statusMsg.message_id, t.error(error.message))
        .catch(() => {});
    } finally {
      if (downloadedFilePath) {
        cleanupFile(downloadedFilePath);
      }
    }
  } else {
    await ctx.reply(t.invalid_url);
  }
});