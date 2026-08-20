import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "Coro FIUBA — Ingeniería en armonía";
  const description = "Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires. Conocé nuestra actividad y sumate a cantar.";
  return { metadataBase: base, title, description, icons: { icon: "/logo-fiuba.png" }, openGraph: { title, description, images: [new URL("/og.png", base).toString()], type: "website" }, twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", base).toString()] } };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
