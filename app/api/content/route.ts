import { ensureSchema } from "@/lib/data";

export async function GET() {
  const db = await ensureSchema();
  const [announcements, media] = await Promise.all([
    db.prepare("SELECT id, title, summary, event_date as eventDate, location, status, created_at as createdAt FROM announcements WHERE status = 'published' ORDER BY COALESCE(event_date, created_at) DESC").all(),
    db.prepare("SELECT id, title, type, url, thumbnail_url as thumbnailUrl, caption, created_at as createdAt FROM media ORDER BY created_at DESC").all(),
  ]);
  return Response.json({ announcements: announcements.results, media: media.results });
}
