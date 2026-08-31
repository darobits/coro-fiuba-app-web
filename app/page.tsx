import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";

export default function Home() {
  return <main><SiteHeader />
    <section className="fiuba-home-hero">
      <div className="fiuba-hero-copy">
        <p className="fiuba-overline"><span>Sitio oficial</span> Facultad de Ingeniería · UBA</p>
        <h1><span>Coro de la Facultad de</span>Ingeniería UBA</h1>
        <p className="fiuba-hero-motto">Ingeniería en armonía.</p>
        <p className="fiuba-hero-lead">Un espacio de formación artística y trabajo colectivo que reúne a estudiantes, docentes, graduados, graduadas y personal de la Facultad a través de la música coral.</p>
        <div className="hero-actions">
          <a className="button button-hero-primary" href="/contacto">Quiero participar</a>
          <a className="button button-hero-secondary" href="/el-coro">Conocé al coro</a>
        </div>
      </div>
      <figure className="fiuba-hero-image">
        <img src="/choir/hero-architecture.webp" alt="El Coro de la Facultad de Ingeniería UBA cantando en la sede Las Heras" />
        <figcaption>Sede Las Heras · Música e ingeniería</figcaption>
      </figure>
      <aside className="fiuba-hero-facts" aria-label="Datos principales del Coro de la Facultad de Ingeniería UBA">
        <article><small>Ensayos</small><strong>Viernes · 19:30 a 22:00</strong><span>Sede Paseo Colón</span></article>
        <article><small>Ciclo coral</small><strong>Una tradición desde 1995</strong><span>Sede Las Heras</span></article>
      </aside>
    </section>

    <section className="fiuba-home-strip" aria-label="Características del Coro de la Facultad de Ingeniería UBA">
      <article><span>01</span><div><strong>Comunidad universitaria</strong><p>Estudiantes, docentes, graduados, graduadas y personal de la Facultad.</p></div></article>
      <article><span>02</span><div><strong>Repertorio diverso</strong><p>Música coral clásica, popular y contemporánea.</p></div></article>
      <article><span>03</span><div><strong>Memoria viva</strong><p>Más de seis décadas de historia y actividad coral.</p></div></article>
    </section>

    <section className="home-intro"><p className="section-index">Una comunidad coral</p><div><p className="eyebrow dark"><span /> Muchas voces, una obra</p><h2>Respirar juntos.<br /><em>Construir sonido.</em></h2></div><p>El Coro de la Facultad de Ingeniería UBA reúne música, aprendizaje y vida universitaria en un proyecto colectivo abierto a la comunidad.</p></section>

    <section className="home-photo-band"><figure><img src="/choir/concert-close.webp" alt="El Coro de la Facultad de Ingeniería UBA cantando bajo la dirección de Carolina Abbamonte" /></figure><div><p className="section-index">El coro en acción</p><h2>La música habita<br /><em>la Facultad.</em></h2><p>Ensayos, conciertos y encuentros hacen de la Facultad de Ingeniería un espacio vivo de escucha y comunidad.</p><a className="text-link dark-link archive-link" href="/archivo">Explorar el archivo</a></div></section>

    <section className="portal-grid" aria-label="Explorar el sitio">
      <header><p className="eyebrow dark"><span /> Conocé el proyecto</p><h2>El Coro de la Facultad<br /><em>de Ingeniería UBA, por dentro.</em></h2></header>
      <a href="/el-coro"><span>01</span><div><small>Identidad</small><h3>El coro</h3><p>Quiénes somos y qué nos reúne alrededor de la música.</p></div></a>
      <a href="/ciclo"><span>02</span><div><small>Desde 1995</small><h3>Ciclo de conciertos</h3><p>Una tradición de encuentros corales en la Facultad.</p></div></a>
      <a href="/agenda"><span>03</span><div><small>Actualidad</small><h3>Agenda</h3><p>Conciertos, presentaciones y novedades de la temporada.</p></div></a>
      <a href="/archivo"><span>04</span><div><small>Memoria visual</small><h3>Archivo</h3><p>Fotografías y momentos de distintas generaciones del Coro.</p></div></a>
    </section>

    <section className="home-cta"><div><p className="eyebrow"><span /> Ensayos todos los viernes</p><h2>Tu voz puede ser<br />parte de la obra.</h2></div><div><p>Nos encontramos de 19:30 a 22:00 h en la sede Paseo Colón de la Facultad de Ingeniería.</p><a className="button button-choir" href="/contacto">Sumate al coro</a></div></section>
    <SiteFooter />
  </main>;
}
