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
          updated_at: new Date(),
        },
        { onConflict: "telegram_id" }
      );

    if (error) console.error("Supabase User Error:", error.message);
    return data;
  } catch (err) {
    console.error("Supabase Unexpected Error:", err.message);
  }
}