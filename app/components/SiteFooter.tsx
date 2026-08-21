import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { SiGmail } from "react-icons/si";

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-identity">
      <img src="/logo-fiuba.png" alt="Logo Coro FIUBA" />
      <div><h2>Coro FIUBA</h2><p>Facultad de Ingeniería<span>Universidad de Buenos Aires</span></p></div>
    </div>
    <div className="footer-links footer-navigation"><small>Navegación</small><a href="/el-coro">El coro</a><a href="/ciclo">Ciclo de conciertos</a><a href="/agenda">Agenda</a><a href="/archivo">Archivo</a><a href="/sumate">Sumate</a></div>
    <div className="footer-divider" aria-hidden="true" />
    <div className="footer-links footer-social"><small>Encontranos</small><a href="https://www.instagram.com/corofiuba/" target="_blank" rel="noreferrer" aria-label="Instagram del Coro FIUBA"><FaInstagram aria-hidden="true" /><span>Instagram</span><FiArrowUpRight className="social-arrow" aria-hidden="true" /></a><a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube del Coro FIUBA"><FaYoutube aria-hidden="true" /><span>YouTube</span><FiArrowUpRight className="social-arrow" aria-hidden="true" /></a><a href="mailto:coro@fi.uba.ar" aria-label="Enviar un correo al Coro FIUBA"><SiGmail aria-hidden="true" /><span>Correo</span><FiArrowUpRight className="social-arrow" aria-hidden="true" /></a></div>
    <p className="copyright">© 2026 Coro FIUBA · Buenos Aires, Argentina</p>
  </footer>;
}
