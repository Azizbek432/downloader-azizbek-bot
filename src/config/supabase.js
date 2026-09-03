import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: SUPABASE_URL yoki SUPABASE_KEY .env faylda ko'rsatilmadi!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);