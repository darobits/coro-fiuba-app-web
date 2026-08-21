import { isValidEmail } from "@/lib/validation";

const safe = (value: unknown) => typeof value === "string" ? value.trim().slice(0, 2000) : "";

async function sendJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`La integración respondió con estado ${response.status}`);
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const fullName = safe(body.fullName), email = safe(body.email).toLowerCase(), phone = safe(body.phone), age = safe(body.age), voice = safe(body.voice), experience = safe(body.experience);
  const normalizedPhone = phone.replace(/[\s()-]/g, "");
  const numericAge = Number(age);
  if (fullName.length < 3) return Response.json({ error: "Ingresá tu nombre y apellido." }, { status: 400 });
  if (!isValidEmail(email)) return Response.json({ error: "Ingresá una dirección de correo válida." }, { status: 400 });
  if (!/^\+?\d{8,15}$/.test(normalizedPhone) || /^(\+?)(\d)\2{7,}$/.test(normalizedPhone)) return Response.json({ error: "Ingresá un celular válido, con código de área." }, { status: 400 });
  if (!Number.isInteger(numericAge) || numericAge < 16 || numericAge > 99) return Response.json({ error: "Por favor, ingresá una edad correcta." }, { status: 400 });
  if (!voice || !experience) return Response.json({ error: "Completá el registro de voz y la experiencia previa." }, { status: 400 });
  if (!body.consent) return Response.json({ error: "Necesitamos tu autorización para contactarte." }, { status: 400 });

  const payload = { fullName, email, phone, age, voice, experience, message: safe(body.message), createdAt: new Date().toISOString() };
  const tasks: Promise<unknown>[] = [];
  if (process.env.APPS_SCRIPT_URL) tasks.push(sendJson(process.env.APPS_SCRIPT_URL, payload));
  if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
    const send = (templateId: string | undefined, params: Record<string, string>) => templateId
      ? sendJson("https://api.emailjs.com/api/v1.0/email/send", { service_id: process.env.EMAILJS_SERVICE_ID, template_id: templateId, user_id: process.env.EMAILJS_PUBLIC_KEY, accessToken: process.env.EMAILJS_PRIVATE_KEY, template_params: params })
      : null;
    const reply = send(process.env.EMAILJS_REPLY_TEMPLATE_ID, { to_name: payload.fullName, to_email: payload.email });
    const notice = send(process.env.EMAILJS_NOTICE_TEMPLATE_ID, { applicant_name: payload.fullName, applicant_email: payload.email, message: payload.message });
    if (reply) tasks.push(reply);
    if (notice) tasks.push(notice);
  }

  if (tasks.length === 0) return Response.json({ error: "El formulario todavía no está conectado. Escribinos por correo para participar." }, { status: 503 });
  const results = await Promise.allSettled(tasks);
  if (!results.some((result) => result.status === "fulfilled")) {
    return Response.json({ error: "No pudimos enviar tu solicitud. Intentá nuevamente en unos minutos." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
