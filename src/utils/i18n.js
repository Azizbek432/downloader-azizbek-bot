export const messages = {
  uz: {
    welcome: (name) => `Xush kelibsiz, ${name}! 🚀\n\nYouTube, Instagram yoki TikTok video havolasini yuboring.`,
    select_lang: "Iltimos, tilni tanlang / Пожалуйста, выберите язык / Please select a language:",
    lang_changed: "🇺🇿 Til O'zbek tiliga o'zgartirildi!",
    help: `📖 **Botdan foydalanish yo'riqnomasi:**\n\n1. Video havolasini (link) nusxalang.\n2. Havolani botga yuboring.\n3. Bot bir necha soniyada videoni yuklab beradi.\n\n⚠️ **Eslatma:** Maksimal **50 MB** gacha bo'lgan videolar yuklanadi.`,
    about: (botName = "downloader_azizbek_bot") => `🤖 **@${botName}**\n\nBarcha ommabop tarmoqlardan media yuklovchi tezkor bot.\n\n🛠 **Texnologiyalar:** Node.js, grammY, Supabase, yt-dlp\n👨‍💻 **Dasturchi:** Azizbek Abdullayev\n🚀 **Jamiyat:** CodeNest Community`,
    downloading: "⏳ Video yuklab olinmoqda, kuting...",
    uploading: "📤 Video Telegram'ga yuklanmoqda...",
    success: (botName = "downloader_azizbek_bot") => `✅ Video muvaffaqiyatli yuklab olindi!\n\n🤖 @${botName}`,
    too_large: (size) => `⚠️ **Video hajmi juda katta!** (${size.toFixed(1)} MB)\n\nMaksimal 50 MB gacha bo'lgan videolar yuklanadi.`,
    error: (msg) => `❌ Xatolik yuz berdi: ${msg}`,
    invalid_url: "Iltimos, to'g'ri YouTube, Instagram yoki TikTok havolasini yuboring."
  },
  ru: {
    welcome: (name) => `Добро пожаловать, ${name}! 🚀\n\nОтправьте ссылку на видео из YouTube, Instagram или TikTok.`,
    select_lang: "Пожалуйста, выберите язык:",
    lang_changed: "🇷🇺 Язык изменен на Русский!",
    help: `📖 **Инструкция по использованию:**\n\n1. Скопируйте ссылку на видео.\n2. Отправьте ссылку боту.\n3. Бот скачает видео за несколько секунд.\n\n⚠️ **Примечание:** Максимальный размер видео — **50 МБ**.`,
    about: (botName = "downloader_azizbek_bot") => `🤖 **@${botName}**\n\nБыстрый бот для скачивания медиафайлов.\n\n🛠 **Технологии:** Node.js, grammY, Supabase, yt-dlp\n👨‍💻 **Разработчик:** Azizbek Abdullayev\n🚀 **Сообщество:** CodeNest Community`,
    downloading: "⏳ Видео скачивается, подождите...",
    uploading: "📤 Загрузка видео в Telegram...",
    success: (botName = "downloader_azizbek_bot") => `✅ Видео успешно скачано!\n\n🤖 @${botName}`,
    too_large: (size) => `⚠️ **Файл слишком большой!** (${size.toFixed(1)} МБ)\n\nМаксимальный допустимый размер — 50 МБ.`,
    error: (msg) => `❌ Произошла ошибка: ${msg}`,
    invalid_url: "Пожалуйста, отправьте правильную ссылку на YouTube, Instagram или TikTok."
  },
  en: {
    welcome: (name) => `Welcome, ${name}! 🚀\n\nSend a video link from YouTube, Instagram, or TikTok.`,
    select_lang: "Please select a language:",
    lang_changed: "🇬🇧 Language changed to English!",
    help: `📖 **User Guide:**\n\n1. Copy the video link.\n2. Send the link to the bot.\n3. The bot will download the video in a few seconds.\n\n⚠️ **Note:** Maximum video size is **50 MB**.`,
    about: (botName = "downloader_azizbek_bot") => `🤖 **@${botName}**\n\nFast media downloader bot.\n\n🛠 **Tech:** Node.js, grammY, Supabase, yt-dlp\n👨‍💻 **Developer:** Azizbek Abdullayev\n🚀 **Community:** CodeNest Community`,
    downloading: "⏳ Downloading video, please wait...",
    uploading: "📤 Uploading video to Telegram...",
    success: (botName = "downloader_azizbek_bot") => `✅ Video downloaded successfully!\n\n🤖 @${botName}`,
    too_large: (size) => `⚠️ **Video file is too large!** (${size.toFixed(1)} MB)\n\nMaximum limit is 50 MB.`,
    error: (msg) => `❌ Error occurred: ${msg}`,
    invalid_url: "Please send a valid YouTube, Instagram, or TikTok URL."
  }
};