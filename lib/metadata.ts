import type { Metadata } from "next";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: `${title} — Coro FIUBA`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — Coro FIUBA`,
      description,
      url: path,
      images: [{ url: "/logo-fiuba2.png", width: 1254, height: 1254, alt: "Logo del Coro FIUBA" }],
      type: "website",
      siteName: "Coro FIUBA",
      locale: "es_AR",
    },
    twitter: { card: "summary", title: `${title} — Coro FIUBA`, description, images: ["/logo-fiuba2.png"] },
  };
}
