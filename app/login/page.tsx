import DashboardNotice from "@/app/components/DashboardNotice";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata("Panel en preparación", "El panel editorial estará disponible en una próxima versión.", "/login"),
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <main className="dashboard-coming-page">
    <SiteHeader />
    <section aria-hidden="true"><span>Próxima versión</span><h1>Panel editorial<br />del Coro FIUBA</h1></section>
    <DashboardNotice open />
  </main>;
}
