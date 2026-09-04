import { createHmac, timingSafeEqual } from "node:crypto";
import { hasTrustedOrigin, securityError } from "@/lib/request-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_CHUNK_SIZE = 2 * 1024 * 1024;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ERROR_MESSAGE = "No pudimos transferir una parte del archivo. Intentá nuevamente.";

function validSessionUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "www.googleapis.com" &&
      url.pathname === "/upload/drive/v3/files" &&
      url.searchParams.get("uploadType") === "resumable" &&
      Boolean(url.searchParams.get("upload_id"));
  } catch {
    return false;
  }
}

function validSignature(uploadUrl: string, total: number, mimeType: string, received: string, secret: string) {
  const expected = createHmac("sha256", secret).update(JSON.stringify([uploadUrl, total, mimeType])).digest("base64url");
  if (received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) return securityError("El origen de la solicitud no es válido.", 403);

  const uploadUrl = request.headers.get("x-archive-upload-url") || "";
  const signature = request.headers.get("x-archive-upload-signature") || "";
  const secret = process.env.ARCHIVE_UPLOAD_SECRET?.trim() || "";
  const start = Number(request.headers.get("x-archive-upload-start"));
  const total = Number(request.headers.get("x-archive-upload-total"));
  const mimeType = (request.headers.get("x-archive-upload-type") || "application/octet-stream").slice(0, 150);

  if (!secret || !validSessionUrl(uploadUrl) || !validSignature(uploadUrl, total, mimeType, signature, secret)) {
    return Response.json({ success: false, message: "La sesión de carga no es válida." }, { status: 403 });
  }
  if (!Number.isSafeInteger(start) || start < 0 || !Number.isSafeInteger(total) || total <= start || total > MAX_FILE_SIZE) {
    return Response.json({ success: false, message: "El rango del archivo no es válido." }, { status: 400 });
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_CHUNK_SIZE) return securityError("El fragmento es demasiado grande.", 413);

  const bytes = await request.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > MAX_CHUNK_SIZE || start + bytes.byteLength > total) {
    return Response.json({ success: false, message: "El fragmento del archivo no es válido." }, { status: 413 });
  }

  const end = start + bytes.byteLength - 1;
  let driveResponse: Response;
  try {
    driveResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "content-type": mimeType,
        "content-range": `bytes ${start}-${end}/${total}`,
      },
      body: bytes,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    return Response.json({ success: false, message: ERROR_MESSAGE }, { status: 502 });
  }

  const complete = driveResponse.status === 200 || driveResponse.status === 201;
  const accepted = complete || driveResponse.status === 308;
  if (!accepted) {
    return Response.json({ success: false, message: ERROR_MESSAGE }, { status: 502 });
  }

  return Response.json(
    { success: true, complete, received: end + 1 },
    { headers: { "cache-control": "no-store" } },
  );
}
