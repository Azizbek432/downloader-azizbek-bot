import { Bot, webhookCallback, InlineKeyboard } from "npm:grammy";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
const BACKEND_URL = Deno.env.get("BACKEND_URL") || "https://downloader-azizbek-bot-backend.onrender.com";

if (!BOT_TOKEN) {
  console.error("CRITICAL: BOT_TOKEN topilmadi!");
}

const bot = new Bot(BOT_TOKEN || "");

const messages = {
  uz: {
    welcome: (name: string) => `Xush kelibsiz, ${name}! 🚀\n\nIltimos, muloqot tilini tanlang:`,
    lang_selected: "🇺🇿 O'zbek tili tanlandi. Video havolasini yuboring (YouTube, Instagram, TikTok)!",
    help: "ℹ️ **Yordam**\n\nMenga YouTube, Instagram yoki TikTok video havolasini yuboring, men uni sizga video formatida yuklab beraman.\n\nBuyruqlar:\n/start - Botni qayta yoqish\n/help - Yordam\n/about - Bot haqida",
    about: "🤖 **Media Downloader Bot**\n\nUshbu bot barcha ommabop tarmoqlardan videolarni tez va sifatli yuklab beradi.\n\nTuzuvchi: @azizbek_dev\nJamoa: CodeNest Community",
    downloading: "⏳ Video tahlil qilinmoqda va yuklab olinmoqda...",
    success: "✅ Video muvaffaqiyatli yuklab olindi!\n\n🤖 @downloader_azizbek_bot",
    error: (reason: string) => `❌ Videoni yuklab bo'lmadi.\nSabab: ${reason}`,
    invalid_url: "Iltimos, to'g'ri YouTube, Instagram yoki TikTok havolasini yuboring."
  }
};

const langKeyboard = new InlineKeyboard()
  .text("🇺🇿 O'zbekcha", "lang_uz")
  .text("🇷🇺 Русский", "lang_ru")
  .text("🇬🇧 English", "lang_en");

bot.command("start", async (ctx) => {
  const name = ctx.from?.first_name || "User";
  await ctx.reply(messages.uz.welcome(name), { reply_markup: langKeyboard });
});

bot.command("help", async (ctx) => {
  await ctx.reply(messages.uz.help, { parse_mode: "Markdown" });
});

bot.command("about", async (ctx) => {
  await ctx.reply(messages.uz.about, { parse_mode: "Markdown" });
});

bot.callbackQuery(/^lang_(uz|ru|en)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(messages.uz.lang_selected);
});

async function fetchFromMyBackend(videoUrl: string) {
  const encodedUrl = encodeURIComponent(videoUrl);
  const endpoint = `${BACKEND_URL}/download?url=${encodedUrl}`;
  
  console.log(`[BACKEND_REQUEST] Yuborilmoqda: ${endpoint}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 40000);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend javob bermadi (Status ${response.status})`);
    }

    const data = await response.json();

    if (data.status !== "success" || !data.url) {
      throw new Error(data.message || "Video havolasini ajratib bo'lmadi");
    }

    return {
      mediaUrl: data.url,
      title: data.title || "Video"
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Server tayyorlanmoqda (Cold Start). Iltimos, 10 soniyadan so'ng qayta urinib ko'ring.");
    }
    throw err;
  }
}

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
    const { mediaUrl, title } = await fetchFromMyBackend(text);

    await ctx.replyWithVideo(mediaUrl, {
      caption: `${messages.uz.success}\n\n📌 **${title}**`,
      parse_mode: "Markdown"
    });

    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
  } catch (err: any) {
    console.error("[DOWNLOAD_ERROR]", err);
    const errReason = err?.message || "Server bilan bog'lanishda xatolik";
    await ctx.reply(messages.uz.error(errReason));
  }
});

const handleWebhook = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  try {
    if (req.method === "POST") {
      return await handleWebhook(req);
    }
    return new Response("🤖 Downloader Bot Edge Function Active!", { status: 200 });
  } catch (err) {
    console.error("[SERVER_CRITICAL]", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
});