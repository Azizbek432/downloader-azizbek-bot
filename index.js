import { bot } from "./src/bot/bot.js";
import { supabase } from "./src/config/supabase.js";

async function startServer() {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
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