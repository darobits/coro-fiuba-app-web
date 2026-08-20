import { env } from "cloudflare:workers";

export type Announcement = { id: number; title: string; summary: string; eventDate: string | null; location: string | null; status: string; createdAt: string };
export type MediaItem = { id: number; title: string; type: string; url: string; thumbnailUrl: string | null; caption: string | null; createdAt: string };

export async function ensureSchema() {
  const db = env.DB;
  if (!db) throw new Error("D1 binding DB is unavailable");
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS announcements (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, summary TEXT NOT NULL, event_date TEXT, location TEXT, status TEXT NOT NULL DEFAULT 'published', created_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS media (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, type TEXT NOT NULL, url TEXT NOT NULL, thumbnail_url TEXT, caption TEXT, created_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, age TEXT, voice TEXT, experience TEXT, message TEXT, created_at TEXT NOT NULL)`),
  ]);
  return db;
}

export function youtubeEmbedUrl(input: string) {
  try {
    const url = new URL(input);
    const id = url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}` : input;
  } catch { return input; }
}

export async function isAdmin(email?: string | null) {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
