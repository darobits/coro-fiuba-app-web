import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const viewport: Viewport = { themeColor: "#010e24", colorScheme: "light dark" };

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "Coro FIUBA — Ingeniería en armonía";
  const description = "Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires. Conocé nuestra actividad y sumate a cantar.";
  return {
    metadataBase: base,
    title,
    description,
    applicationName: "Coro FIUBA",
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Coro FIUBA" },
    formatDetection: { telephone: false },
    openGraph: { title, description, images: [new URL("/og-2026.png", base).toString()], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og-2026.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
