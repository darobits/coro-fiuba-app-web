import { isValidEmail } from "@/lib/validation";
import { createHmac } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type FileDescriptor = { name: string; size: number; type: string };
type ScriptResponse = { success?: boolean; message?: string; uploads?: Array<{ name: string; uploadUrl: string }> };
const ERROR_MESSAGE = "No pudimos preparar la carga. Por favor, intentá nuevamente.";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.replace(/[<>]/g, " ").trim().slice(0, maxLength) : "";
}

function validFile(file: unknown): file is FileDescriptor {
  if (!file || typeof file !== "object") return false;
  const candidate = file as Record<string, unknown>;
  return typeof candidate.name === "string" && candidate.name.length > 0 && candidate.name.length <= 220 &&
    typeof candidate.size === "number" && Number.isSafeInteger(candidate.size) && candidate.size > 0 &&
    typeof candidate.type === "string" && candidate.type.length <= 150;
}

export async function GET() {
  const configured = Boolean(
    process.env.ARCHIVE_APPS_SCRIPT_URL?.trim() &&
    process.env.ARCHIVE_UPLOAD_SECRET?.trim(),
  );
  return Response.json({ success: configured, configured }, { status: configured ? 200 : 503, headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ success: false, message: "La solicitud no tiene un formato válido." }, { status: 400 }); }

  const contributor = body.contributor && typeof body.contributor === "object" ? body.contributor as Record<string, unknown> : {};
  const fullName = clean(contributor.fullName, 120);
  const email = clean(contributor.email, 150).toLowerCase();
  const credit = clean(contributor.credit, 120);
  const period = clean(contributor.period, 80);
  const event = clean(contributor.event, 120);
  const story = clean(contributor.story, 1800);
  const consent = contributor.consent === true;
  const files = Array.isArray(body.files) ? body.files : [];

  if (fullName.length < 3 || !isValidEmail(email) || !story || !consent) return Response.json({ success: false, message: "Revisá los datos obligatorios del formulario." }, { status: 400 });
  if (!files.length || !files.every(validFile)) return Response.json({ success: false, message: "Agregá al menos un archivo válido." }, { status: 400 });

  const scriptUrl = process.env.ARCHIVE_APPS_SCRIPT_URL?.trim();
  const uploadSecret = process.env.ARCHIVE_UPLOAD_SECRET?.trim();
  if (!scriptUrl || !uploadSecret) return Response.json({ success: false, message: "El canal de carga todavía no está conectado. Cuando configuremos el Apps Script vas a poder enviar el material desde acá." }, { status: 503 });

  let response: Response;
  try {
    response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "createArchiveUploadSessions", secret: uploadSecret, contributor: { fullName, email, credit, period, event, story, consent }, files }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(55_000),
    });
  } catch { return Response.json({ success: false, message: ERROR_MESSAGE }, { status: 502 }); }

  let result: ScriptResponse;
  try { result = JSON.parse(await response.text()) as ScriptResponse; }
  catch { return Response.json({ success: false, message: ERROR_MESSAGE }, { status: 502 }); }

  const validUploads = result.uploads?.length === files.length && result.uploads.every(upload => upload && typeof upload.name === "string" && /^https:\/\//.test(upload.uploadUrl));
  if (!response.ok || result.success !== true || !validUploads) return Response.json({ success: false, message: result.message || ERROR_MESSAGE }, { status: 502 });
  const uploads = result.uploads!.map(upload => ({
    ...upload,
    signature: createHmac("sha256", uploadSecret).update(upload.uploadUrl).digest("base64url"),
  }));
  return Response.json({ success: true, uploads }, { headers: { "cache-control": "no-store" } });
}
