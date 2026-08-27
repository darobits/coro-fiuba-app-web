import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteStructuredData } from "@/app/components/StructuredData";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import "./fiuba.css";

const display = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  variable: "--font-display",
  weight: "400 600",
  style: "normal",
  display: "swap",
});
const sans = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-sans",
  weight: "400 700",
  style: "normal",
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#1a2b5e", colorScheme: "light" };

const title = "Coro FIUBA | Coro de la Facultad de Ingeniería UBA";
const description = "Sitio oficial del Coro FIUBA (FIUBA Coro), el Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires. Historia, conciertos, agenda, archivo y cómo sumarte.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  applicationName: "Coro FIUBA",
  creator: "Coro FIUBA",
  publisher: "Facultad de Ingeniería de la Universidad de Buenos Aires",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Coro FIUBA" },
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title,
    description,
    url: "/",
    images: [{ url: "/logo-fiuba.png", width: 1254, height: 1254, alt: "Logo del Coro FIUBA" }],
    type: "website",
    siteName: "Coro FIUBA",
    locale: "es_AR",
  },
  twitter: { card: "summary", title, description, images: ["/logo-fiuba.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR"><body className={`${display.variable} ${sans.variable} fiuba-edition`}><SiteStructuredData />{children}</body></html>;
}
