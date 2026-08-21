import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const viewport: Viewport = { themeColor: "#010e24", colorScheme: "light dark" };

function getMetadataBase() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicitUrl) return new URL(explicitUrl);

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return new URL(vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
}

const metadataBase = getMetadataBase();
const title = "Coro FIUBA — Ingeniería en armonía";
const description = "Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires. Conocé nuestra actividad y sumate a cantar.";

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  applicationName: "Coro FIUBA",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=2", sizes: "48x48", type: "image/png" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicon-32x32.png?v=2"],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Coro FIUBA" },
  formatDetection: { telephone: false },
  openGraph: {
    title,
    description,
    images: [{ url: "/logo-fiuba.png", width: 1254, height: 1254, alt: "Logo del Coro FIUBA" }],
    type: "website",
  },
  twitter: { card: "summary", title, description, images: ["/logo-fiuba.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><head><link rel="icon" href="/favicon-32x32.png?v=2" sizes="32x32" type="image/png" /><link rel="shortcut icon" href="/favicon-32x32.png?v=2" type="image/png" /><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" sizes="180x180" /></head><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
