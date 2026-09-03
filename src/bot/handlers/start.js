import { saveOrUpdateUser } from "../../services/supabase.js";

export async function handleStart(ctx) {
  const user = ctx.from;

  if (user) {
    await saveOrUpdateUser(user);
  }

  await ctx.reply(
    `Salom ${user?.first_name || "do'stim"}! 🚀\n\n` +
      `Men YouTube va Instagram videolarini yuklab beruvchi botman.\n` +
      `Menga shunchaki video linkini yuboring!`
  );
}