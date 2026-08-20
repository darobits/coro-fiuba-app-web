import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import { isAdmin } from "@/lib/data";
import AdminPanel from "./panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const allowed = await isAdmin(user.email);
  if (!allowed) return <main className="admin-denied"><div><img src="/logo-fiuba.png" alt="Coro FIUBA" /><p>Acceso restringido</p><h1>Esta cuenta no administra el sitio.</h1><span>{user.email}</span><a href={chatGPTSignOutPath("/admin")}>Usar otra cuenta</a></div></main>;
  return <AdminPanel userName={user.displayName} signOut={chatGPTSignOutPath("/")} />;
}
