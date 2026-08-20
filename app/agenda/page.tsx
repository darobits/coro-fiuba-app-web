import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";
import AgendaContent from "./AgendaContent";

export const metadata = pageMetadata("Agenda", "Anuncios, conciertos y novedades del Coro FIUBA.");
export default function AgendaPage() { return <main><SiteHeader /><AgendaContent /><SiteFooter /></main>; }
