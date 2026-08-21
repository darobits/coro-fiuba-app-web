"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import DashboardNotice from "@/app/components/DashboardNotice";

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
  const [showDashboardNotice, setShowDashboardNotice] = useState(false);
  const announceDashboard = () => { setOpen(false); setShowDashboardNotice(true); };

  return <>
    <header className="site-header">
      <div className="header-shell">
        <Link className="brand" href="/" aria-label="Coro FIUBA, inicio">
          <img src="/logo-fiuba.png" alt="" />
          <span className="brand-copy">
            <strong>Coro FIUBA</strong>
            <small>Facultad de Ingeniería · UBA</small>
          </span>
        </Link>
        <nav className={open ? "open" : ""} aria-label="Navegación principal">
          {links.map(([href, label]) => <Link key={href} href={href} className={path === href || (path === "/sumate" && href === "/contacto") ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>)}
          <button className="mobile-login" type="button" onClick={announceDashboard}><FiLogIn aria-hidden="true" /> Ingresar</button>
        </nav>
        <div className="header-actions">
          <button className="login-link" type="button" onClick={announceDashboard} aria-label="Información sobre el panel de administración" title="Panel de administración"><FiLogIn aria-hidden="true" /><span>Ingresar</span></button>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}><i /><i /></button>
        </div>
      </div>
    </header>
    <DashboardNotice open={showDashboardNotice} onDismiss={() => setShowDashboardNotice(false)} />
  </>;
}
