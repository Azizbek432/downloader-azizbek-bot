import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Bot, webhookCallback } from "npm:grammy";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN topilmadi!");
}

const bot = new Bot(BOT_TOKEN);

const messages = {
  uz: {
    welcome: (name: string) => `Xush kelibsiz, ${name}! 🚀\n\nYouTube, Instagram yoki TikTok video havolasini yuboring.`,
    downloading: "⏳ Video yuklab olinmoqda, kuting...",
    success: "✅ Video muvaffaqiyatli yuklab olindi!\n\n🤖 @downloader_azizbek_bot",
    error: "❌ Videoni yuklab bo'lmadi. Havolani tekshirib qayta urinib ko'ring.",
    invalid_url: "Iltimos, to'g'ri YouTube, Instagram yoki TikTok havolasini yuboring."
  }
};

bot.command("start", async (ctx) => {
  const name = ctx.from?.first_name || "Foydalanuvchi";
  await ctx.reply(messages.uz.welcome(name));
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();
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