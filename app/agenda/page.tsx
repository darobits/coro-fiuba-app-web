import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { AgendaStructuredData } from "@/app/components/StructuredData";
import { pageMetadata } from "@/lib/metadata";
import { season2026 } from "@/lib/agenda";
import AgendaContent from "./AgendaContent";

export const metadata = pageMetadata("Agenda de conciertos 2026", "Agenda 2026 del Coro FIUBA: conciertos corales, Noche de los Museos y presentaciones de la Facultad de Ingeniería UBA.", "/agenda");
export default function AgendaPage() { return <main><AgendaStructuredData events={season2026} /><SiteHeader /><AgendaContent /><SiteFooter /></main>; }
