import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";
import ArchiveContent from "./ArchiveContent";

export const metadata = pageMetadata("Archivo histórico del Coro FIUBA", "Fotografías, conciertos, ensayos y memoria visual de distintas generaciones del Coro de la Facultad de Ingeniería UBA.", "/archivo");
export default function ArchivePage() { return <main><SiteHeader /><ArchiveContent /><SiteFooter /></main>; }
