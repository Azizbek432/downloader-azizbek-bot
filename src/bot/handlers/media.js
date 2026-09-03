export async function handleMedia(ctx) {
  const text = ctx.message.text;

  const isYoutube = /(youtube\.com|youtu\.be)/i.test(text);
  const isInstagram = /(instagram\.com)/i.test(text);

  if (isYoutube || isInstagram) {
    const platform = isYoutube ? "YouTube" : "Instagram";
    await ctx.reply(`🔍 ${platform} havolasi qabul qilindi. Videoni yuklash boshlanmoqda...`);
    
  } else {
    await ctx.reply("Iltimos, faqat to'g'ri YouTube yoki Instagram linkini yuboring.");
  }
}