import PageHero from "@/app/components/PageHero";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("El coro", "Conocé la identidad, la comunidad y el espíritu musical del Coro FIUBA.");

export default function ChoirPage() {
  return <main><SiteHeader /><PageHero index="01 — El coro" eyebrow="Muchas voces, una obra" title="Respirar juntos." italic="Construir sonido." intro="Un punto de encuentro entre la disciplina de la ingeniería y la sensibilidad de la música coral." />
    <section className="editorial-split"><div className="large-number">01</div><div><h2>Voces que hacen<br />universidad.</h2><p>El Coro FIUBA es una comunidad abierta que ensaya, aprende y transforma cada partitura en una experiencia compartida. La escucha, el trabajo colectivo y el compromiso son parte de nuestra manera de hacer música.</p><p>No hace falta pertenecer a la Facultad para participar. Nos convoca el deseo de cantar, crecer musicalmente y construir un sonido común.</p></div><aside><div className="column-study" aria-hidden="true"><i /><i /><i /><i /><i /></div><small>Música · Formación · Comunidad</small></aside></section>
    <section className="values-band"><article><span>01</span><h3>Escucha</h3><p>Cada voz encuentra su lugar atendiendo a las demás.</p></article><article><span>02</span><h3>Disciplina</h3><p>El ensayo transforma el esfuerzo individual en obra colectiva.</p></article><article><span>03</span><h3>Encuentro</h3><p>La música abre un espacio de comunidad dentro y fuera de la Facultad.</p></article></section>
    <section className="page-cta"><div><p className="eyebrow"><span /> Ensayamos cada viernes</p><h2>¿Querés cantar<br />con nosotros?</h2></div><a className="button button-gold" href="/sumate">Conocé la convocatoria <span>→</span></a></section><SiteFooter /></main>;
}
