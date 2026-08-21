export type Announcement = { id: number; title: string; summary: string; eventDate: string | null; location: string | null; status: string; createdAt: string };
export type MediaItem = { id: number; title: string; type: string; url: string; thumbnailUrl: string | null; caption: string | null; createdAt: string };

export function youtubeEmbedUrl(input: string) {
  try {
    const url = new URL(input);
    const id = url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}` : input;
  } catch { return input; }
}
