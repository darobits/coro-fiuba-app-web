import { chatGPTSignInPath } from "@/app/chatgpt-auth";
import SiteHeader from "@/app/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Administración", "Acceso al panel editorial del Coro FIUBA.");
export default function LoginPage() { return <main><SiteHeader /><section className="login-page"><div className="login-art"><div className="login-arch" /><img src="/logo-fiuba.png" alt="Logo Coro FIUBA" /><p>Gestión editorial<br />del Coro FIUBA</p></div><div className="login-card"><p className="eyebrow dark"><span /> Acceso restringido</p><h1>Panel de<br /><em>administración.</em></h1><p>Ingresá con la cuenta autorizada para publicar anuncios, administrar fotos y videos y consultar postulaciones.</p><a className="button button-blue" href={chatGPTSignInPath("/admin")}>Ingresar al panel <span>→</span></a><small>El acceso se habilita únicamente a las cuentas administradoras configuradas.</small></div></section></main>; }
