import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import JoinForm from "@/app/sumate/JoinForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Contacto", "Contactate con el Coro FIUBA y completá el formulario para participar.");

export default function ContactPage() {
  return <main><SiteHeader /><JoinForm /><SiteFooter /></main>;
}
