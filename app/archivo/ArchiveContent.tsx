"use client";

import { useEffect, useState } from "react";

type Media = { id:number; title:string; type:string; url:string; thumbnailUrl?:string; caption?:string };

function concertSet(numbers:number[], captions:string[]): Media[] {
  return numbers.map((number,index) => {
    const caption = captions[index % captions.length];
    return { id:-1000-number, type:"image", url:`/choir/concerts/concert-${String(number).padStart(2,"0")}.webp`, title:caption, caption };
  });
}

const museumNight = concertSet(
  [30,31,32,37,41,42,43,45,46],
  ["El Coro de la Facultad de Ingeniería UBA durante La Noche de los Museos.","Una presentación especial en la sede Las Heras.","Voces e ingeniería en una noche abierta a la comunidad."]
);

const concertCycle = concertSet(
  [8,19,24,33,38,39],
  ["El Ciclo de Conciertos Corales en la sede Las Heras.","El Coro de la Facultad de Ingeniería UBA compartiendo escenario con agrupaciones invitadas.","Una jornada del ciclo organizado por el Coro de la Facultad de Ingeniería UBA."]
);

const rehearsals = concertSet(
  [6,9,10],
  ["Ensayo del Coro de la Facultad de Ingeniería UBA en la Facultad.","Preparación musical antes de una presentación.","Trabajo de voces y dirección durante el ensayo."]
);

const generations: Media[] = [
  { id:-10, type:"image", url:"/choir/chubut-1996.webp", title:"El Coro en Chubut", caption:"Una imagen histórica de la actividad coral durante la década del noventa." },
  { id:-11, type:"image", url:"/choir/coro-1999.webp", title:"Coro de la Facultad de Ingeniería UBA, 1999", caption:"Una generación del Coro a fines del siglo XX." },
  { id:-12, type:"image", url:"/choir/coro-2015.webp", title:"Generación 2015", caption:"El Coro de la Facultad de Ingeniería UBA reunido durante la temporada 2015." },
  { id:-13, type:"image", url:"/choir/coro-generations.webp", title:"Generaciones del Coro", caption:"Distintas voces y épocas que forman una misma historia colectiva." },
];

const otherStages = concertSet(
  [1,2,3,7,13,14,15,16,17,21,22,29,36,40],
  ["El Coro de la Facultad de Ingeniería UBA en uno de sus escenarios invitados.","Una presentación coral fuera del ciclo de Las Heras.","Encuentros y conciertos que forman parte de nuestra historia."]
);

const choirLife = concertSet(
  [4,5,11,12,18,20,23,25,26,27,28,34,35,44,47],
  ["Coreutas e invitados reunidos después de cantar.","Un momento compartido fuera del escenario.","El encuentro y el ágape también forman parte de la vida coral."]
);

function MediaCard({ item, index, onVideo, quiet = false }: { item:Media; index:number; onVideo:(item:Media)=>void; quiet?:boolean }) {
  const content = <><div className="media-image"><img src={item.type === "image" ? item.url : item.thumbnailUrl || "/logo-fiuba2.png"} alt={item.type === "image" ? item.title : ""} loading={index > 1 ? "lazy" : "eager"} /></div>{quiet && item.type === "image" ? item.caption && <small className="media-caption">{item.caption}</small> : <><span>{item.type === "image" ? "Fotografía" : "Ver video"}</span><strong>{item.title}</strong>{item.caption && <small>{item.caption}</small>}</>}</>;
  const className = `media-card reveal-item media-${index%4}`;
  return item.type === "image"
    ? <article className={className}>{content}</article>
    : <button className={className} onClick={() => onVideo(item)}>{content}</button>;
}

function Collection({ eyebrow, title, intro, items, onVideo, tone, quiet = true }: { eyebrow:string; title:string; intro:string; items:Media[]; onVideo:(item:Media)=>void; tone?:string; quiet?:boolean }) {
  return <section className={`archive-collection ${tone || ""}`}><header><p className="section-index">{eyebrow}</p><h2>{title}</h2><p>{intro}</p></header><div className="archive-mosaic">{items.map((item,index) => <MediaCard item={item} index={index} onVideo={onVideo} quiet={quiet} key={item.id} />)}</div></section>;
}

export default function ArchiveContent() {
  const [video,setVideo] = useState<Media|null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold:.08, rootMargin:"0px 0px -5%" });
    document.querySelectorAll(".reveal-item").forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return <><section className="page-hero archive-hero"><div className="page-hero-grid" aria-hidden="true" /><p className="section-index">04 — Archivo vivo</p><div><p className="eyebrow"><span /> Nuestra memoria</p><h1>Escuchanos.<br /><em>Miranos.</em></h1></div><p className="page-intro">Conciertos, ensayos y momentos que forman nuestra historia colectiva.</p></section><main className="archive-page"><div className="archive-heading"><p className="section-index">Una memoria en movimiento</p><h2>Generaciones,<br /><em>escenarios y encuentros.</em></h2><p>Una pared de recuerdos: fotografías de distintas épocas, escalas y formatos que conservan su proporción original.</p></div><Collection eyebrow="Sede Las Heras" title="Ciclo de Conciertos Corales" intro="Presentaciones del ciclo organizado por el Coro de la Facultad de Ingeniería UBA junto a agrupaciones invitadas." items={concertCycle} onVideo={setVideo} tone="collection-cycle" /><Collection eyebrow="Sede Las Heras" title="La Noche de los Museos" intro="Una presentación especial del Coro de la Facultad de Ingeniería UBA en el hall histórico de la sede Las Heras." items={museumNight} onVideo={setVideo} tone="collection-night" /><Collection eyebrow="Trabajo musical" title="Ensayos" intro="El proceso de escucha, preparación y construcción colectiva antes de cada concierto." items={rehearsals} onVideo={setVideo} tone="collection-rehearsals" /><Collection eyebrow="Memoria coral" title="Generaciones del Coro" intro="Retratos del conjunto completo a través de distintas etapas, viajes y grandes presentaciones." items={generations} onVideo={setVideo} tone="collection-generations" /><Collection eyebrow="Recorridos" title="Otros escenarios" intro="Conciertos, encuentros y presentaciones que llevaron las voces del Coro de la Facultad de Ingeniería UBA a distintos espacios." items={otherStages} onVideo={setVideo} tone="collection-stages" /><Collection eyebrow="Comunidad" title="Vida coral" intro="Después de cantar, el coro se encuentra en el ágape: una celebración compartida que también forma parte de nuestra vida coral." items={choirLife} onVideo={setVideo} tone="collection-life" /></main>{video && <div className="modal" role="dialog" aria-modal="true" aria-label={video.title}><button className="modal-close" onClick={() => setVideo(null)} aria-label="Cerrar video">×</button><div className="video-frame">{video.type === "youtube" ? <iframe src={video.url} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video src={video.url} controls autoPlay />}<h2>{video.title}</h2></div></div>}</>;
}
