import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Bot, webhookCallback, InlineKeyboard } from "npm:grammy";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN topilmadi!");
}

const bot = new Bot(BOT_TOKEN);

const messages = {
  uz: {
    welcome: (name: string) => `Xush kelibsiz, ${name}! 🚀\n\nIltimos, muloqot tilini tanlang / Пожалуйста, выберите язык / Please select a language:`,
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
  try {
    const name = ctx.from?.first_name || "User";
    await ctx.reply(messages.uz.welcome(name), { reply_markup: langKeyboard });
  } catch (e) {
    console.error("[START_ERR]", e);
  }
});

bot.callbackQuery(/^lang_(uz|ru|en)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(messages.uz.lang_selected);
  } catch (e) {
    console.error("[CALLBACK_ERR]", e);
  }
});

bot.command("help", async (ctx) => {
  try {
    await ctx.reply(messages.uz.help, { parse_mode: "Markdown" });
  } catch (e) {
    console.error("[HELP_ERR]", e);
  }
});

bot.command("about", async (ctx) => {
  try {
    await ctx.reply(messages.uz.about, { parse_mode: "Markdown" });
  } catch (e) {
    console.error("[ABOUT_ERR]", e);
  }
});

const COBALT_INSTANCES = [
  "https://cobalt.api.scpt.tech",
  "https://cobalt-api.kwiatekmandarynka.com",
  "https://co.wuk.sh",
  "https://api.cobalt.tools"
];

async function fetchFromCobalt(url: string) {
  let lastError = "Barcha serverlar band yoki javob bermadi";

  for (const instance of COBALT_INSTANCES) {
    const endpoint = instance.endsWith("/") ? instance : `${instance}/`;
    
    try {
      console.log(`[TRYING_INSTANCE] ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Origin": "https://cobalt.tools",
          "Referer": "https://cobalt.tools/"
        },
        body: JSON.stringify({
          url: url,
          videoQuality: "720",
          youtubeVideoCodec: "h264",
          downloadMode: "video"
        }),
      });

      if (!response.ok) {
        const textErr = await response.text();
        console.warn(`[INSTANCE_FAILED] ${endpoint}: Status ${response.status}`, textErr);
        continue;
      }

      const data = await response.json();
      console.log(`[COBALT_SUCCESS] Response from ${endpoint}:`, JSON.stringify(data));

      if (data.status === "error") {
        lastError = data.text || data.error?.code || "Cobalt xatolik qaytardi";
        continue;
      }

      let mediaUrl: string | null = null;
      if (data.url) {
        mediaUrl = data.url;
      } else if (data.status === "picker" && Array.isArray(data.picker) && data.picker.length > 0) {
        mediaUrl = data.picker[0].url;
      } else if (data.status === "redirect" && data.url) {
        mediaUrl = data.url;
      }

      if (mediaUrl) {
        return mediaUrl;
      }
    } catch (err: any) {
      console.error(`[INSTANCE_ERROR] ${endpoint}`, err?.message || err);
    }
  }

  throw new Error(lastError);
}

bot.on("message:text", async (ctx) => {
  try {
    const text = ctx.message.text.trim();
    if (text.startsWith("/")) return;

    const isMediaUrl = /(youtube\.com|youtu\.be|instagram\.com|tiktok\.com)/i.test(text);
    if (!isMediaUrl) {
      await ctx.reply(messages.uz.invalid_url);
      return;
    }

    const statusMsg = await ctx.reply(messages.uz.downloading);

    console.log(`[REQUEST] Processing URL: ${text}`);

    const mediaUrl = await fetchFromCobalt(text);

    console.log(`[SENDING_VIDEO] Direct Media URL: ${mediaUrl}`);

    await ctx.replyWithVideo(mediaUrl, {
      caption: messages.uz.success,
    });

    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
  } catch (err: any) {
    console.error("[DOWNLOAD_ERROR]", err);
    
    const errReason = err?.message || "Noma'lum xatolik";
    try {
      await ctx.reply(messages.uz.error(errReason));
    } catch (_) {
    }
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
    console.error("[SERVER_CRITICAL]", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
});