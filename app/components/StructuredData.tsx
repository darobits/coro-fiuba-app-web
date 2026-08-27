import type { AgendaEvent } from "@/lib/agenda";
import { SITE_URL } from "@/lib/site";

const organizationId = `${SITE_URL}/#coro-fiuba`;

function JsonLd({ id, data }: { id: string; data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function SiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Coro FIUBA",
        alternateName: "Coro de la Facultad de Ingeniería UBA",
        inLanguage: "es-AR",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "MusicGroup",
        "@id": organizationId,
        name: "Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires",
        alternateName: "Coro FIUBA",
        url: SITE_URL,
        description: "Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires, abierto a la comunidad, dirigido por Carolina Abbamonte y con Lurdes Sabeckis en la subdirección.",
        email: "mailto:fiubacoro@gmail.com",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo-fiuba.png`,
          contentUrl: `${SITE_URL}/logo-fiuba.png`,
          width: 1254,
          height: 1254,
        },
        image: `${SITE_URL}/choir/hero-architecture.webp`,
        sameAs: [
          "https://www.instagram.com/corofiuba/",
          "https://www.youtube.com/@CoroFIUBA",
          "https://www.fi.uba.ar/bienestar/cultura/coro",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Av. Paseo Colón 850",
          addressLocality: "Ciudad Autónoma de Buenos Aires",
          addressRegion: "Buenos Aires",
          addressCountry: "AR",
        },
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: "Facultad de Ingeniería de la Universidad de Buenos Aires",
          url: "https://www.fi.uba.ar/",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "fiubacoro@gmail.com",
          contactType: "información y participación",
          availableLanguage: "es",
        },
      },
    ],
  };

  return <JsonLd id="coro-fiuba-structured-data" data={data} />;
}

export function AgendaStructuredData({ events }: { events: AgendaEvent[] }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": events.map(event => ({
      "@type": "MusicEvent",
      "@id": `${SITE_URL}/agenda#evento-${Math.abs(event.id)}`,
      name: `${event.title} — Coro FIUBA`,
      description: event.summary,
      startDate: event.startDate,
      ...(event.endDate ? { endDate: event.endDate } : {}),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      inLanguage: "es-AR",
      url: `${SITE_URL}/agenda#evento-${Math.abs(event.id)}`,
      image: `${SITE_URL}/choir/concerts/concert-19.webp`,
      location: {
        "@type": "Place",
        name: event.location,
        sameAs: event.mapUrl,
        ...(event.address ? { address: { "@type": "PostalAddress", ...event.address } } : {}),
      },
      organizer: { "@id": organizationId },
      performer: { "@id": organizationId },
    })),
  };

  return <JsonLd id="coro-fiuba-agenda-structured-data" data={data} />;
}
