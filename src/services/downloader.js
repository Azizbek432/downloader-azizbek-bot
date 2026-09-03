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

  const timestamp = Date.now();
  const filePrefix = `video_${timestamp}`;
  const outputTemplate = path.join(TEMP_DIR, `${filePrefix}.%(ext)s`);

  const command = `yt-dlp -f "b[ext=mp4]/bv*[ext=mp4]+ba[ext=m4a]/b" --no-warnings -o "${outputTemplate}" "${url}"`;

  try {
    console.log(`⬇️  Video yuklab olinmoqda (${platform}): ${url}`);
    
    await execPromise(command);

    const files = fs.readdirSync(TEMP_DIR);
    const downloadedFileName = files.find((file) => file.startsWith(filePrefix));

    if (!downloadedFileName) {
      throw new Error("Video yuklandi, lekin vaqtinchalik fayl topilmadi.");
    }

    const fullFilePath = path.join(TEMP_DIR, downloadedFileName);

    return {
      filePath: fullFilePath,
      title: `${platform.toUpperCase()} Video`,
      platform,
    };
  } catch (error) {
    console.error("❌ downloader.js xatosi:", error.message);
    throw new Error("Videoni yuklab olishda xatolik yuz berdi. Havola to'g'riligini yoki video ommaga ochiqligini tekshiring.");
  }
}

/**
 * @param {string} filePath 
 */
export function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Vaqtinchalik fayl o'chirildi: ${filePath}`);
    }
  } catch (err) {
    console.error("⚠️ Faylni o'chirishda xatolik:", err.message);
  }
}