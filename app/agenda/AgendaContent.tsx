"use client";
import { useEffect, useState } from "react";
type Announcement = { id:number; title:string; summary:string; eventDate?:string; location?:string };

export default function AgendaContent() {
  const [items, setItems] = useState<Announcement[]>([]);
  useEffect(() => { fetch("/api/content").then(r => r.ok ? r.json() : null).then(data => data && setItems(data.announcements)).catch(() => {}); }, []);
  return <><section className="page-hero"><div className="page-hero-grid" aria-hidden="true" /><p className="section-index">03 — Agenda</p><div><p className="eyebrow"><span /> Actualidad</p><h1>Próximas<br /><em>notas.</em></h1></div><p className="page-intro">Anuncios, conciertos y novedades de nuestra actividad coral.</p></section><section className="agenda-page"><div className="announcement-list">{items.length ? items.map((item,index) => <article key={item.id}><span>{String(index+1).padStart(2,"0")}</span><div><small>{item.eventDate ? new Date(item.eventDate+"T12:00:00").toLocaleDateString("es-AR",{day:"2-digit",month:"long",year:"numeric"}) : "Novedad"}</small><h2>{item.title}</h2><p>{item.summary}</p></div><div className="announcement-place">{item.location || "Coro FIUBA"}</div></article>) : <div className="empty-feature"><span>♪</span><div><h2>Nueva temporada,<br />nuevos encuentros.</h2><p>Pronto vamos a publicar acá conciertos, ensayos abiertos y todas las novedades del coro.</p></div></div>}</div><aside className="agenda-aside"><small>Ensayos regulares</small><strong>Todos los viernes<br />19:30 — 22:00 h</strong><a href="https://www.fi.uba.ar/institucional/sedes/paseo-colon" target="_blank" rel="noreferrer">Paseo Colón 850 ↗</a></aside></section></>;
}
