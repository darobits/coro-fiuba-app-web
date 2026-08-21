"use client";
import { useEffect, useState } from "react";
type Announcement = { id:number; title:string; summary:string; eventDate?:string; location?:string; mapUrl?:string; time?:string };

const season2026 = [
  { id:-101, title:"Ciclo de Conciertos Corales", summary:"Primer encuentro del Ciclo 2026 organizado por el Coro de la Facultad de Ingeniería UBA.", eventDate:"2026-09-26", time:"18:00 h", location:"Sede Las Heras · Av. Las Heras 2214", mapUrl:"https://maps.app.goo.gl/GXmzPA9sefcX2J5D7" },
  { id:-102, title:"Ciclo de Conciertos Corales", summary:"Segundo concierto del ciclo anual con coros invitados del ámbito cultural y universitario.", eventDate:"2026-10-31", time:"18:00 h", location:"Sede Las Heras · Av. Las Heras 2214", mapUrl:"https://maps.app.goo.gl/GXmzPA9sefcX2J5D7" },
  { id:-103, title:"Concierto en la Cripta de Santa Rosa de Lima", summary:"Presentación especial del Coro FIUBA.", eventDate:"2026-11-29", time:"18:00 h", location:"Cripta de Santa Rosa de Lima", mapUrl:"https://maps.app.goo.gl/TmE1SxKyz39hBPrC7" },
  { id:-104, title:"Ciclo de Conciertos Corales", summary:"Concierto de cierre del Ciclo 2026 organizado por el Coro FIUBA.", eventDate:"2026-12-05", time:"18:00 h", location:"Sede Las Heras · Av. Las Heras 2214", mapUrl:"https://maps.app.goo.gl/GXmzPA9sefcX2J5D7" },
];

export default function AgendaContent() {
  const [items, setItems] = useState<Announcement[]>([]);
  useEffect(() => { fetch("/api/content").then(r => r.ok ? r.json() : null).then(data => data && setItems(data.announcements)).catch(() => {}); }, []);
  const events = [...season2026, ...items];
  return <><section className="page-hero"><div className="page-hero-grid" aria-hidden="true" /><p className="section-index">03 — Agenda</p><div><p className="eyebrow"><span /> Temporada 2026</p><h1>Próximas<br /><em>notas.</em></h1></div><p className="page-intro">Conciertos del Ciclo, presentaciones especiales y novedades de nuestra actividad coral.</p></section><section className="agenda-page"><div className="announcement-list">{events.map((item,index) => <article key={item.id}><span>{String(index+1).padStart(2,"0")}</span><div className="announcement-copy"><small>{item.eventDate ? new Date(item.eventDate+"T12:00:00").toLocaleDateString("es-AR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}) : "Novedad"}</small><h2>{item.title}</h2><p>{item.summary}</p></div><div className="announcement-place">{item.time && <strong>{item.time}</strong>}{item.mapUrl ? <a href={item.mapUrl} target="_blank" rel="noreferrer"><span>{item.location || "Ver ubicación"}</span><small>Ver en Maps</small></a> : item.location || "Coro FIUBA"}</div></article>)}</div><aside className="agenda-aside"><small>Ensayos regulares</small><strong>Todos los viernes<br />19:30 — 22:00 h</strong><a href="https://maps.app.goo.gl/p9ZfPAG2v7PEmbyP6" target="_blank" rel="noreferrer"><span>Paseo Colón 850</span><small>Ver en Maps</small></a><p>El Ciclo de Conciertos Corales y presentaciones como La Noche de los Museos tienen lugar en la sede Las Heras.</p><a href="https://maps.app.goo.gl/GXmzPA9sefcX2J5D7" target="_blank" rel="noreferrer"><span>Sede Las Heras</span><small>Ver en Maps</small></a></aside></section></>;
}
