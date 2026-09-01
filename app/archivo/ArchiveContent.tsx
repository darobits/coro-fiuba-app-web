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

function concertSet(numbers: number[], captions: string[]): Media[] {
  return numbers.map((number, index) => {
    const caption = captions[index % captions.length];
    return {
      id: -1000 - number,
      type: "image",
      url: `/choir/concerts/concert-${String(number).padStart(2, "0")}.webp`,
      title: caption,
      caption,
    };
  });
}

const museumNight = concertSet(
  [30, 31, 32, 37, 41, 42, 43, 45, 46],
  ["El Coro de la Facultad de Ingeniería UBA durante La Noche de los Museos.", "Una presentación especial en la sede Las Heras.", "Voces e ingeniería en una noche abierta a la comunidad."],
);

const concertCycle = concertSet(
  [8, 19, 24, 33, 38, 39],
  ["El Ciclo de Conciertos Corales en la sede Las Heras.", "El Coro de la Facultad de Ingeniería UBA compartiendo escenario con agrupaciones invitadas.", "Una jornada del ciclo organizado por el Coro de la Facultad de Ingeniería UBA."],
);

const rehearsals = concertSet(
  [6, 9, 10],
  ["Ensayo del Coro de la Facultad de Ingeniería UBA en la Facultad.", "Preparación musical antes de una presentación.", "Trabajo de voces y dirección durante el ensayo."],
);

const generations: Media[] = [
  { id: -10, type: "image", url: "/choir/chubut-1996.webp", title: "El Coro en Chubut", caption: "Una imagen histórica de la actividad coral durante la década del noventa." },
  { id: -11, type: "image", url: "/choir/coro-1999.webp", title: "Coro de la Facultad de Ingeniería UBA, 1999", caption: "Una generación del Coro a fines del siglo XX." },
  { id: -12, type: "image", url: "/choir/coro-2015.webp", title: "Generación 2015", caption: "El Coro de la Facultad de Ingeniería UBA reunido durante la temporada 2015." },
  { id: -13, type: "image", url: "/choir/coro-generations.webp", title: "Generaciones del Coro", caption: "Distintas voces y épocas que forman una misma historia colectiva." },
];

const otherStages = concertSet(
  [1, 2, 3, 7, 13, 14, 15, 16, 17, 21, 22, 29, 36, 40],
  ["El Coro de la Facultad de Ingeniería UBA en uno de sus escenarios invitados.", "Una presentación coral fuera del ciclo de Las Heras.", "Encuentros y conciertos que forman parte de nuestra historia."],
).map((item) => item.url.endsWith("concert-21.webp") || item.url.endsWith("concert-29.webp") ? { ...item, focus: "center 78%" } : item);

const choirLife = concertSet(
  [4, 5, 11, 12, 18, 20, 23, 25, 26, 27, 28, 34, 35, 44, 47],
  ["Coreutas e invitados reunidos después de cantar.", "Un momento compartido fuera del escenario.", "El encuentro y el ágape también forman parte de la vida coral."],
).map((item) => item.url.endsWith("concert-12.webp") ? { ...item, focus: "center center" } : item);

const collections: ArchiveCollection[] = [
  { id: "ciclo", number: "01", eyebrow: "Sede Las Heras", title: "Ciclo de Conciertos Corales", intro: "Presentaciones del ciclo organizado por el Coro de la Facultad de Ingeniería UBA junto a agrupaciones invitadas.", items: concertCycle, tone: "collection-cycle" },
  { id: "museos", number: "02", eyebrow: "Sede Las Heras", title: "La Noche de los Museos", intro: "Una presentación especial del Coro de la Facultad de Ingeniería UBA en el hall histórico de la sede Las Heras.", items: museumNight, tone: "collection-night" },
  { id: "ensayos", number: "03", eyebrow: "Trabajo musical", title: "Ensayos", intro: "El proceso de escucha, preparación y construcción colectiva antes de cada concierto.", items: rehearsals, tone: "collection-rehearsals" },
  { id: "generaciones", number: "04", eyebrow: "Memoria coral", title: "Generaciones del Coro", intro: "Retratos del conjunto completo a través de distintas etapas, viajes y grandes presentaciones.", items: generations, tone: "collection-generations" },
  { id: "escenarios", number: "05", eyebrow: "Recorridos", title: "Otros escenarios", intro: "Conciertos, encuentros y presentaciones que llevaron las voces del Coro de la Facultad de Ingeniería UBA a distintos espacios.", items: otherStages, tone: "collection-stages" },
  { id: "vida-coral", number: "06", eyebrow: "Comunidad", title: "Vida coral", intro: "Después de cantar, el coro se encuentra en el ágape: una celebración compartida que también forma parte de nuestra vida coral.", items: choirLife, tone: "collection-life" },
];

function MediaCard({ item, index, onOpen }: { item: Media; index: number; onOpen: (item: Media) => void }) {
  return (
    <button className={`media-card reveal-item media-${index % 4}`} onClick={() => onOpen(item)} aria-label={`Ampliar: ${item.title}`}>
      <span className="media-image">
        <img src={item.url} alt={item.title} loading={index > 1 ? "lazy" : "eager"} style={{ objectPosition: item.focus || "center" }} />
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
