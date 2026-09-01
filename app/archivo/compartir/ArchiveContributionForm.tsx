"use client";

import { ChangeEvent, DragEvent, FormEvent, useMemo, useRef, useState } from "react";

type UploadState = "idle" | "preparing" | "uploading" | "success" | "error";
type FieldErrors = Record<string, string>;
type UploadSession = { name: string; uploadUrl: string; signature: string };

const CHUNK_SIZE = 2 * 1024 * 1024;

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "tif", "tiff", "bmp", "avif", "svg", "dng", "raw", "cr2", "nef", "arw"]);

function extension(name: string) {
  return name.toLowerCase().split(".").pop() || "";
}

function isAcceptedFile(file: File) {
  const ext = extension(file.name);
  return file.type.startsWith("image/") || IMAGE_EXTENSIONS.has(ext) || ext === "zip";
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toLocaleString("es-AR", { maximumFractionDigits: index ? 1 : 0 })} ${units[index]}`;
}

function uploadFile(file: File, session: UploadSession, onProgress: (progress: number) => void) {
  return (async () => {
    let start = 0;
    while (start < file.size) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const response = await fetch("/api/archive-upload/chunk", {
        method: "POST",
        headers: {
          "content-type": "application/octet-stream",
          "x-archive-upload-url": session.uploadUrl,
          "x-archive-upload-signature": session.signature,
          "x-archive-upload-start": String(start),
          "x-archive-upload-total": String(file.size),
          "x-archive-upload-type": file.type || "application/octet-stream",
        },
        body: file.slice(start, end),
      });
      const result = await response.json() as { success?: boolean; message?: string; received?: number };
      if (!response.ok || !result.success || result.received !== end) {
        throw new Error(result.message || "La conexión se interrumpió durante la carga.");
      }
      start = end;
      onProgress(Math.round((start / file.size) * 100));
    }
  })();
}

export default function ArchiveContributionForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<UploadState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<Record<string, number>>({});
  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);
  const busy = state === "preparing" || state === "uploading";

  function addFiles(incoming: File[]) {
    const accepted = incoming.filter(isAcceptedFile);
    const rejected = incoming.length - accepted.length;
    setFiles(current => {
      const unique = new Map(current.map(file => [`${file.name}-${file.size}-${file.lastModified}`, file]));
      accepted.forEach(file => unique.set(`${file.name}-${file.size}-${file.lastModified}`, file));
      return [...unique.values()];
    });
    setErrors(current => ({ ...current, files: rejected ? "Algunos archivos no eran imágenes ni archivos ZIP y no se agregaron." : "" }));
    setMessage("");
    if (state === "error") setState("idle");
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.currentTarget.files || []));
    event.currentTarget.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(index: number) {
    setFiles(current => current.filter((_, fileIndex) => fileIndex !== index));
    setProgress({});
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries([...data.entries()].filter(([, value]) => typeof value === "string")) as Record<string, string>;
    const nextErrors: FieldErrors = {};
    if ((values.fullName || "").trim().length < 3) nextErrors.fullName = "Ingresá tu nombre y apellido.";
    if (!/^\S+@\S+\.\S+$/.test((values.email || "").trim())) nextErrors.email = "Ingresá un correo electrónico válido.";
    if (!(values.story || "").trim()) nextErrors.story = "Contanos brevemente qué muestran estos archivos.";
    if (!files.length) nextErrors.files = "Agregá al menos una imagen o un archivo ZIP.";
    if (!data.get("consent")) nextErrors.consent = "Necesitamos tu autorización para conservar y revisar el material.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    setState("preparing");
    setMessage("");
    setProgress(Object.fromEntries(files.map(file => [file.name, 0])));
    try {
      const response = await fetch("/api/archive-upload/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contributor: {
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            credit: values.credit?.trim() || values.fullName.trim(),
            period: values.period?.trim() || "",
            event: values.event?.trim() || "",
            story: values.story.trim(),
            consent: true,
          },
          files: files.map(file => ({ name: file.name, size: file.size, type: file.type || "application/octet-stream" })),
        }),
      });
      const result = await response.json() as { success?: boolean; message?: string; uploads?: UploadSession[] };
      if (!response.ok || !result.success || !result.uploads || result.uploads.length !== files.length) throw new Error(result.message || "No pudimos preparar la carga.");

      setState("uploading");
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        await uploadFile(file, result.uploads[index], value => setProgress(current => ({ ...current, [file.name]: value })));
      }
      form.reset();
      setFiles([]);
      setProgress({});
      setState("success");
      setMessage("Recibimos el material. Gracias por sumar una parte de esta historia.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No pudimos enviar el material. Intentá nuevamente.");
    }
  }

  return <>
    <section className="archive-share-hero">
      <div>
        <a className="archive-share-back" href="/archivo">← Volver al archivo</a>
        <p className="section-index">07 — Archivo abierto</p>
        <p className="eyebrow"><span /> Memoria colectiva</p>
        <h1>Tu recuerdo también<br />forma parte de <em>esta historia.</em></h1>
      </div>
      <p>Fotografías de conciertos, ensayos, giras o encuentros: cada imagen puede ayudarnos a reconstruir la memoria del Coro.</p>
    </section>

    <section className="archive-share-content">
      <aside className="archive-share-guide">
        <span>Antes de enviar</span>
        <h2>Todo material<br /><em>es valioso.</em></h2>
        <ol>
          <li><b>Imágenes sueltas</b><small>Podés seleccionar una o varias, incluso desde el celular.</small></li>
          <li><b>Una colección completa</b><small>Si son muchas, reunilas en un único archivo ZIP.</small></li>
          <li><b>Calidad original</b><small>No hace falta comprimirlas: conservaremos la mejor versión disponible.</small></li>
        </ol>
        <p>El material será revisado antes de incorporarse al archivo público. Si necesitamos más información, te contactaremos por correo.</p>
      </aside>

      <form ref={formRef} className="archive-share-form" onSubmit={submit} noValidate aria-busy={busy}>
        <header><div><small>Formulario de colaboración</small><h2>Contanos sobre el recuerdo</h2></div><span>01 / 02</span></header>
        <div className="archive-share-row">
          <label className={errors.fullName ? "field invalid" : "field"}><span>Nombre y apellido *</span><input name="fullName" autoComplete="name" maxLength={120} placeholder="¿Cómo te llamás?" onChange={() => setErrors(current => ({ ...current, fullName: "" }))} />{errors.fullName && <em>{errors.fullName}</em>}</label>
          <label className={errors.email ? "field invalid" : "field"}><span>Correo electrónico *</span><input name="email" type="email" inputMode="email" autoComplete="email" maxLength={150} placeholder="tu@email.com" onChange={() => setErrors(current => ({ ...current, email: "" }))} />{errors.email && <em>{errors.email}</em>}</label>
        </div>
        <div className="archive-share-row">
          <label className="field"><span>Época o año <small>(opcional)</small></span><input name="period" maxLength={80} placeholder="Ej. década de 1990" /></label>
          <label className="field"><span>Evento o lugar <small>(opcional)</small></span><input name="event" maxLength={120} placeholder="Ej. concierto en Las Heras" /></label>
        </div>
        <label className={errors.story ? "field invalid" : "field"}><span>¿Qué muestran estos archivos? *</span><textarea name="story" rows={5} maxLength={1800} placeholder="Contanos quiénes aparecen, cuándo fue o cualquier detalle que ayude a reconocer el momento." onChange={() => setErrors(current => ({ ...current, story: "" }))} />{errors.story && <em>{errors.story}</em>}</label>
        <label className="field"><span>Nombre para el crédito <small>(opcional)</small></span><input name="credit" maxLength={120} placeholder="Si queda vacío usaremos tu nombre" /></label>

        <header className="archive-share-files-heading"><div><small>Material digital</small><h2>Agregá tus archivos</h2></div><span>02 / 02</span></header>
        <div
          className={`archive-dropzone${dragging ? " is-dragging" : ""}${errors.files ? " invalid" : ""}`}
          onDragEnter={event => { event.preventDefault(); setDragging(true); }}
          onDragOver={event => event.preventDefault()}
          onDragLeave={event => { if (event.currentTarget === event.target) setDragging(false); }}
          onDrop={handleDrop}
        >
          <input ref={inputRef} name="files" type="file" multiple accept="image/*,.heic,.heif,.tif,.tiff,.avif,.dng,.raw,.cr2,.nef,.arw,.zip,application/zip,application/x-zip-compressed" onChange={handleInput} tabIndex={-1} />
          <span className="archive-dropzone-icon" aria-hidden="true">＋</span>
          <h3>Arrastrá imágenes o un ZIP</h3>
          <p>JPG, PNG, WEBP, HEIC, TIFF, archivos RAW y otros formatos de imagen.</p>
          <button type="button" onClick={() => inputRef.current?.click()}>Elegir archivos</button>
        </div>
        {errors.files && <p className="archive-file-error" role="alert">{errors.files}</p>}

        {!!files.length && <section className="archive-file-list" aria-label="Archivos seleccionados">
          <header><strong>{files.length} {files.length === 1 ? "archivo" : "archivos"}</strong><span>{formatBytes(totalSize)} en total</span></header>
          {files.map((file, index) => <article key={`${file.name}-${file.size}-${file.lastModified}`}>
            <span className="archive-file-kind">{extension(file.name) === "zip" ? "ZIP" : "IMG"}</span>
            <div><strong>{file.name}</strong><small>{formatBytes(file.size)}</small>{busy && <i><span style={{ width: `${progress[file.name] || 0}%` }} /></i>}</div>
            <button type="button" disabled={busy} onClick={() => removeFile(index)} aria-label={`Quitar ${file.name}`}>×</button>
          </article>)}
        </section>}

        <label className={errors.consent ? "consent invalid" : "consent"}><input name="consent" type="checkbox" onChange={() => setErrors(current => ({ ...current, consent: "" }))} /><i aria-hidden="true">✓</i><span>Confirmo que puedo compartir este material y autorizo al Coro de la Facultad de Ingeniería UBA a conservarlo, revisarlo y publicarlo con fines históricos y culturales.</span>{errors.consent && <em>{errors.consent}</em>}</label>
        <div className="archive-share-submit"><button className="button button-blue" type="submit" disabled={busy}>{state === "preparing" ? "Preparando carga…" : state === "uploading" ? "Subiendo archivos…" : "Enviar al archivo"}</button><p>Los archivos conservarán su calidad original.</p></div>
        {message && <div className={`archive-share-message ${state}`} role={state === "error" ? "alert" : "status"}>{message}</div>}
      </form>
    </section>
  </>;
}
