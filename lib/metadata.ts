import type { Metadata } from "next";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: `${title} — Coro de la Facultad de Ingeniería UBA`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — Coro de la Facultad de Ingeniería UBA`,
      description,
      url: path,
      images: [{ url: "/logo-fiuba2.png", width: 1254, height: 1254, alt: "Logo del Coro de la Facultad de Ingeniería UBA" }],
      type: "website",
      siteName: "Coro de la Facultad de Ingeniería UBA",
      locale: "es_AR",
    },
    twitter: { card: "summary", title: `${title} — Coro de la Facultad de Ingeniería UBA`, description, images: ["/logo-fiuba2.png"] },
  };
}
