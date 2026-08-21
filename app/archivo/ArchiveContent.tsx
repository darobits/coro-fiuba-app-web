"use client";

import { useEffect, useState } from "react";

type Media = { id:number; title:string; type:string; url:string; thumbnailUrl?:string; caption?:string };

const museumNight: Media[] = [
  { id:-4, type:"image", url:"/choir/choir-overhead.webp", title:"El círculo de voces", caption:"El Coro FIUBA visto desde las escaleras durante La Noche de los Museos." },
  { id:-7, type:"image", url:"/choir/blue-direction.webp", title:"Dirección y escucha", caption:"Carolina Abbamonte dirige al conjunto con el público alrededor." },
];

const concertCycle: Media[] = [
  { id:-1, type:"image", url:"/choir/hero-architecture.webp", title:"Ciclo de Conciertos", caption:"El Ciclo de Conciertos Corales en la sede Las Heras." },
  { id:-2, type:"image", url:"/choir/hero-performance.webp", title:"El coro en concierto", caption:"El Coro FIUBA durante una presentación del Ciclo." },
  { id:-3, type:"image", url:"/choir/carolina-abbamonte.webp", title:"Dirección musical", caption:"Carolina Abbamonte al frente del conjunto." },
  { id:-5, type:"image", url:"/choir/blue-concert.webp", title:"Las Heras como escenario", caption:"Una presentación coral en el hall de la Facultad." },
  { id:-6, type:"image", url:"/choir/concert-close.webp", title:"Voces en escena", caption:"Integrantes del Coro FIUBA durante el Ciclo." },
  { id:-8, type:"image", url:"/choir/blue-voices.webp", title:"Voces del presente", caption:"El Coro FIUBA durante el ciclo organizado en Las Heras." },
  { id:-9, type:"image", url:"/choir/hall-overhead.webp", title:"Concierto compartido", caption:"El conjunto y el público vistos desde las escaleras de Las Heras." },
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
  { id:-19, type:"image", url:"/choir/concerts/concert-04.webp", title:"Después del concierto", caption:"Coreutas e invitados reunidos después de cantar." },
  { id:-20, type:"image", url:"/choir/concerts/concert-18.webp", title:"Encuentro coral", caption:"Una celebración compartida entre integrantes del coro." },
  { id:-21, type:"image", url:"/choir/concerts/concert-25.webp", title:"Entre coreutas", caption:"Conversaciones y afectos al terminar la presentación." },
  { id:-22, type:"image", url:"/choir/concerts/concert-26.webp", title:"El ágape", caption:"Música espontánea durante el ágape del coro." },
  { id:-23, type:"image", url:"/choir/concerts/concert-34.webp", title:"Celebrar juntos", caption:"El coro reunido en un momento festivo." },
  { id:-24, type:"image", url:"/choir/concerts/concert-35.webp", title:"La comunidad", caption:"Una fotografía colectiva después del concierto." },
  { id:-25, type:"image", url:"/choir/concerts/concert-44.webp", title:"Fin de concierto", caption:"Coreutas, dirección e invitados al cierre de una presentación." },
];

function MediaCard({ item, index, onVideo, quiet = false }: { item:Media; index:number; onVideo:(item:Media)=>void; quiet?:boolean }) {
  const content = <><div className="media-image"><img src={item.type === "image" ? item.url : item.thumbnailUrl || "/logo-fiuba.png"} alt={item.type === "image" ? item.title : ""} loading={index > 1 ? "lazy" : "eager"} /></div>{quiet && item.type === "image" ? item.caption && <small className="media-caption">{item.caption}</small> : <><span>{item.type === "image" ? "Fotografía" : "Ver video"}</span><strong>{item.title}</strong>{item.caption && <small>{item.caption}</small>}</>}</>;
  const className = `media-card reveal-item media-${index%4}`;
  return item.type === "image"
    ? <article className={className}>{content}</article>
    : <button className={className} onClick={() => onVideo(item)}>{content}</button>;
}

function Collection({ eyebrow, title, intro, items, onVideo, tone, quiet = true }: { eyebrow:string; title:string; intro:string; items:Media[]; onVideo:(item:Media)=>void; tone?:string; quiet?:boolean }) {
  return <section className={`archive-collection ${tone || ""}`}><header><p className="section-index">{eyebrow}</p><h2>{title}</h2><p>{intro}</p></header><div className="archive-mosaic">{items.map((item,index) => <MediaCard item={item} index={index} onVideo={onVideo} quiet={quiet} key={item.id} />)}</div></section>;
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

  return <><section className="page-hero archive-hero"><div className="page-hero-grid" aria-hidden="true" /><p className="section-index">04 — Archivo vivo</p><div><p className="eyebrow"><span /> Nuestra memoria</p><h1>Escuchanos.<br /><em>Miranos.</em></h1></div><p className="page-intro">Conciertos, ensayos y momentos que forman nuestra historia colectiva.</p></section><main className="archive-page"><div className="archive-heading"><p className="section-index">Una memoria en movimiento</p><h2>Generaciones,<br /><em>escenarios y encuentros.</em></h2><p>Una pared de recuerdos: fotografías de distintas épocas, escalas y formatos que conservan su proporción original.</p></div><Collection eyebrow="Sede Las Heras" title="Ciclo de Conciertos Corales" intro="Presentaciones del ciclo organizado por el Coro FIUBA junto a agrupaciones invitadas." items={concertCycle} onVideo={setVideo} tone="collection-cycle" /><Collection eyebrow="Sede Las Heras" title="La Noche de los Museos" intro="Una presentación especial del Coro FIUBA en el hall histórico de la sede Las Heras." items={museumNight} onVideo={setVideo} tone="collection-night" /><Collection eyebrow="Memoria coral" title="Generaciones del Coro" intro="Retratos del conjunto completo a través de distintas etapas, viajes y grandes presentaciones." items={generations} onVideo={setVideo} tone="collection-generations" /><Collection eyebrow="Comunidad" title="Vida coral" intro="Después de cantar, el coro se encuentra en el ágape: una celebración compartida que también forma parte de nuestra vida coral." items={choirLife} onVideo={setVideo} tone="collection-life" />{items.length > 0 && <Collection eyebrow="Actualidad" title="Nuevas publicaciones" intro="Las imágenes y videos incorporados desde el panel editorial." items={items} onVideo={setVideo} tone="collection-new" quiet={false} />}</main>{video && <div className="modal" role="dialog" aria-modal="true" aria-label={video.title} onClick={() => setVideo(null)}><button className="modal-close" onClick={() => setVideo(null)} aria-label="Cerrar video">×</button><div className="video-frame" onClick={e => e.stopPropagation()}>{video.type === "youtube" ? <iframe src={video.url} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video src={video.url} controls autoPlay />}<h2>{video.title}</h2></div></div>}</>;
}
