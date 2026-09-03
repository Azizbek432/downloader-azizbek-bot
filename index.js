import { bot } from "./src/bot/bot.js";
import { supabase } from "./src/config/supabase.js";

async function startServer() {
  try {
    // Supabase ulanishini test qilish (telegram_id bo'yicha)
    const { error } = await supabase.from("users").select("telegram_id").limit(1);
    if (error) {
      console.error("❌ Supabase ulanishida xatolik:", error.message);
    } else {
      console.log("⚡ Supabase ma'lumotlar bazasiga ulanish MUVAFFAQIYATLI!");
    }

    bot.start({
      onStart: (botInfo) => {
        console.log(`🚀 @${botInfo.username} bot muvaffaqiyatli ishga tushdi!`);
      },
    });
  } catch (err) {
    console.error("❌ Server start error:", err.message);
  }
}

startServer();
