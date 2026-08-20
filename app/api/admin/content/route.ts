import { getChatGPTUser } from "@/app/chatgpt-auth";
import { ensureSchema, isAdmin, youtubeEmbedUrl } from "@/lib/data";

async function authorize() {
  const user = await getChatGPTUser();
  return user && await isAdmin(user.email) ? user : null;
}

export async function GET() {
  if (!await authorize()) return Response.json({ error: "No autorizado" }, { status: 401 });
  const db = await ensureSchema();
  const [announcements, media, applications] = await Promise.all([
    db.prepare("SELECT id,title,summary,event_date as eventDate,location,status,created_at as createdAt FROM announcements ORDER BY created_at DESC").all(),
    db.prepare("SELECT id,title,type,url,thumbnail_url as thumbnailUrl,caption,created_at as createdAt FROM media ORDER BY created_at DESC").all(),
    db.prepare("SELECT id,full_name as fullName,email,phone,voice,created_at as createdAt FROM applications ORDER BY created_at DESC LIMIT 100").all(),
  ]);
  return Response.json({ announcements: announcements.results, media: media.results, applications: applications.results });
}

export async function POST(request: Request) {
  if (!await authorize()) return Response.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json() as Record<string, string>;
  const db = await ensureSchema(), now = new Date().toISOString();
  if (body.kind === "announcement") {
    await db.prepare("INSERT INTO announcements (title,summary,event_date,location,status,created_at) VALUES (?,?,?,?,?,?)").bind(body.title, body.summary, body.eventDate || null, body.location || null, body.status || "published", now).run();
  } else if (body.kind === "media") {
    const url = body.type === "youtube" ? youtubeEmbedUrl(body.url) : body.url;
    await db.prepare("INSERT INTO media (title,type,url,thumbnail_url,caption,created_at) VALUES (?,?,?,?,?,?)").bind(body.title, body.type, url, body.thumbnailUrl || null, body.caption || null, now).run();
  } else return Response.json({ error: "Tipo inválido" }, { status: 400 });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!await authorize()) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { searchParams } = new URL(request.url), kind = searchParams.get("kind"), id = Number(searchParams.get("id"));
  if (!id || !["announcement", "media"].includes(kind || "")) return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  const db = await ensureSchema();
  await db.prepare(kind === "announcement" ? "DELETE FROM announcements WHERE id = ?" : "DELETE FROM media WHERE id = ?").bind(id).run();
  return Response.json({ ok: true });
}
