import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdmin } from "@/lib/data";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !await isAdmin(user.email)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const form = await request.formData(), file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Archivo faltante" }, { status: 400 });
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return Response.json({ error: "Formato no permitido" }, { status: 400 });
  if (file.size > 60 * 1024 * 1024) return Response.json({ error: "El archivo supera 60 MB" }, { status: 413 });
  const key = `${Date.now()}-${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
  return Response.json({ url: `/api/media/${encodeURIComponent(key)}`, type: file.type.startsWith("video/") ? "video" : "image" });
}
