export default function PageHero({ index, eyebrow, title, italic, intro }: { index: string; eyebrow: string; title: string; italic: string; intro: string }) {
  return <section className="page-hero"><div className="page-hero-grid" aria-hidden="true" /><p className="section-index">{index}</p><div><p className="eyebrow"><span /> {eyebrow}</p><h1>{title}<br /><em>{italic}</em></h1></div><p className="page-intro">{intro}</p></section>;
}
