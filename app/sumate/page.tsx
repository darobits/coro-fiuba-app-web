import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";
import JoinForm from "./JoinForm";

export const metadata = pageMetadata("Sumate", "Completá el formulario para participar del Coro FIUBA.");
export default function JoinPage() { return <main><SiteHeader /><JoinForm /><SiteFooter /></main>; }
