import type { Metadata } from "next";

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} — Coro FIUBA`,
    description,
    openGraph: {
      title: `${title} — Coro FIUBA`,
      description,
      images: [{ url: "/logo-fiuba.png", width: 1254, height: 1254, alt: "Logo del Coro FIUBA" }],
    },
    twitter: { card: "summary", title: `${title} — Coro FIUBA`, description, images: ["/logo-fiuba.png"] },
  };
}
