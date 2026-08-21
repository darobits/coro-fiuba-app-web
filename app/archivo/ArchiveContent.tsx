"use client";

import { useEffect, useState } from "react";

type Media = { id:number; title:string; type:string; url:string; thumbnailUrl?:string; caption?:string };

const curatedPhotos: Media[] = [
  { id:-1, type:"image", url:"/choir/hero-architecture.webp", title:"El coro en Paseo Colón", caption:"Música y arquitectura en el corazón de la Facultad." },
  { id:-2, type:"image", url:"/choir/hero-performance.webp", title:"Una voz colectiva", caption:"Presentación del Coro FIUBA en la sede Paseo Colón." },
  { id:-3, type:"image", url:"/choir/carolina-abbamonte.webp", title:"Carolina Abbamonte", caption:"Directora del Coro FIUBA desde 2023." },
  { id:-4, type:"image", url:"/choir/choir-overhead.webp", title:"Círculo de voces", caption:"El coro visto desde las escaleras de la Facultad." },
  { id:-5, type:"image", url:"/choir/blue-concert.webp", title:"Concierto en azul", caption:"Una presentación bajo la luz de la sede Paseo Colón." },
  { id:-6, type:"image", url:"/choir/concert-close.webp", title:"Cantar juntos", caption:"El trabajo coral convertido en presencia y sonido." },
  { id:-7, type:"image", url:"/choir/blue-direction.webp", title:"Dirección y escucha", caption:"Carolina Abbamonte al frente del conjunto." },
  { id:-8, type:"image", url:"/choir/choir-classroom.webp", title:"El coro en la Facultad", caption:"Una presentación del conjunto en un aula de FIUBA." },
  { id:-9, type:"image", url:"/choir/community-gathering.webp", title:"Después de cantar", caption:"La comunidad coral reunida al final de un encuentro." },
  { id:-10, type:"image", url:"/choir/leadership-transition.webp", title:"Continuidad artística", caption:"Carolina Abbamonte, Marcelo Ortiz Rocca y Lurdes Sabeckis." },
  { id:-11, type:"image", url:"/choir/marcelo-carolina-embrace.webp", title:"Un legado compartido", caption:"Marcelo Ortiz Rocca y Carolina Abbamonte." },
  { id:-12, type:"image", url:"/choir/coro-1999.webp", title:"Coro FIUBA, 1999", caption:"Una generación del Coro a fines del siglo XX." },
  { id:-13, type:"image", url:"/choir/chubut-1996.webp", title:"El coro en Chubut", caption:"Una imagen histórica de la actividad coral durante los años noventa." },
  { id:-14, type:"image", url:"/choir/coro-2015.webp", title:"Generación 2015", caption:"El Coro FIUBA reunido en la Facultad." },
  { id:-15, type:"image", url:"/choir/coro-generations.webp", title:"Generaciones que se encuentran", caption:"Distintas voces y épocas reunidas en Paseo Colón." },
  { id:-16, type:"image", url:"/choir/ballena-azul-2015.webp", title:"Ballena Azul, 2015", caption:"El público en el Centro Cultural Kirchner para la Novena Sinfonía de Beethoven." },
  { id:-17, type:"image", url:"/choir/hall-overhead.webp", title:"La Facultad como escenario", caption:"El hall central convertido en sala de conciertos." },
  { id:-18, type:"image", url:"/choir/blue-voices.webp", title:"Voces del presente", caption:"Integrantes del Coro FIUBA durante una presentación reciente." },
];

function MediaCard({ item, index, onVideo }: { item:Media; index:number; onVideo:(item:Media)=>void }) {
  const content = <><img src={item.type === "image" ? item.url : item.thumbnailUrl || "/logo-fiuba.png"} alt={item.type === "image" ? item.title : ""} loading={index > 1 ? "lazy" : "eager"} /><span>{item.type === "image" ? "Fotografía" : "▶ Ver video"}</span><strong>{item.title}</strong>{item.caption && <small>{item.caption}</small>}</>;
  return item.type === "image"
    ? <article className={`media-card media-${index%3}`}>{content}</article>
    : <button className={`media-card media-${index%3}`} onClick={() => onVideo(item)}>{content}</button>;
}

export default function ArchiveContent() {
  const [items,setItems] = useState<Media[]>([]), [video,setVideo] = useState<Media|null>(null);
  useEffect(() => { fetch("/api/content").then(r => r.ok ? r.json() : null).then(data => data && setItems(data.media)).catch(() => {}); }, []);
  const media = [...curatedPhotos, ...items];

  return <><section className="page-hero archive-hero"><div className="page-hero-grid" aria-hidden="true" /><p className="section-index">04 — Archivo vivo</p><div><p className="eyebrow"><span /> Nuestra memoria</p><h1>Escuchanos.<br /><em>Miranos.</em></h1></div><p className="page-intro">Conciertos, ensayos y momentos que forman nuestra historia colectiva.</p></section><section className="archive-page"><div className="archive-heading"><p className="section-index">Una memoria en movimiento</p><h2>Generaciones,<br /><em>escenarios y encuentros.</em></h2><p>Esta selección inicial reúne el presente del Coro y algunas imágenes históricas. Las nuevas publicaciones del panel editorial se integran automáticamente.</p></div><div className="media-grid">{media.map((item,index) => <MediaCard item={item} index={index} onVideo={setVideo} key={item.id} />)}</div></section>{video && <div className="modal" role="dialog" aria-modal="true" aria-label={video.title} onClick={() => setVideo(null)}><button className="modal-close" onClick={() => setVideo(null)} aria-label="Cerrar video">×</button><div className="video-frame" onClick={e => e.stopPropagation()}>{video.type === "youtube" ? <iframe src={video.url} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video src={video.url} controls autoPlay />}<h2>{video.title}</h2></div></div>}</>;
}
