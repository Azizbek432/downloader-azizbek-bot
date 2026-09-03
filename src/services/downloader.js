import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";

const execPromise = promisify(exec);

const TEMP_DIR = path.join(os.tmpdir(), "bot_downloads");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 */
export function detectPlatform(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  } else if (url.includes("instagram.com")) {
    return "instagram";
  }
  return null;
}

/**
 * @param {string} url 
 * @returns {Promise<{ filePath: string, title: string, platform: string }>}
 */
export async function downloadMedia(url) {
  const platform = detectPlatform(url);

  if (!platform) {
    throw new Error("Qo'llab-quvvatlanmaydigan havola! Faqat YouTube va Instagram havolalari o'tadi.");
  }

  const outputTemplate = path.join(TEMP_DIR, `video_${Date.now()}.%(ext)s`);

  const command = `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --no-warnings -o "${outputTemplate}" "${url}"`;

  try {
    console.log(`⬇️  Video yuklab olinmoqda (${platform}): ${url}`);
    
    await execPromise(command);

    const files = fs.readdirSync(TEMP_DIR);
    const downloadedFile = files.find((file) => file.startsWith(`video_${outputTemplate.split("_")[1].split(".")[0]}`));

    if (!downloadedFile) {
      throw new Error("Video yuklandi, lekin vaqtinchalik fayl topilmadi.");
    }

    const fullFilePath = path.join(TEMP_DIR, downloadedFile);

    return {
      filePath: fullFilePath,
      title: `${platform.toUpperCase()} Video`,
      platform,
    };
  } catch (error) {
    console.error("❌ downloader.js xatosi:", error.message);
    throw new Error("Videoni yuklab olishda xatolik yuz berdi. Havola to'g'riligini tekshiring.");
  }
}

/**
 * @param {string} filePath 
 */
export function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Vaqtinchalik fayl o'chirildi: ${filePath}`);
    }
  } catch (err) {
    console.error("⚠️ Faylni o'chirishda xatolik:", err.message);
  }
}