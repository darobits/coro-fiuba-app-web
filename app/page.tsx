import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";

export default function Home() {
  return <main><SiteHeader />
    <section className="home-hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy"><p className="eyebrow"><span /> Facultad de Ingeniería · UBA</p><h1>Ingeniería<br />en <em>armonía.</em></h1><p>Un espacio donde las voces, la música y la comunidad universitaria se encuentran.</p><div className="hero-actions"><a className="button button-gold" href="/sumate">Quiero participar <span>→</span></a><a className="text-link" href="/el-coro">Conocé al coro <span>↗</span></a></div></div>
      <div className="hero-symbol"><div className="arch" aria-hidden="true" /><img src="/logo-fiuba.png" alt="Logo del Coro de la Facultad de Ingeniería de la UBA" /><p><span>Desde la facultad</span><strong>Una voz colectiva</strong></p></div>
      <div className="hero-foot"><span>Buenos Aires, Argentina</span><div className="sound-wave" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ height: `${10 + ((i * 13) % 26)}px` }} />)}</div><span>Cultura · Comunidad · Música</span></div>
    </section>

    <section className="home-intro"><p className="section-index">Una comunidad coral</p><div><p className="eyebrow dark"><span /> Muchas voces, una obra</p><h2>Respirar juntos.<br /><em>Construir sonido.</em></h2></div><p>El Coro FIUBA reúne música, aprendizaje y vida universitaria en un proyecto colectivo abierto a la comunidad.</p></section>

    <section className="portal-grid" aria-label="Explorar el sitio">
      <a href="/el-coro"><span>01</span><div><small>Identidad</small><h3>El coro</h3><p>Quiénes somos y qué nos reúne alrededor de la música.</p></div><b>↗</b></a>
      <a href="/ciclo"><span>02</span><div><small>Desde los años 90</small><h3>Ciclo de conciertos</h3><p>Una tradición de encuentros corales en la Facultad.</p></div><b>↗</b></a>
      <a href="/agenda"><span>03</span><div><small>Actualidad</small><h3>Agenda</h3><p>Anuncios, conciertos y novedades de nuestra actividad.</p></div><b>↗</b></a>
      <a href="/archivo"><span>04</span><div><small>Memoria viva</small><h3>Archivo</h3><p>Fotos, videos y momentos del Coro FIUBA.</p></div><b>↗</b></a>
    </section>

    <section className="home-cta"><div><p className="eyebrow"><span /> Ensayos todos los viernes</p><h2>Tu voz puede ser<br />parte de la obra.</h2></div><div><p>Nos encontramos de 19:30 a 22:00 h en la sede Paseo Colón de la Facultad de Ingeniería.</p><a className="button button-gold" href="/sumate">Sumate al coro <span>→</span></a></div></section>
    <SiteFooter />
  </main>;
}
