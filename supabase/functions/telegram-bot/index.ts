import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Bot, webhookCallback, InlineKeyboard } from "npm:grammy";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN topilmadi!");
}

const bot = new Bot(BOT_TOKEN);

type Language = "uz" | "ru" | "en";

const messages = {
  uz: {
    welcome: (name: string) => `Xush kelibsiz, ${name}! 🚀\n\nIltimos, muloqot tilini tanlang / Пожалуйста, выберите язык / Please select a language:`,
    lang_selected: "🇺🇿 O'zbek tili tanlandi. Video havolasini yuboring (YouTube, Instagram, TikTok)!",
    help: "ℹ️ **Yordam**\n\nMenga YouTube, Instagram yoki TikTok video havolasini yuboring, men uni sizga video formatida yuklab beraman.\n\nBuyruqlar:\n/start - Botni qayta yoqish va tilni tanlash\n/help - Yordam\n/about - Bot haqida",
    about: "🤖 **Media Downloader Bot**\n\nUshbu bot barcha ommabop tarmoqlardan videolarni tez va sifatli yuklab beradi.\n\nTuzuvchi: @azizbek_dev\nJamoa: CodeNest Community",
    downloading: "⏳ Video yuklab olinmoqda, kuting...",
    success: "✅ Video muvaffaqiyatli yuklab olindi!\n\n🤖 @downloader_azizbek_bot",
    error: "❌ Videoni yuklab bo'lmadi. Havolani tekshirib qayta urinib ko'ring.",
    invalid_url: "Iltimos, to'g'ri YouTube, Instagram yoki TikTok havolasini yuboring."
  },
  ru: {
    welcome: (name: string) => `Добро пожаловать, ${name}! 🚀\n\nПожалуйста, выберите язык / Please select a language / Iltimos, tilni tanlang:`,
    lang_selected: "🇷🇺 Выбран русский язык. Отправьте ссылку на видео (YouTube, Instagram, TikTok)!",
    help: "ℹ️ **Помощь**\n\nОтправьте мне ссылку на видео с YouTube, Instagram или TikTok, и я скачаю его для вас.\n\nКоманды:\n/start - Перезапустить бота и выбрать язык\n/help - Помощь\n/about - О боте",
    about: "🤖 **Media Downloader Bot**\n\nЭтот бот быстро и качественно скачивает видео из популярных соцсетей.\n\nРазработчик: @azizbek_dev\nСообщество: CodeNest Community",
    downloading: "⏳ Видео скачивается, подождите...",
    success: "✅ Видео успешно скачано!\n\n🤖 @downloader_azizbek_bot",
    error: "❌ Не удалось скачать видео. Проверьте ссылку и попробуйте снова.",
    invalid_url: "Пожалуйста, отправьте корректную ссылку на YouTube, Instagram или TikTok."
  },
  en: {
    welcome: (name: string) => `Welcome, ${name}! 🚀\n\nPlease select your language / Пожалуйста, выберите язык / Iltimos, tilni tanlang:`,
    lang_selected: "🇬🇧 English language selected. Send a video link (YouTube, Instagram, TikTok)!",
    help: "ℹ️ **Help**\n\nSend me a video link from YouTube, Instagram, or TikTok, and I will download it for you.\n\nCommands:\n/start - Restart bot & choose language\n/help - Help\n/about - About bot",
    about: "🤖 **Media Downloader Bot**\n\nThis bot downloads videos from popular social platforms quickly and in high quality.\n\nDeveloper: @azizbek_dev\nCommunity: CodeNest Community",
    downloading: "⏳ Downloading video, please wait...",
    success: "✅ Video downloaded successfully!\n\n🤖 @downloader_azizbek_bot",
    error: "❌ Failed to download video. Check the link and try again.",
    invalid_url: "Please send a valid YouTube, Instagram, or TikTok link."
  }
};

const langKeyboard = new InlineKeyboard()
  .text("🇺🇿 O'zbekcha", "lang_uz")
  .text("🇷🇺 Русский", "lang_ru")
  .text("🇬🇧 English", "lang_en");

bot.command("start", async (ctx) => {
  const name = ctx.from?.first_name || "User";
  await ctx.reply(messages.uz.welcome(name), {
    reply_markup: langKeyboard,
  });
});

bot.callbackQuery(/^lang_(uz|ru|en)$/, async (ctx) => {
  const lang = ctx.match[1] as Language;
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(messages[lang].lang_selected);
});

bot.command("help", async (ctx) => {
  await ctx.reply(messages.uz.help, { parse_mode: "Markdown" });
});

bot.command("about", async (ctx) => {
  await ctx.reply(messages.uz.about, { parse_mode: "Markdown" });
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();

  if (text.startsWith("/")) return;

  const isMediaUrl = /(youtube\.com|youtu\.be|instagram\.com|tiktok\.com)/i.test(text);

  if (!isMediaUrl) {
    await ctx.reply(messages.uz.invalid_url);
    return;
  }

  const statusMsg = await ctx.reply(messages.uz.downloading);

  try {
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: text,
        videoQuality: "720"
      }),
    });

    const data = await response.json();

    if (data && (data.url || data.picker)) {
      const mediaUrl = data.url || (data.picker && data.picker[0]?.url);
      
      await ctx.replyWithVideo(mediaUrl, {
        caption: messages.uz.success,
      });
      
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    } else {
      throw new Error("Cobalt API xatolik berdi");
    }
  } catch (err) {
    console.error("Xatolik:", err);
    await ctx.api.editMessageText(
      ctx.chat.id,
      statusMsg.message_id,
      messages.uz.error
    );
  }
});

const handleWebhook = webhookCallback(bot, "std/http");

serve(async (req) => {
  try {
    if (req.method === "POST") {
      return await handleWebhook(req);
    }
    return new Response("🤖 Downloader Bot Edge Function Active!", { status: 200 });
  } catch (err) {
    console.error("Server Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
});