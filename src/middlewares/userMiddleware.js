import { saveOrUpdateUser } from "../services/supabase.js";

export async function userMiddleware(ctx, next) {
  try {
    if (ctx.from) {
      await saveOrUpdateUser({
        id: ctx.from.id,
        first_name: ctx.from.first_name,
        username: ctx.from.username,
      });
    }
  } catch (error) {
    console.error("⚠️ userMiddleware xatoligi:", error.message);
  } finally {
    return await next();
  }
}
