const choirSections = [
  ["Sopranos", "S", ["Griselda Perrotta", "María José Pacini", "María Isabel Novaro", "Juliana Ávila", "María Lurdes Sabeckis"]],
  ["Contraltos", "C", ["María Fernanda Cristobal", "Estefanía Abbamonte", "Ofelia Perez", "Ana Carolina Peredo", "Julieta Link", "Luz Hernández", "Nicole Moreno", "Carmen Lareu", "Eugenia Florencia Azcarate", "Claudia Carlucci"]],
  ["Tenores", "T", ["Pablo Witis", "Cristian Mariano Morales Fernandez", "José Ignacio Rodríguez", "Thomas Reller", "Rodrigo Federico Gonzalez Castro"]],
  ["Bajos", "B", ["Elías Cuba Díaz", "Facundo Olivera Zapiola", "Darío Villar", "Miguel Angel Vannoni", "Ernesto Aaron Gabriel Fretes", "Mariano Santos", "Eduardo Piñera"]],
] as const;

export default function ChoirMembers() {
  return <section className="choir-members" aria-labelledby="choir-members-title">
    <div className="members-heading">
      <div><p className="eyebrow"><span /> Temporada 2026</p><h2 id="choir-members-title">Integrantes<br /><em>actuales.</em></h2></div>
      <div className="members-summary"><strong>27</strong><span>voces<br />en escena</span></div>
    </div>
    <div className="voice-groups">
      {choirSections.map(([name, range, members], index) => <article className="voice-group" key={name}>
        <header><span aria-hidden="true">{range}</span><div><small>{String(index + 1).padStart(2, "0")} · Cuerda</small><h3>{name}</h3></div><b>{members.length}</b></header>
        <ul>{members.map((member) => <li key={member}><span aria-hidden="true" />{member}</li>)}</ul>
      </article>)}
    </div>
  </section>;
}
