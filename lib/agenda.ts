export type AgendaEvent = {
  id: number;
  title: string;
  summary: string;
  eventDate: string;
  startDate: string;
  endDate?: string;
  time: string;
  location: string;
  mapUrl: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
};

const lasHerasAddress = {
  streetAddress: "Av. Las Heras 2214",
  addressLocality: "Ciudad Autónoma de Buenos Aires",
  addressRegion: "Buenos Aires",
  addressCountry: "AR",
};

export const season2026: AgendaEvent[] = [
  { id:-101, title:"Ciclo de Conciertos Corales", summary:"Primer encuentro del Ciclo 2026 organizado por el Coro de la Facultad de Ingeniería UBA.", eventDate:"2026-09-26", startDate:"2026-09-26T18:00:00-03:00", time:"18:00 h", location:"Sede Las Heras · Av. Las Heras 2214", mapUrl:"https://maps.app.goo.gl/GXmzPA9sefcX2J5D7", address:lasHerasAddress },
  { id:-102, title:"Ciclo de Conciertos Corales", summary:"Segundo concierto del ciclo anual con coros invitados del ámbito cultural y universitario.", eventDate:"2026-10-31", startDate:"2026-10-31T18:00:00-03:00", time:"18:00 h", location:"Sede Las Heras · Av. Las Heras 2214", mapUrl:"https://maps.app.goo.gl/GXmzPA9sefcX2J5D7", address:lasHerasAddress },
  { id:-105, title:"La Noche de los Museos", summary:"El Coro FIUBA cantará en la apertura de esta nueva edición.", eventDate:"2026-11-14", startDate:"2026-11-14T19:00:00-03:00", endDate:"2026-11-15T02:00:00-03:00", time:"19:00 — 02:00 h", location:"Sede Las Heras · Av. Las Heras 2214", mapUrl:"https://maps.app.goo.gl/GXmzPA9sefcX2J5D7", address:lasHerasAddress },
  { id:-103, title:"Concierto en la Cripta de Santa Rosa de Lima", summary:"Presentación especial del Coro FIUBA.", eventDate:"2026-11-29", startDate:"2026-11-29T18:00:00-03:00", time:"18:00 h", location:"Cripta de Santa Rosa de Lima", mapUrl:"https://maps.app.goo.gl/TmE1SxKyz39hBPrC7", address:{ streetAddress:"Av. Belgrano 2216", addressLocality:"Ciudad Autónoma de Buenos Aires", addressRegion:"Buenos Aires", addressCountry:"AR" } },
  { id:-104, title:"Ciclo de Conciertos Corales", summary:"Concierto de cierre del Ciclo 2026 organizado por el Coro FIUBA.", eventDate:"2026-12-05", startDate:"2026-12-05T18:00:00-03:00", time:"18:00 h", location:"Sede Las Heras · Av. Las Heras 2214", mapUrl:"https://maps.app.goo.gl/GXmzPA9sefcX2J5D7", address:lasHerasAddress },
];
