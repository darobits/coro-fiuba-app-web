import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";
import ArchiveContent from "./ArchiveContent";

export const metadata = pageMetadata("Archivo", "Fotos, videos y memoria viva del Coro FIUBA.", "/archivo");
export default function ArchivePage() { return <main><SiteHeader /><ArchiveContent /><SiteFooter /></main>; }
