import { supabase } from "../config/supabase.js";

export async function saveOrUpdateUser(user) {
  try {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          telegram_id: user.id,
          first_name: user.first_name,
          username: user.username || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "telegram_id" }
      );

    if (error) {
      console.error("⚠️ Supabase User Error:", error.message);
    } else {
      console.log(`👤 User bazaga saqlandi/yangilandi: ${user.id}`);
    }
    return data;
  } catch (err) {
    console.error("⚠️ Supabase kutilmagan xatolik:", err.message);
  }
}

export async function logDownload(telegramId, url, platform) {
  try {
    const { error } = await supabase.from("downloads").insert({
      telegram_id: telegramId,
      url: url,
      platform: platform,
    });

    if (error) console.error("⚠️ Download Log Error:", error.message);
  } catch (err) {
    console.error("⚠️ Log Download Error:", err.message);
  }
}