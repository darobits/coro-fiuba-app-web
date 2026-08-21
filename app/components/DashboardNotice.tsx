"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function DashboardNotice({ open, onDismiss }: { open: boolean; onDismiss?: () => void }) {
  const router = useRouter();
  const goHome = useCallback(() => {
    onDismiss?.();
    router.replace("/");
  }, [onDismiss, router]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(goHome, 4500);
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") goHome(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [goHome, open]);

  if (!open) return null;

  return <div className="dashboard-notice-backdrop" role="presentation">
    <section className="dashboard-notice" role="dialog" aria-modal="true" aria-labelledby="dashboard-notice-title" aria-describedby="dashboard-notice-copy">
      <span className="dashboard-notice-kicker">Próximamente</span>
      <div className="dashboard-notice-mark" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <h2 id="dashboard-notice-title">El panel editorial<br /><em>está en preparación.</em></h2>
      <p id="dashboard-notice-copy">La gestión de anuncios y del archivo multimedia estará disponible en una próxima versión.</p>
      <button className="button button-blue" type="button" onClick={goHome}>Volver al inicio</button>
      <small>Te llevaremos automáticamente al inicio.</small>
      <span className="dashboard-notice-progress" aria-hidden="true" />
    </section>
  </div>;
}
