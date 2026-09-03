import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase sozlamalari topilmadi. .env faylini tekshiring.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);