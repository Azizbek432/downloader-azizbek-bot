# 🎥 Media Downloader Telegram Bot

[![Deno](https://img.shields.io/badge/Runtime-Deno-black?logo=deno)](https://deno.land/)
[![grammY](https://img.shields.io/badge/Framework-grammY-blue)](https://grammy.dev/)
[![Supabase](https://img.shields.io/badge/Hosted_on-Supabase_Edge_Functions-3ECF8E?logo=supabase)](https://supabase.com/edge-functions)
[![Engine](https://img.shields.io/badge/Media_Engine-Cobalt_API-purple)](https://cobalt.tools/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

_Read this in [English](#-english-version) | [O'zbekcha](#-ozbekcha-versiya)_

---

## 🇺🇿 O'zbekcha versiya

**Media Downloader Bot** — Deno, grammY va Supabase Edge Functions asosida qurilgan yuqori tezlikdagi, serverless arxitekturaga ega Telegram bot.
Bot YouTube, Instagram va TikTok platformalaridan videolarni ochiq manbali **Cobalt API** orqali yuklab beradi.

### 🚀 Asosiy imkoniyatlari

- **Serverless arxitektura:** Supabase Edge Functions yordamida 24/7 uzluksiz, "cold start"siz ishlash.
- **Ko'p tilli qo'llab-quvvatlash:** Foydalanuvchilar uchun interaktiv til tanlash (`UZ`, `RU`, `EN`).
- **Tezkor yuklab olish:** Ommabop platformalar (YouTube, Instagram, TikTok) havolalarini avtomatik ajratib olib, to'g'ridan-to'g'ri Telegram orqali yuborish.
- **Webhook integratsiyasi:** Telegram hodisalarini polling'siz, tezkor qayta ishlash.
- **Yengil va xavfsiz:** Deno muhiti orqali resurslarni kam sarflash va qat'iy ruxsatnomalar boshqaruvi.

### 🛠️ Texnologiyalar

| Qatlam                 | Texnologiya             |
| ---------------------- | ----------------------- |
| Runtime                | Deno                    |
| Freymvork              | grammY (`npm:grammy`)   |
| Infratuzilma           | Supabase Edge Functions |
| Media tahlil dvigateli | Cobalt API              |

### 📁 Loyiha tuzilishi

```text
downloader-azizbek-bot/
├── supabase/
│   └── functions/
│       └── telegram-bot/
│           ├── .npmrc
│           ├── deno.json
│           └── index.ts
├── .env.local.example
├── .gitignore
├── config.toml
├── LICENSE
└── README.md
```

### ⚙️ O'rnatish va sozlash

**1. Repozitoriyani klonlash**

```bash
git clone https://github.com/Azizbek432/downloader-azizbek-bot.git
cd downloader-azizbek-bot
```

**2. Supabase CLI o'rnatish** (agar mavjud bo'lmasa)

```bash
npm install -g supabase
```

**3. Muhit o'zgaruvchilarini sozlash**

Loyiha ildizida `.env.local.example` fayli namuna sifatida berilgan. Uni nusxalab, o'z qiymatlaringizni kiriting:

```bash
cp .env.local.example .env.local
```

Production uchun esa maxfiy o'zgaruvchilarni Supabase orqali o'rnating:

```bash
supabase secrets set TELEGRAM_BOT_TOKEN=your_bot_token
supabase secrets set COBALT_API_URL=https://your-cobalt-instance.com
```

**4. Edge Function'ni deploy qilish**

```bash
supabase functions deploy telegram-bot --no-verify-jwt
```

**5. Telegram webhook'ni ulash**

`<PROJECT_REF>` — Supabase loyihangizning Reference ID (Project Settings → General bo'limida topiladi).
`<TOKEN>` — BotFather orqali olingan bot tokeni.

```bash
curl -F "url=https://<PROJECT_REF>.functions.supabase.co/telegram-bot" \
     https://api.telegram.org/bot<TOKEN>/setWebhook
```

### 🧪 Lokal test qilish

```bash
supabase functions serve telegram-bot --env-file .env.local
```

### 🤝 Hissa qo'shish

Pull request'lar va issue'lar mamnuniyat bilan qabul qilinadi. Yirik o'zgarishlar kiritishdan oldin, avval muhokama qilish uchun issue oching.

### 📄 Litsenziya

Ushbu loyiha [MIT License](LICENSE) asosida tarqatiladi.

---

## 🇬🇧 English Version

**Media Downloader Bot** is a high-speed, serverless Telegram bot built with Deno, grammY, and Supabase Edge Functions.
It downloads videos from YouTube, Instagram, and TikTok via the open-source **Cobalt API**.

### 🚀 Key Features

- **Serverless architecture:** Runs 24/7 without cold starts, powered by Supabase Edge Functions.
- **Multilingual support:** Interactive language selection for users (`UZ`, `RU`, `EN`).
- **Fast downloads:** Automatically extracts and forwards media links from popular platforms directly through Telegram.
- **Webhook integration:** Processes Telegram events instantly, without polling.
- **Lightweight & secure:** Minimal resource usage via the Deno runtime with strict permission controls.

### 🛠️ Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Runtime        | Deno                    |
| Framework      | grammY (`npm:grammy`)   |
| Infrastructure | Supabase Edge Functions |
| Media Engine   | Cobalt API              |

### 📁 Project Structure

```text
downloader-azizbek-bot/
├── supabase/
│   └── functions/
│       └── telegram-bot/
│           ├── .npmrc
│           ├── deno.json
│           └── index.ts
├── .env.local.example
├── .gitignore
├── config.toml
├── LICENSE
└── README.md
```

### ⚙️ Setup

**1. Clone the repository**

```bash
git clone https://github.com/Azizbek432/downloader-azizbek-bot.git
cd downloader-azizbek-bot
```

**2. Install Supabase CLI** (if not already installed)

```bash
npm install -g supabase
```

**3. Set environment variables**

An example file `.env.local.example` is included at the project root. Copy it and fill in your own values:

```bash
cp .env.local.example .env.local
```

For production, set secrets via Supabase instead:

```bash
supabase secrets set TELEGRAM_BOT_TOKEN=your_bot_token
supabase secrets set COBALT_API_URL=https://your-cobalt-instance.com
```

**4. Deploy the Edge Function**

```bash
supabase functions deploy telegram-bot --no-verify-jwt
```

**5. Set the Telegram webhook**

`<PROJECT_REF>` — your Supabase project's Reference ID (found under Project Settings → General).
`<TOKEN>` — the bot token obtained from BotFather.

```bash
curl -F "url=https://<PROJECT_REF>.functions.supabase.co/telegram-bot" \
     https://api.telegram.org/bot<TOKEN>/setWebhook
```

### 🧪 Local Testing

```bash
supabase functions serve telegram-bot --env-file .env.local
```

### 🤝 Contributing

Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you'd like to change.

### 📄 License

This project is licensed under the [MIT License](LICENSE).
