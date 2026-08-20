import PageHero from "@/app/components/PageHero";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Ciclo de conciertos", "Historia, fechas y sede del Ciclo de Conciertos organizado por el Coro FIUBA.");

export default function CyclePage() {
  return <main><SiteHeader /><PageHero index="02 — Ciclo de conciertos" eyebrow="Una tradición desde 1995" title="La facultad" italic="abre sus puertas." intro="Encuentros anuales que reúnen a coros del ámbito cultural y universitario en la sede Las Heras." />
    <section className="history-section"><div><p className="section-index">Historia</p><h2>Una tradición<br />que continúa.</h2></div><div><p>El Coro FIUBA organiza el Ciclo de Conciertos Corales de la Facultad de Ingeniería desde 1995, durante la dirección del Maestro Marcelo Ortiz Rocca.</p><p>Desde entonces pasaron cientos de coros y el Ciclo se consolidó como un espacio importante de la escena coral argentina. Históricamente, su programación se desarrolla los sábados a partir de septiembre en la sede de Av. Las Heras 2214; el calendario habitual actual se presenta a continuación.</p></div></section>
    <section className="cycle-calendar"><div className="calendar-heading"><p className="eyebrow"><span /> Calendario habitual</p><h2>Tres sábados.<br />Tres encuentros.</h2></div><div className="date-grid"><article><span>Octubre</span><strong>Último<br />sábado</strong><small>18:00 — 20:00 h aprox.</small></article><article><span>Noviembre</span><strong>Último<br />sábado</strong><small>18:00 — 20:00 h aprox.</small></article><article><span>Diciembre</span><strong>Segundo<br />sábado</strong><small>18:00 — 20:00 h aprox.</small></article></div><div className="venue-card"><div><small>Sede Las Heras</small><strong>Av. Las Heras 2214</strong><p>Facultad de Ingeniería · Universidad de Buenos Aires</p></div><a className="button button-light" href="https://www.fi.uba.ar/institucional/sedes/las-heras" target="_blank" rel="noreferrer">Ver ubicación <span>↗</span></a></div></section>
    <section className="page-cta light"><div><p className="eyebrow dark"><span /> Actualidad</p><h2>Próximos<br />conciertos.</h2></div><a className="button button-blue" href="/agenda">Ver agenda <span>→</span></a></section><SiteFooter /></main>;
}
