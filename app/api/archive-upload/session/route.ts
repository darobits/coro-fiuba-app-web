import { isValidEmail } from "@/lib/validation";
import { createHmac } from "node:crypto";
import { checkRateLimit, hasTrustedOrigin, readJsonObject, securityError } from "@/lib/request-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type FileDescriptor = { name: string; size: number; type: string };
type ScriptResponse = { success?: boolean; message?: string; uploads?: Array<{ name: string; uploadUrl: string }> };
const ERROR_MESSAGE = "No pudimos preparar la carga. Por favor, intentá nuevamente.";
const MAX_FILES = 20;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_TOTAL_SIZE = 500 * 1024 * 1024;
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "tif", "tiff", "bmp", "avif", "dng", "raw", "cr2", "nef", "arw"]);
const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif",
  heic: "image/heic", heif: "image/heif", tif: "image/tiff", tiff: "image/tiff", bmp: "image/bmp",
  avif: "image/avif", dng: "application/octet-stream", raw: "application/octet-stream", cr2: "application/octet-stream",
  nef: "application/octet-stream", arw: "application/octet-stream",
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.replace(/[<>]/g, " ").trim().slice(0, maxLength) : "";
}

function validFile(file: unknown): file is FileDescriptor {
  if (!file || typeof file !== "object") return false;
  const candidate = file as Record<string, unknown>;
  const extension = typeof candidate.name === "string" ? candidate.name.toLowerCase().split(".").pop() || "" : "";
  const safeName = typeof candidate.name === "string" && !candidate.name.includes("/") && !candidate.name.includes("\\") &&
    Array.from(candidate.name).every(character => (character.codePointAt(0) || 0) >= 32 && character.codePointAt(0) !== 127);
  return typeof candidate.name === "string" && candidate.name.length > 0 && candidate.name.length <= 220 && safeName && IMAGE_EXTENSIONS.has(extension) &&
    typeof candidate.size === "number" && Number.isSafeInteger(candidate.size) && candidate.size > 0 && candidate.size <= MAX_FILE_SIZE &&
    typeof candidate.type === "string" && candidate.type.length <= 150;
}

function normalizedFile(file: FileDescriptor): FileDescriptor {
  const extension = file.name.toLowerCase().split(".").pop() || "";
  return { ...file, type: MIME_BY_EXTENSION[extension] || "application/octet-stream" };
}

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) return securityError("El origen de la solicitud no es válido.", 403);

  const rateLimit = checkRateLimit(request, "archive-session", 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) return securityError("Se realizaron demasiados intentos de carga. Probá nuevamente más tarde.", 429, rateLimit.retryAfter);

  const parsed = await readJsonObject(request, 32 * 1024);
  if (parsed.error === "too-large") return securityError("La solicitud es demasiado grande.", 413);
  if (!parsed.data) return securityError("La solicitud no tiene un formato válido.", 400);
  const body = parsed.data;

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
  if (!files.length || files.length > MAX_FILES || !files.every(validFile)) return securityError("Agregá entre 1 y 20 imágenes válidas de hasta 100 MB cada una.", 400);
  const normalizedFiles = files.map(normalizedFile);
  if (normalizedFiles.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_SIZE) return securityError("El envío completo no puede superar los 500 MB.", 413);

  const scriptUrl = process.env.ARCHIVE_APPS_SCRIPT_URL?.trim();
  const uploadSecret = process.env.ARCHIVE_UPLOAD_SECRET?.trim();
  if (!scriptUrl || !uploadSecret) return Response.json({ success: false, message: "El canal de carga todavía no está conectado. Cuando configuremos el Apps Script vas a poder enviar el material desde acá." }, { status: 503 });

  let response: Response;
  try {
    response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "createArchiveUploadSessions", secret: uploadSecret, contributor: { fullName, email, credit, period, event, story, consent }, files: normalizedFiles }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(55_000),
    });
  } catch { return Response.json({ success: false, message: ERROR_MESSAGE }, { status: 502 }); }

  let result: ScriptResponse;
  try { result = JSON.parse(await response.text()) as ScriptResponse; }
  catch { return Response.json({ success: false, message: ERROR_MESSAGE }, { status: 502 }); }

  const validUploads = result.uploads?.length === normalizedFiles.length && result.uploads.every((upload, index) => upload && upload.name === normalizedFiles[index].name && /^https:\/\//.test(upload.uploadUrl));
  if (!response.ok || result.success !== true || !validUploads) return Response.json({ success: false, message: result.message || ERROR_MESSAGE }, { status: 502 });
  const uploads = result.uploads!.map((upload, index) => ({
    ...upload,
    type: normalizedFiles[index].type,
    signature: createHmac("sha256", uploadSecret).update(JSON.stringify([upload.uploadUrl, normalizedFiles[index].size, normalizedFiles[index].type])).digest("base64url"),
  }));
  return Response.json({ success: true, uploads }, { headers: { "cache-control": "no-store" } });
}
