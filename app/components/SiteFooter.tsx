export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-identity">
      <img src="/logo-fiuba.png" alt="Logo Coro FIUBA" />
      <h2>Coro FIUBA</h2>
      <p>Facultad de Ingeniería<br />Universidad de Buenos Aires</p>
    </div>
    <div className="footer-links footer-navigation"><small>Navegación</small><a href="/el-coro">El coro</a><a href="/ciclo">Ciclo de conciertos</a><a href="/agenda">Agenda</a><a href="/archivo">Archivo</a><a href="/sumate">Sumate</a></div>
    <div className="footer-divider" aria-hidden="true" />
    <div className="footer-links"><small>Encontranos</small><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube ↗</a><a href="mailto:coro@fi.uba.ar">Email ↗</a></div>
    <div className="footer-links footer-admin"><small>Gestión</small><a href="/login">Panel editorial →</a></div>
    <p className="copyright">© 2026 Coro FIUBA · Buenos Aires, Argentina</p>
  </footer>;
}
