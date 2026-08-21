"use client";

import { useEffect, useState } from "react";

type Media = { id:number; title:string; type:string; url:string; thumbnailUrl?:string; caption?:string };

const museumNight: Media[] = [
  { id:-1, type:"image", url:"/choir/hero-architecture.webp", title:"La Noche de los Museos", caption:"El Coro FIUBA en la sede Las Heras durante una de sus presentaciones especiales." },
  { id:-2, type:"image", url:"/choir/hero-performance.webp", title:"Una voz colectiva", caption:"Presentación del Coro FIUBA en la sede Las Heras." },
  { id:-3, type:"image", url:"/choir/carolina-abbamonte.webp", title:"Carolina Abbamonte", caption:"La directora del Coro FIUBA durante La Noche de los Museos." },
  { id:-4, type:"image", url:"/choir/choir-overhead.webp", title:"El círculo de voces", caption:"El conjunto visto desde las escaleras de la sede Las Heras." },
  { id:-5, type:"image", url:"/choir/blue-concert.webp", title:"El coro en escena", caption:"Una misma noche, muchas voces: presentación en la sede Las Heras." },
  { id:-6, type:"image", url:"/choir/concert-close.webp", title:"Cantar juntos", caption:"El trabajo coral convertido en presencia y sonido." },
  { id:-7, type:"image", url:"/choir/blue-direction.webp", title:"Dirección y escucha", caption:"Carolina Abbamonte al frente del conjunto en La Noche de los Museos." },
  { id:-8, type:"image", url:"/choir/blue-voices.webp", title:"Voces del presente", caption:"Integrantes del Coro FIUBA durante la presentación en la sede Las Heras." },
  { id:-9, type:"image", url:"/choir/hall-overhead.webp", title:"Las Heras como escenario", caption:"El hall de la Facultad convertido en sala de conciertos." },
];

const generations: Media[] = [
  { id:-10, type:"image", url:"/choir/chubut-1996.webp", title:"El Coro en Chubut", caption:"Una imagen histórica de la actividad coral durante la década del noventa." },
  { id:-11, type:"image", url:"/choir/coro-1999.webp", title:"Coro FIUBA, 1999", caption:"Una generación del Coro a fines del siglo XX." },
  { id:-12, type:"image", url:"/choir/coro-2015.webp", title:"Generación 2015", caption:"El Coro FIUBA reunido durante la temporada 2015." },
  { id:-13, type:"image", url:"/choir/coro-generations.webp", title:"Generaciones del Coro", caption:"Distintas voces y épocas que forman una misma historia colectiva." },
  { id:-14, type:"image", url:"/choir/ballena-azul-2015.webp", title:"Ballena Azul, 2015", caption:"Presentación de la Novena Sinfonía de Beethoven en el Centro Cultural Kirchner." },
];

const choirLife: Media[] = [
  { id:-15, type:"image", url:"/choir/choir-classroom.webp", title:"El coro en la Facultad", caption:"Una presentación del conjunto en un aula de FIUBA." },
  { id:-16, type:"image", url:"/choir/community-gathering.webp", title:"Después de cantar", caption:"La comunidad coral reunida al final de un encuentro." },
  { id:-17, type:"image", url:"/choir/leadership-transition.webp", title:"Continuidad artística", caption:"Carolina Abbamonte, Marcelo Ortiz Rocca y Lurdes Sabeckis." },
  { id:-18, type:"image", url:"/choir/marcelo-carolina-embrace.webp", title:"Un legado compartido", caption:"Marcelo Ortiz Rocca y Carolina Abbamonte." },
];

function MediaCard({ item, index, onVideo }: { item:Media; index:number; onVideo:(item:Media)=>void }) {
  const content = <><div className="media-image"><img src={item.type === "image" ? item.url : item.thumbnailUrl || "/logo-fiuba.png"} alt={item.type === "image" ? item.title : ""} loading={index > 1 ? "lazy" : "eager"} /></div><span>{item.type === "image" ? "Fotografía" : "▶ Ver video"}</span><strong>{item.title}</strong>{item.caption && <small>{item.caption}</small>}</>;
  const className = `media-card reveal-item media-${index%4}`;
  return item.type === "image"
    ? <article className={className}>{content}</article>
    : <button className={className} onClick={() => onVideo(item)}>{content}</button>;
}

function Collection({ eyebrow, title, intro, items, onVideo, tone }: { eyebrow:string; title:string; intro:string; items:Media[]; onVideo:(item:Media)=>void; tone?:string }) {
  return <section className={`archive-collection ${tone || ""}`}><header><p className="section-index">{eyebrow}</p><h2>{title}</h2><p>{intro}</p></header><div className="archive-mosaic">{items.map((item,index) => <MediaCard item={item} index={index} onVideo={onVideo} key={item.id} />)}</div></section>;
}

export default function ArchiveContent() {
  const [items,setItems] = useState<Media[]>([]), [video,setVideo] = useState<Media|null>(null);
  useEffect(() => { fetch("/api/content").then(r => r.ok ? r.json() : null).then(data => data && setItems(data.media)).catch(() => {}); }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold:.08, rootMargin:"0px 0px -5%" });
    document.querySelectorAll(".reveal-item").forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [items]);

  return <><section className="page-hero archive-hero"><div className="page-hero-grid" aria-hidden="true" /><p className="section-index">04 — Archivo vivo</p><div><p className="eyebrow"><span /> Nuestra memoria</p><h1>Escuchanos.<br /><em>Miranos.</em></h1></div><p className="page-intro">Conciertos, ensayos y momentos que forman nuestra historia colectiva.</p></section><main className="archive-page"><div className="archive-heading"><p className="section-index">Una memoria en movimiento</p><h2>Generaciones,<br /><em>escenarios y encuentros.</em></h2><p>Las fotografías conservan su proporción original y se reúnen según el momento de la historia coral al que pertenecen.</p></div><Collection eyebrow="Sede Las Heras" title="La Noche de los Museos" intro="Las fotografías de iluminación azul pertenecen a una misma presentación del Coro FIUBA en la sede Las Heras." items={museumNight} onVideo={setVideo} tone="collection-night" /><Collection eyebrow="Memoria coral" title="Generaciones del Coro" intro="Retratos del conjunto completo a través de distintas etapas, viajes y grandes presentaciones." items={generations} onVideo={setVideo} tone="collection-generations" /><Collection eyebrow="Comunidad" title="Vida coral" intro="Encuentros, afectos y momentos compartidos que también construyen la identidad del Coro FIUBA." items={choirLife} onVideo={setVideo} tone="collection-life" />{items.length > 0 && <Collection eyebrow="Actualidad" title="Nuevas publicaciones" intro="Las imágenes y videos incorporados desde el panel editorial." items={items} onVideo={setVideo} tone="collection-new" />}</main>{video && <div className="modal" role="dialog" aria-modal="true" aria-label={video.title} onClick={() => setVideo(null)}><button className="modal-close" onClick={() => setVideo(null)} aria-label="Cerrar video">×</button><div className="video-frame" onClick={e => e.stopPropagation()}>{video.type === "youtube" ? <iframe src={video.url} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video src={video.url} controls autoPlay />}<h2>{video.title}</h2></div></div>}</>;
}
