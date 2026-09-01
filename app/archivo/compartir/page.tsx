import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";
import ArchiveContributionForm from "./ArchiveContributionForm";

export const metadata = pageMetadata(
  "Compartí un recuerdo",
  "Enviá fotografías y recuerdos para ayudar a completar el archivo histórico del Coro de la Facultad de Ingeniería UBA.",
  "/archivo/compartir",
);

export default function ArchiveContributionPage() {
  return <main className="archive-share-page"><SiteHeader /><ArchiveContributionForm /><SiteFooter /></main>;
}
