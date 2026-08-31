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

const title = "Coro de la Facultad de Ingeniería UBA | Coro FIUBA";
const description = "Sitio oficial del Coro de la Facultad de Ingeniería UBA. Historia, conciertos, agenda, archivo y cómo sumarte.";
const keywords = [
  "Coro FIUBA",
  "coro de la facultad de ingeniería UBA",
  "coro de la facultad de ingeniería",
  "coro ingeniería UBA",
  "coro facultad de ingeniería",
  "coro de ingeniería de la UBA",
  "FIUBA Coro",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords,
  alternates: { canonical: "/" },
  applicationName: "Coro de la Facultad de Ingeniería UBA",
  creator: "Coro de la Facultad de Ingeniería UBA",
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
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Coro de la Facultad de Ingeniería UBA" },
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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Coro de la Facultad de Ingeniería UBA", type: "image/png" }],
    type: "website",
    siteName: "Coro de la Facultad de Ingeniería UBA",
    locale: "es_AR",
  },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR"><body className={`${display.variable} ${sans.variable} fiuba-edition`}><SiteStructuredData />{children}</body></html>;
}
