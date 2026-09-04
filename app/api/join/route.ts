import { isValidEmail } from "@/lib/validation";
import { FIUBA_AFFILIATIONS, FIUBA_CAREERS, FIUBA_STUDENT_AFFILIATION } from "@/lib/application-options";
import { checkRateLimit, hasTrustedOrigin, readJsonObject, securityError } from "@/lib/request-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const VOICE_OPTIONS = new Set(["Soprano", "Contralto", "Tenor", "Bajo", "No estoy seguro/a"]);
const EXPERIENCE_OPTIONS = new Set(["Sin experiencia", "Algo de experiencia", "Experiencia coral"]);
const AFFILIATION_OPTIONS = new Set<string>(FIUBA_AFFILIATIONS);
const CAREER_OPTIONS = new Set<string>(FIUBA_CAREERS);
const SEND_ERROR = "No pudimos enviar tus datos en este momento. Por favor, intentá nuevamente.";

type ScriptResponse = {
  success?: boolean;
  id?: string;
  message?: string;
};

function stripControlCharacters(value: string) {
  return Array.from(value).filter(character => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint === 9 || codePoint === 10 || codePoint === 13 || (codePoint >= 32 && codePoint !== 127);
  }).join("");
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  const sanitized = stripControlCharacters(value.replace(/<[^>]*>/g, " "))
    .trim()
    .slice(0, maxLength);
  return sanitized === "[object Object]" ? "" : sanitized;
}

async function saveInGoogleSheets(payload: Record<string, string | number | boolean>) {
  const scriptUrl = process.env.APPS_SCRIPT_URL?.trim();
  const submissionSecret = process.env.JOIN_SUBMISSION_SECRET?.trim();
  if (!scriptUrl || !submissionSecret) {
    return { response: Response.json({ success: false, message: "El formulario todavía no está conectado." }, { status: 503 }) };
  }

  let response: Response;
  try {
    response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, secret: submissionSecret }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    return { response: Response.json({ success: false, message: SEND_ERROR }, { status: 502 }) };
  }

  let result: ScriptResponse;
  try {
    result = JSON.parse(await response.text()) as ScriptResponse;
  } catch {
    return { response: Response.json({ success: false, message: SEND_ERROR }, { status: 502 }) };
  }

  if (!response.ok || result.success !== true || !result.id || !/^CF-\d{4,}$/.test(result.id)) {
    return { response: Response.json({ success: false, message: result.message || SEND_ERROR }, { status: 502 }) };
  }

  return { result: { success: true as const, id: result.id, message: result.message || "Inscripción registrada correctamente" } };
}

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) return securityError("El origen de la solicitud no es válido.", 403);

  const rateLimit = checkRateLimit(request, "join", 6, 15 * 60 * 1000);
  if (!rateLimit.allowed) return securityError("Se realizaron demasiados intentos. Esperá unos minutos.", 429, rateLimit.retryAfter);

  const parsed = await readJsonObject(request, 16 * 1024);
  if (parsed.error === "too-large") return securityError("La solicitud es demasiado grande.", 413);
  if (!parsed.data) return securityError("La solicitud no tiene un formato válido.", 400);
  const body = parsed.data;

  const nombre = sanitizeText(body.nombre, 120);
  const email = sanitizeText(body.email, 150).toLowerCase();
  const celular = sanitizeText(body.celular, 50);
  const vinculoFiuba = sanitizeText(body.vinculoFiuba, 40);
  const carrera = vinculoFiuba === FIUBA_STUDENT_AFFILIATION ? sanitizeText(body.carrera, 100) : "";
  const registroVoz = sanitizeText(body.registroVoz, 40);
  const experiencia = sanitizeText(body.experiencia, 60);
  const sobreVos = sanitizeText(body.sobreVos, 1500);
  const edad = Number(body.edad);
  const consentimiento = body.consentimiento === true;
  const normalizedPhone = celular.replace(/[\s()-]/g, "");

  if (nombre.length < 3) return Response.json({ success: false, message: "Ingresá tu nombre y apellido." }, { status: 400 });
  if (!isValidEmail(email)) return Response.json({ success: false, message: "Ingresá una dirección de correo válida." }, { status: 400 });
  if (!/^\+?\d{8,15}$/.test(normalizedPhone) || /^(\+?)(\d)\2{7,}$/.test(normalizedPhone)) {
    return Response.json({ success: false, message: "Ingresá un celular válido, con código de área." }, { status: 400 });
  }
  if (!Number.isInteger(edad) || edad < 16 || edad > 99) {
    return Response.json({ success: false, message: "Por favor, ingresá una edad correcta." }, { status: 400 });
  }
  if (!AFFILIATION_OPTIONS.has(vinculoFiuba)) {
    return Response.json({ success: false, message: "Seleccioná cuál es tu vínculo con FIUBA." }, { status: 400 });
  }
  if (vinculoFiuba === FIUBA_STUDENT_AFFILIATION && !CAREER_OPTIONS.has(carrera)) {
    return Response.json({ success: false, message: "Seleccioná tu carrera de FIUBA." }, { status: 400 });
  }
  if (!VOICE_OPTIONS.has(registroVoz) || !EXPERIENCE_OPTIONS.has(experiencia)) {
    return Response.json({ success: false, message: "Completá el registro de voz y la experiencia previa." }, { status: 400 });
  }
  if (!consentimiento) {
    return Response.json({ success: false, message: "Necesitamos tu autorización para contactarte." }, { status: 400 });
  }

  const payload = { nombre, email, celular, edad, vinculoFiuba, carrera, registroVoz, experiencia, sobreVos, consentimiento };
  const saved = await saveInGoogleSheets(payload);
  if (saved.response) return saved.response;
  return Response.json(saved.result, { headers: { "cache-control": "no-store" } });
}
