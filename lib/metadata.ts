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
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Coro de la Facultad de Ingeniería UBA", type: "image/png" }],
      type: "website",
      siteName: "Coro de la Facultad de Ingeniería UBA",
      locale: "es_AR",
    },
    twitter: { card: "summary_large_image", title: `${title} — Coro de la Facultad de Ingeniería UBA`, description, images: ["/opengraph-image"] },
  };
}
