import type { Metadata } from "next";

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} — Coro FIUBA`,
    description,
    openGraph: { title: `${title} — Coro FIUBA`, description, images: [] },
    twitter: { title: `${title} — Coro FIUBA`, description, images: [] },
  };
}
