"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Media = {
  id: number;
  title: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  focus?: string;
};

type ArchiveCollection = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: Media[];
  tone: string;
};

function concertPhoto(number: number, title: string, caption: string, focus?: string): Media {
  return {
    id: -1000 - number,
    type: "image",
    url: `/choir/concerts/concert-${String(number).padStart(2, "0")}.webp`,
    title,
    caption,
    focus,
  };
}

const museumNight = [
  concertPhoto(30, "El Coro en la escalinata", "El Coro canta en la escalinata del hall de Las Heras durante La Noche de los Museos."),
  concertPhoto(31, "Voces en el hall de Las Heras", "Una vista cercana del conjunto durante la presentación de La Noche de los Museos."),
  concertPhoto(32, "Concierto abierto a la comunidad", "El Coro y su dirección musical durante La Noche de los Museos en la Facultad."),
  concertPhoto(21, "El Coro en La Noche de los Museos", "El Coro de la Facultad de Ingeniería UBA durante una presentación de La Noche de los Museos."),
  concertPhoto(22, "Voces en La Noche de los Museos", "Las distintas cuerdas del Coro FIUBA durante una presentación de La Noche de los Museos."),
  concertPhoto(37, "Carolina Abbamonte dirigiendo", "La directora Carolina Abbamonte al frente del Coro durante La Noche de los Museos."),
  concertPhoto(41, "Música en el hall histórico", "El Coro, instrumentistas y público reunidos en el hall de la sede Las Heras."),
  concertPhoto(42, "El Coro en escena", "Una presentación del conjunto bajo las luces de La Noche de los Museos."),
  concertPhoto(43, "Las voces del Coro", "Coreutas durante la interpretación de una obra en La Noche de los Museos."),
  concertPhoto(45, "Cantar juntos", "Una vista cercana de las distintas cuerdas durante el concierto."),
  concertPhoto(46, "Dirección, voces e instrumentos", "Carolina Abbamonte dirige al Coro y a los instrumentistas en el hall de Las Heras."),
];

const concertCycle = [
  concertPhoto(8, "El Coro FIUBA en la escalinata", "El Coro de la Facultad de Ingeniería UBA se presenta durante el Ciclo de Conciertos Corales."),
  concertPhoto(19, "El Coro FIUBA en el hall", "El Coro de la Facultad de Ingeniería UBA durante una jornada del Ciclo de Conciertos Corales."),
  concertPhoto(24, "El Coro FIUBA en el Ciclo", "El Coro de la Facultad de Ingeniería UBA durante una presentación del Ciclo."),
  concertPhoto(33, "Conjunto vocal invitado", "Un ensamble participante canta en la escalinata de la Facultad."),
  concertPhoto(38, "El Coro FIUBA en el Ciclo", "El Coro de la Facultad de Ingeniería UBA durante una fecha del Ciclo de Conciertos Corales."),
  concertPhoto(39, "El Coro FIUBA visto desde las alturas", "Vista general del Coro de la Facultad, la dirección y el público en el hall de Las Heras."),
];

const rehearsals = [
  concertPhoto(6, "Ensayo con instrumentistas", "Preparación conjunta de voces e instrumentos antes de una presentación."),
  concertPhoto(9, "Marcación durante el ensayo", "La dirección trabaja con el conjunto en una sala de la Facultad."),
  concertPhoto(10, "Trabajo de repertorio", "Coreutas reunidos durante una instancia de preparación musical."),
];

const generations: Media[] = [
  { id: -10, type: "image", url: "/choir/chubut-1996.webp", title: "El Coro en Chubut", caption: "Una imagen histórica de la actividad coral durante la década del noventa." },
  { id: -11, type: "image", url: "/choir/coro-1999.webp", title: "Coro de la Facultad de Ingeniería UBA, 1999", caption: "Una generación del Coro a fines del siglo XX." },
  { id: -12, type: "image", url: "/choir/coro-2015.webp", title: "Generación 2015", caption: "El Coro de la Facultad de Ingeniería UBA reunido durante la temporada 2015." },
  { id: -13, type: "image", url: "/choir/coro-generations.webp", title: "Generaciones del Coro", caption: "Distintas voces y épocas que forman una misma historia colectiva." },
  { id: -2001, type: "image", url: "/choir/archive/generations-60/generation-60-01.jpg", title: "Coro FIUBA en concierto, década del 60", caption: "Una de las primeras generaciones del Coro de la Facultad de Ingeniería UBA." },
  { id: -2002, type: "image", url: "/choir/archive/generations-60/generation-60-02.jpg", title: "El Coro visto desde las alturas", caption: "Una formación histórica del Coro durante una presentación en la década del 60." },
  { id: -2003, type: "image", url: "/choir/archive/generations-60/generation-60-03.jpg", title: "Presentación coral en los años sesenta", caption: "El conjunto reunido en escena durante sus primeros años de actividad." },
  { id: -2004, type: "image", url: "/choir/archive/generations-60/generation-60-04.jpg", title: "Encuentro coral universitario", caption: "El Coro de Ingeniería compartiendo una presentación junto a otras voces." },
  { id: -2005, type: "image", url: "/choir/archive/generations-60/generation-60-05.jpg", title: "El Coro junto a Virtú Maragno", caption: "Virtú Maragno al frente de una generación fundacional del Coro." },
  { id: -2006, type: "image", url: "/choir/archive/generations-60/generation-60-06.jpg", title: "Festival universitario en La Plata", caption: "Una presentación histórica del Coro en un encuentro de coros universitarios." },
];

const otherStages: Media[] = [
  concertPhoto(1, "Entrega de un reconocimiento", "Un homenaje realizado en el marco de la trayectoria artística del Coro."),
  concertPhoto(2, "Presentación en Agronomía", "El Coro canta en el salón de actos de la Facultad de Agronomía de la UBA."),
  concertPhoto(3, "Presentación en la Facultad de Derecho", "El Coro de la Facultad de Ingeniería UBA durante una presentación en la Facultad de Derecho de la UBA."),
  concertPhoto(7, "El Coro FIUBA en la Ballena Azul", "El Coro de la Facultad de Ingeniería UBA durante una presentación en la Ballena Azul del Centro Cultural Kirchner, actualmente Palacio Libertad."),
  concertPhoto(13, "Música compartida en el ágape", "Coros invitados comparten música con todos durante el ágape posterior al Ciclo de Conciertos Corales."),
  concertPhoto(15, "Canto compartido en el ágape", "El Coro FIUBA canta junto a los coros invitados durante el ágape posterior al Ciclo de Conciertos Corales."),
  concertPhoto(16, "El Coro FIUBA en la Ballena Azul", "Una vista cercana del Coro de la Facultad durante su presentación en la Ballena Azul del Centro Cultural Kirchner, actualmente Palacio Libertad."),
  concertPhoto(17, "El auditorio de la Ballena Azul", "El Coro FIUBA y el público durante la presentación en el auditorio de la Ballena Azul del Centro Cultural Kirchner, actualmente Palacio Libertad."),
  concertPhoto(29, "Bodas de Oro y de Plata con la Ingeniería", "Participación del Coro en el encuentro de graduados y graduadas de la Facultad.", "center 78%"),
  concertPhoto(36, "El Coro FIUBA en Santa Julia", "Presentación del Coro de la Facultad de Ingeniería UBA en la Parroquia Santa Julia, en el barrio de Caballito."),
  concertPhoto(40, "Presentación en un aula de Las Heras", "El Coro de la Facultad de Ingeniería UBA durante una presentación en un aula de la sede Las Heras."),
  { id: -2101, type: "image", url: "/choir/archive/exactas-2026/exactas-2026-01.jpg", title: "El Coro en Exactas", caption: "Presentación del Coro de la Facultad de Ingeniería UBA en Exactas, junio de 2026." },
  { id: -2102, type: "image", url: "/choir/archive/exactas-2026/exactas-2026-02.jpg", title: "Concierto en Exactas", caption: "El conjunto y su dirección durante la presentación de junio de 2026." },
  { id: -2103, type: "image", url: "/choir/archive/exactas-2026/exactas-2026-03.jpg", title: "Voces en el escenario de Exactas", caption: "Una de las obras interpretadas por el Coro durante el concierto." },
  { id: -2104, type: "image", url: "/choir/archive/exactas-2026/exactas-2026-04.jpg", title: "Presentación en Exactas", caption: "El Coro de la Facultad de Ingeniería UBA compartiendo música en otro escenario universitario." },
  { id: -2105, type: "image", url: "/choir/archive/exactas-2026/exactas-2026-05.jpg", title: "Encuentro coral en Exactas", caption: "Una imagen del concierto realizado en junio de 2026." },
  { id: -2106, type: "image", url: "/choir/archive/exactas-2026/exactas-2026-06.jpg", title: "Dirección y voces en Exactas", caption: "El Coro y su dirección durante la presentación de junio de 2026." },
];

const choirLife = [
  concertPhoto(4, "Una generación reunida", "Coreutas, dirección e invitados posan juntos después de una actividad coral."),
  concertPhoto(5, "Antes de salir a escena", "Una formación del Coro reunida en el vestuario antes de una presentación."),
  concertPhoto(11, "Un abrazo en el concierto de despedida", "Carolina Abbamonte y Marcelo Ortiz Rocca se abrazan durante el concierto de despedida realizado en 2023."),
  concertPhoto(12, "Dirección y subdirección en un acto", "Carolina Abbamonte, Marcelo Ortiz Rocca y Lurdes Sabeckis durante un acto.", "center center"),
  concertPhoto(18, "El Coro después de cantar", "Una fotografía grupal que reúne a coreutas de una de las generaciones del conjunto."),
  concertPhoto(20, "El Coro sobre el escenario", "Integrantes del Coro reunidos al finalizar una presentación."),
  concertPhoto(23, "Encuentro coral en Exactas", "El Coro FIUBA junto a otros coros invitados durante un encuentro coral en la Facultad de Ciencias Exactas y Naturales de la UBA."),
  concertPhoto(25, "Palabras después del concierto", "Un intercambio entre integrantes al finalizar una presentación coral."),
  concertPhoto(26, "Una charla distendida", "Coreutas comparten un momento espontáneo fuera del escenario."),
  concertPhoto(27, "El conjunto reunido", "Una generación del Coro posa junto a la dirección y personas invitadas."),
  concertPhoto(28, "El Coro en Santa Rosa de Lima", "El Coro de la Facultad de Ingeniería UBA durante una presentación en la Basílica Santa Rosa de Lima."),
  concertPhoto(34, "Celebración después de cantar", "Coreutas reunidos al cierre de una presentación."),
  concertPhoto(35, "La alegría del encuentro", "Una fotografía grupal después de compartir música."),
  concertPhoto(44, "Coros reunidos", "Integrantes de distintas agrupaciones posan juntos al finalizar un encuentro coral."),
  concertPhoto(47, "Historias entre coreutas", "Un momento de conversación y encuentro entre integrantes del Coro."),
];

const collections: ArchiveCollection[] = [
  { id: "ciclo", number: "01", eyebrow: "Sede Las Heras", title: "Ciclo de Conciertos Corales", intro: "Presentaciones del ciclo organizado por el Coro de la Facultad de Ingeniería UBA junto a agrupaciones invitadas.", items: concertCycle, tone: "collection-cycle" },
  { id: "museos", number: "02", eyebrow: "Sede Las Heras", title: "La Noche de los Museos", intro: "Una presentación especial del Coro de la Facultad de Ingeniería UBA en el hall histórico de la sede Las Heras.", items: museumNight, tone: "collection-night" },
  { id: "ensayos", number: "03", eyebrow: "Trabajo musical", title: "Ensayos", intro: "El proceso de escucha, preparación y construcción colectiva antes de cada concierto.", items: rehearsals, tone: "collection-rehearsals" },
  { id: "generaciones", number: "04", eyebrow: "Memoria coral", title: "Generaciones del Coro", intro: "Retratos del conjunto completo a través de distintas etapas, viajes y grandes presentaciones.", items: generations, tone: "collection-generations" },
  { id: "escenarios", number: "05", eyebrow: "Recorridos", title: "Otros escenarios", intro: "Conciertos, encuentros y presentaciones que llevaron las voces del Coro de la Facultad de Ingeniería UBA a distintos espacios.", items: otherStages, tone: "collection-stages" },
  { id: "vida-coral", number: "06", eyebrow: "Comunidad", title: "Vida coral", intro: "Encuentros, homenajes, despedidas y momentos compartidos que también forman parte de nuestra historia coral.", items: choirLife, tone: "collection-life" },
];

function MediaCard({ item, index, onOpen }: { item: Media; index: number; onOpen: (item: Media) => void }) {
  return (
    <button className={`media-card reveal-item media-${index % 4}`} onClick={() => onOpen(item)} aria-label={`Ampliar: ${item.title}`}>
      <span className="media-image">
        <img src={item.url} alt={item.title} loading={index > 1 ? "lazy" : "eager"} style={{ objectPosition: item.focus || "center 58%" }} />
        <span className="media-expand" aria-hidden="true">Ver imagen <b>↗</b></span>
      </span>
      {item.caption && <small className="media-caption">{item.caption}</small>}
    </button>
  );
}

function Collection({ collection, onOpen }: { collection: ArchiveCollection; onOpen: (item: Media) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    const track = trackRef.current;
    const nextIndex = Math.max(0, Math.min(index, collection.items.length - 1));
    const card = track?.children[nextIndex] as HTMLElement | undefined;
    const firstCard = track?.children[0] as HTMLElement | undefined;
    if (!track || !card || !firstCard) return;
    track.scrollTo({ left: card.offsetLeft - firstCard.offsetLeft, behavior: "smooth" });
    setCurrentSlide(nextIndex);
  };

  const syncCurrentSlide = () => {
    const track = trackRef.current;
    if (!track) return;
    const viewportCenter = track.scrollLeft + track.clientWidth / 2;
    const cards = Array.from(track.children) as HTMLElement[];
    const firstCardOffset = cards[0]?.offsetLeft || 0;
    const nextIndex = cards.reduce((closest, card, index) => {
      const cardCenter = card.offsetLeft - firstCardOffset + card.clientWidth / 2;
      const closestCard = cards[closest];
      const closestCenter = closestCard.offsetLeft - firstCardOffset + closestCard.clientWidth / 2;
      return Math.abs(cardCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter) ? index : closest;
    }, 0);
    setCurrentSlide(nextIndex);
  };

  return (
    <section className={`archive-collection ${collection.tone}`} id={collection.id}>
      <header>
        <p className="section-index">{collection.number} · {collection.eyebrow}</p>
        <h2>{collection.title}</h2>
        <div className="collection-intro">
          <p>{collection.intro}</p>
          <small>{collection.items.length} fotografías</small>
        </div>
      </header>
      <div className="collection-slider-tools" aria-label={`Navegación de ${collection.title}`}>
        <div className="collection-progress" aria-hidden="true"><i style={{ width: `${((currentSlide + 1) / collection.items.length) * 100}%` }} /></div>
        <span aria-live="polite"><strong>{String(currentSlide + 1).padStart(2, "0")}</strong> / {String(collection.items.length).padStart(2, "0")}</span>
        <div>
          <button onClick={() => goToSlide(currentSlide - 1)} disabled={currentSlide === 0} aria-label={`Anterior en ${collection.title}`}>←</button>
          <button onClick={() => goToSlide(currentSlide + 1)} disabled={currentSlide === collection.items.length - 1} aria-label={`Siguiente en ${collection.title}`}>→</button>
        </div>
      </div>
      <div className="archive-mosaic" ref={trackRef} onScroll={syncCurrentSlide}>
        {collection.items.map((item, index) => <MediaCard item={item} index={index} onOpen={onOpen} key={item.id} />)}
      </div>
    </section>
  );
}

export default function ArchiveContent() {
  const allItems = useMemo(() => collections.flatMap((collection) => collection.items), []);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lightboxTouch = useRef<{ x: number; y: number } | null>(null);
  const lightboxHistoryActive = useRef(false);
  const activeItem = activeIndex === null ? null : allItems[activeIndex];

  const openItem = (item: Media) => {
    const index = allItems.findIndex((candidate) => candidate.id === item.id);
    if (index < 0) return;
    setActiveIndex(index);
    if (!lightboxHistoryActive.current) {
      lightboxHistoryActive.current = true;
      window.history.pushState({ ...(window.history.state || {}), archiveLightboxIndex: index }, "");
    } else {
      window.history.replaceState({ ...(window.history.state || {}), archiveLightboxIndex: index }, "");
    }
  };
  const closeLightbox = useCallback(() => {
    if (lightboxHistoryActive.current) window.history.back();
    else setActiveIndex(null);
  }, []);
  const move = useCallback((direction: number) => {
    setActiveIndex((current) => {
      if (current === null) return null;
      const next = (current + direction + allItems.length) % allItems.length;
      if (lightboxHistoryActive.current) {
        window.history.replaceState({ ...(window.history.state || {}), archiveLightboxIndex: next }, "");
      }
      return next;
    });
  }, [allItems.length]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08, rootMargin: "0px 0px -5%" });
    document.querySelectorAll(".reveal-item").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncLightboxWithHistory = (state: unknown) => {
      const historyState = state as { archiveLightboxIndex?: unknown } | null;
      const historyIndex = historyState?.archiveLightboxIndex;
      if (typeof historyIndex === "number" && historyIndex >= 0 && historyIndex < allItems.length) {
        lightboxHistoryActive.current = true;
        setActiveIndex(historyIndex);
      } else {
        lightboxHistoryActive.current = false;
        setActiveIndex(null);
      }
    };
    const onPopState = (event: PopStateEvent) => syncLightboxWithHistory(event.state);
    syncLightboxWithHistory(window.history.state);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [allItems.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeLightbox, move]);

  return <>
    <section className="page-hero archive-hero">
      <div className="page-hero-grid" aria-hidden="true" />
      <p className="section-index">04 — Archivo vivo</p>
      <div><p className="eyebrow"><span /> Nuestra memoria</p><h1>Escuchanos.<br /><em>Miranos.</em></h1></div>
      <p className="page-intro">Conciertos, ensayos y momentos que forman nuestra historia colectiva.</p>
    </section>
    <div className="archive-page">
      <div className="archive-heading">
        <p className="section-index">Una memoria en movimiento</p>
        <h2>Generaciones,<br /><em>escenarios y encuentros.</em></h2>
        <p>Una pared de recuerdos: fotografías de distintas épocas, escalas y formatos que conservan su proporción original.</p>
      </div>
      <nav className="archive-index" aria-label="Colecciones del archivo">
        <header>
          <p className="section-index">Explorar el archivo</p>
          <p><strong>{allItems.length}</strong> imágenes en <strong>{collections.length}</strong> colecciones</p>
        </header>
        <div>
          {collections.map((collection) => (
            <a href={`#${collection.id}`} key={collection.id}>
              <span>{collection.number}</span>
              <strong>{collection.title}</strong>
              <small>{collection.items.length} imágenes</small>
              <b aria-hidden="true">↓</b>
            </a>
          ))}
        </div>
      </nav>
      {collections.map((collection) => <Collection collection={collection} onOpen={openItem} key={collection.id} />)}
      <section className="archive-contribution">
        <p className="section-index">07 — Archivo abierto</p>
        <div className="archive-contribution-heading">
          <p className="eyebrow dark"><span /> Memoria colectiva</p>
          <h2>La memoria también<br />se construye <em>entre todos.</em></h2>
        </div>
        <div className="archive-contribution-copy">
          <p>¿Tenés fotografías, programas o recuerdos del Coro? Ayudanos a seguir completando nuestra historia compartiendo ese material con nosotros.</p>
          <a className="button button-blue" href="/archivo/compartir">Compartir un recuerdo <span>→</span></a>
        </div>
      </section>
    </div>
    {activeItem && activeIndex !== null && (
      <div
        className="archive-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={activeItem.title}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          lightboxTouch.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const start = lightboxTouch.current;
          const touch = event.changedTouches[0];
          lightboxTouch.current = null;
          if (!start || !touch) return;
          const deltaX = touch.clientX - start.x;
          const deltaY = touch.clientY - start.y;
          if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) move(deltaX < 0 ? 1 : -1);
        }}
        onTouchCancel={() => { lightboxTouch.current = null; }}
      >
        <button className="lightbox-backdrop" onClick={closeLightbox} aria-label="Cerrar visor" />
        <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar imagen">×</button>
        <button className="lightbox-arrow lightbox-prev" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Imagen anterior">←</button>
        <figure>
          <img src={activeItem.url} alt={activeItem.title} />
          <figcaption>
            <span>{String(activeIndex + 1).padStart(2, "0")} / {String(allItems.length).padStart(2, "0")}</span>
            <p>{activeItem.caption || activeItem.title}</p>
          </figcaption>
          <small className="lightbox-swipe-hint">Deslizá para recorrer · Volver para cerrar</small>
        </figure>
        <button className="lightbox-arrow lightbox-next" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Imagen siguiente">→</button>
      </div>
    )}
  </>;
}
