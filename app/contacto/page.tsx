import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import JoinForm from "./JoinForm";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Sumate al Coro FIUBA", "Contactate con el Coro de la Facultad de Ingeniería UBA y completá el formulario para participar de los ensayos abiertos a la comunidad.", "/contacto");

export default function ContactPage() {
  return <main><SiteHeader /><JoinForm /><SiteFooter /></main>;
}
