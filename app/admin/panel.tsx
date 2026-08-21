"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Content = { announcements: Array<Record<string, string | number>>; media: Array<Record<string, string | number>>; applications: Array<Record<string, string | number>> };

export default function AdminPanel({ userName, signOut }: { userName: string; signOut: string }) {
  const [data, setData] = useState<Content>({ announcements: [], media: [], applications: [] });
  const [tab, setTab] = useState("announcements"), [busy, setBusy] = useState(false), [notice, setNotice] = useState("");
  const load = useCallback(async () => { const response = await fetch("/api/admin/content"); if (response.ok) setData(await response.json()); }, []);
  useEffect(() => { void load(); }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(""); const form = new FormData(event.currentTarget); const payload = Object.fromEntries(form.entries());
    if (payload.kind === "media" && payload.file instanceof File && payload.file.size) {
      const upload = new FormData(); upload.append("file", payload.file); const result = await fetch("/api/admin/upload", { method: "POST", body: upload }); const uploaded = await result.json(); if (!result.ok) { setNotice(uploaded.error); setBusy(false); return; } payload.url = uploaded.url; payload.type = uploaded.type;
    }
    delete payload.file; const response = await fetch("/api/admin/content", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    setBusy(false); setNotice(response.ok ? "Publicado correctamente." : "No se pudo publicar."); if (response.ok) { event.currentTarget.reset(); await load(); }
  }

  async function remove(kind: string, id: number) { if (!confirm("¿Eliminar este contenido?")) return; await fetch(`/api/admin/content?kind=${kind}&id=${id}`, { method: "DELETE" }); await load(); }

  return <main className="dashboard">
    <aside className="dash-sidebar">
      <a className="brand" href="/"><img src="/logo-fiuba.png" alt="" /><span><strong>Coro FIUBA</strong><small>Panel editorial</small></span></a>
      <nav>{[["announcements","Anuncios"],["media","Fotos y videos"],["applications","Postulaciones"]].map(([key,label]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}<span>{data[key as keyof Content].length}</span></button>)}</nav>
      <a className="back-site" href="/">← Ver sitio público</a>
    </aside>
    <section className="dash-main">
      <header><div><p>Administración</p><h1>{tab === "announcements" ? "Anuncios" : tab === "media" ? "Archivo multimedia" : "Postulaciones"}</h1></div><div className="user-chip"><span>{userName.charAt(0).toUpperCase()}</span><div><strong>{userName}</strong><a href={signOut}>Cerrar sesión</a></div></div></header>
      {tab !== "applications" && <form className="editor-card" onSubmit={submit}>
        <input type="hidden" name="kind" value={tab === "announcements" ? "announcement" : "media"} />
        <div className="editor-title"><div><p>Nueva publicación</p><h2>{tab === "announcements" ? "Crear anuncio" : "Agregar foto o video"}</h2></div><button disabled={busy}>{busy ? "Publicando…" : "Publicar →"}</button></div>
        <label>Título<input name="title" required placeholder={tab === "announcements" ? "Concierto de fin de año" : "Ensayo abierto en Paseo Colón"} /></label>
        {tab === "announcements" ? <><label>Descripción<textarea name="summary" required rows={4} placeholder="Contá brevemente de qué se trata…" /></label><div className="form-row"><label>Fecha<input name="eventDate" type="date" /></label><label>Lugar<input name="location" placeholder="Av. Las Heras 2214" /></label></div><label>Estado<select name="status"><option value="published">Publicado</option><option value="draft">Borrador</option></select></label></> : <><div className="form-row"><label>Tipo<select name="type"><option value="image">Imagen</option><option value="youtube">YouTube</option><option value="video">Video</option></select></label><label>Archivo<input name="file" type="file" accept="image/*,video/*" /></label></div><label>O enlace de YouTube<input name="url" type="url" placeholder="https://youtube.com/watch?v=…" /></label><label>Epígrafe<textarea name="caption" rows={3} /></label></>}
        {notice && <p className="form-notice">{notice}</p>}
      </form>}
      <div className="content-list">
        {tab === "announcements" && data.announcements.map((item) => <article key={item.id}><div><small>{String(item.status)}</small><h3>{String(item.title)}</h3><p>{String(item.summary)}</p></div><button onClick={() => remove("announcement", Number(item.id))} aria-label={`Eliminar ${item.title}`}>Eliminar</button></article>)}
        {tab === "media" && data.media.map((item) => <article key={item.id}><div><small>{String(item.type)}</small><h3>{String(item.title)}</h3><p>{String(item.url)}</p></div><button onClick={() => remove("media", Number(item.id))} aria-label={`Eliminar ${item.title}`}>Eliminar</button></article>)}
        {tab === "applications" && data.applications.map((item) => <article key={item.id}><div><small>{new Date(String(item.createdAt)).toLocaleDateString("es-AR")}</small><h3>{String(item.fullName)}</h3><p>{String(item.email)} · {String(item.phone || "Sin teléfono")} · {String(item.voice || "Voz sin indicar")}</p></div></article>)}
        {data[tab as keyof Content].length === 0 && <div className="empty-state">Todavía no hay contenido en esta sección.</div>}
      </div>
    </section>
  </main>;
}
