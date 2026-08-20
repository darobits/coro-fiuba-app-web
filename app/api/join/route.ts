import { ensureSchema } from "@/lib/data";

const safe = (value: unknown) => typeof value === "string" ? value.trim().slice(0, 2000) : "";

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const fullName = safe(body.fullName), email = safe(body.email);
  if (!fullName || !email || !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "Completá nombre y un email válido." }, { status: 400 });

  const payload = { fullName, email, phone: safe(body.phone), age: safe(body.age), voice: safe(body.voice), experience: safe(body.experience), message: safe(body.message), createdAt: new Date().toISOString() };
  const db = await ensureSchema();
  await db.prepare("INSERT INTO applications (full_name,email,phone,age,voice,experience,message,created_at) VALUES (?,?,?,?,?,?,?,?)")
    .bind(payload.fullName, payload.email, payload.phone, payload.age, payload.voice, payload.experience, payload.message, payload.createdAt).run();

  const tasks: Promise<unknown>[] = [];
  if (process.env.APPS_SCRIPT_URL) tasks.push(fetch(process.env.APPS_SCRIPT_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }));
  if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
    const send = (templateId: string | undefined, params: Record<string, string>) => templateId ? fetch("https://api.emailjs.com/api/v1.0/email/send", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ service_id: process.env.EMAILJS_SERVICE_ID, template_id: templateId, user_id: process.env.EMAILJS_PUBLIC_KEY, accessToken: process.env.EMAILJS_PRIVATE_KEY, template_params: params }) }) : Promise.resolve();
    tasks.push(send(process.env.EMAILJS_REPLY_TEMPLATE_ID, { to_name: payload.fullName, to_email: payload.email }), send(process.env.EMAILJS_NOTICE_TEMPLATE_ID, { applicant_name: payload.fullName, applicant_email: payload.email, message: payload.message }));
  }
  await Promise.allSettled(tasks);
  return Response.json({ ok: true });
}
