"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// import { FiLogIn } from "react-icons/fi";
// import DashboardNotice from "@/app/components/DashboardNotice";

const links = [
  ["/el-coro", "El coro"],
  ["/ciclo", "Ciclo de conciertos"],
  ["/agenda", "Agenda"],
  ["/archivo", "Archivo"],
  ["/contacto", "Contacto"],
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    lastScrollY.current = window.scrollY;

    const updateHeader = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const currentScrollY = Math.max(window.scrollY, 0);
        const scrollDifference = currentScrollY - lastScrollY.current;

        setScrolled(currentScrollY > 18);
        if (open || currentScrollY < 120) setHidden(false);
        else if (scrollDifference > 5) setHidden(true);
        else if (scrollDifference < -3) setHidden(false);

        lastScrollY.current = currentScrollY;
        frame = 0;
      });
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateHeader);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open]);
  // Acceso al panel temporalmente oculto.
  // const [showDashboardNotice, setShowDashboardNotice] = useState(false);
  // const announceDashboard = () => { setOpen(false); setShowDashboardNotice(true); };

  return <>
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}`}>
      <div className="header-shell">
        <Link className="brand" href="/" aria-label="Coro de la Facultad de Ingeniería UBA, inicio">
          <img src="/logo-fiuba2.png" alt="" />
          <span className="brand-copy">
            <strong>Coro de la Facultad de<br /><span>Ingeniería UBA</span></strong>
          </span>
        </Link>
        <nav className={open ? "open" : ""} aria-label="Navegación principal">
          {links.map(([href, label]) => <Link key={href} href={href} className={path === href ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>)}
          {/* <button className="mobile-login" type="button" onClick={announceDashboard}><FiLogIn aria-hidden="true" /> Ingresar</button> */}
        </nav>
        <div className="header-actions">
          {/* <button className="login-link" type="button" onClick={announceDashboard} aria-label="Información sobre el panel de administración" title="Panel de administración"><FiLogIn aria-hidden="true" /><span>Ingresar</span></button> */}
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}><i /><i /></button>
        </div>
      </div>
    </header>
    <div className="site-header-spacer" aria-hidden="true" />
    {/* <DashboardNotice open={showDashboardNotice} onDismiss={() => setShowDashboardNotice(false)} /> */}
  </>;
}
