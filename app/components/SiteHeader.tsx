"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["/el-coro", "El coro"],
  ["/ciclo", "Ciclo"],
  ["/agenda", "Agenda"],
  ["/archivo", "Archivo"],
];

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return <header className="site-header">
    <a className="brand" href="/" aria-label="Coro FIUBA, inicio">
      <img src="/logo-fiuba.png" alt="" />
      <span><strong>Coro FIUBA</strong><small>Universidad de Buenos Aires</small></span>
    </a>
    <nav className={open ? "open" : ""} aria-label="Navegación principal">
      {links.map(([href, label]) => <a key={href} href={href} className={path === href ? "active" : ""} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="mobile-join" href="/sumate" onClick={() => setOpen(false)}>Sumate al coro</a>
      <a className="mobile-login" href="/login" onClick={() => setOpen(false)}>Administración</a>
    </nav>
    <div className="header-actions">
      <a className="login-link" href="/login" aria-label="Ingresar al panel" title="Ingresar al panel"><span aria-hidden="true">●</span> Ingresar</a>
      <a className="nav-cta" href="/sumate">Sumate <span>↗</span></a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}><i /><i /></button>
    </div>
  </header>;
}
