"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiLogIn } from "react-icons/fi";

const links = [
  ["/el-coro", "El coro"],
  ["/ciclo", "Ciclo de conciertos"],
  ["/agenda", "Agenda"],
  ["/archivo", "Archivo"],
  ["/contacto", "Contacto"],
];

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return <header className="site-header">
    <div className="header-shell">
      <a className="brand" href="/" aria-label="Coro FIUBA, inicio">
        <img src="/logo-fiuba.png" alt="" />
        <span className="brand-copy">
          <strong><span>Coro</span><em>FIUBA</em></strong>
          <small>Facultad de Ingeniería · UBA</small>
        </span>
      </a>
      <nav className={open ? "open" : ""} aria-label="Navegación principal">
        {links.map(([href, label]) => <a key={href} href={href} className={path === href || (path === "/sumate" && href === "/contacto") ? "active" : ""} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="mobile-login" href="/login" onClick={() => setOpen(false)}><FiLogIn aria-hidden="true" /> Ingresar</a>
      </nav>
      <div className="header-actions">
        <a className="login-link" href="/login" aria-label="Ingresar al panel de administración" title="Ingresar al panel de administración"><FiLogIn aria-hidden="true" /><span>Ingresar</span></a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}><i /><i /></button>
      </div>
    </div>
  </header>;
}
