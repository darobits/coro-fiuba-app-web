"use client";

import { FormEvent, useState } from "react";
type Errors = Record<string,string>;

function validate(values: Record<string,string>) {
  const errors: Errors = {};
  if (values.fullName.trim().length < 3) errors.fullName = "Ingresá tu nombre y apellido.";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Ingresá un email válido.";
  const phone = values.phone.replace(/[\s()\-]/g, "");
  if (!/^\+?\d{8,15}$/.test(phone) || /^(\+?)(\d)\2{7,}$/.test(phone)) errors.phone = "Ingresá un celular válido, con código de área.";
  const age = Number(values.age);
  if (!Number.isInteger(age) || age < 16 || age > 99) errors.age = "Por favor, ingresá una edad correcta.";
  if (!values.voice) errors.voice = "Seleccioná una opción.";
  if (!values.experience) errors.experience = "Seleccioná una opción.";
  if (!values.consent) errors.consent = "Necesitamos tu autorización para poder contactarte.";
  return errors;
}

export default function JoinForm() {
  const [errors,setErrors] = useState<Errors>({}), [sending,setSending] = useState(false), [sent,setSent] = useState(false), [serverError,setServerError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSent(false); setServerError("");
    const form = event.currentTarget, raw = Object.fromEntries(new FormData(form).entries());
    const values = Object.fromEntries(Object.entries(raw).map(([key,value]) => [key,String(value)])) as Record<string,string>;
    const nextErrors = validate(values); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus(); return; }
    setSending(true);
    const response = await fetch("/api/join", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(values) });
    const result = await response.json(); setSending(false);
    if (response.ok) { form.reset(); setErrors({}); setSent(true); } else setServerError(result.error || "No pudimos enviar el formulario. Intentá nuevamente.");
  }
  const clear = (name:string) => setErrors(current => { const next={...current}; delete next[name]; return next; });
  const fieldClass = (name:string) => errors[name] ? "field invalid" : "field";
  return <><section className="join-page-hero"><div><p className="section-index">05 — Sumate</p><p className="eyebrow"><span /> Tu voz también construye</p><h1>Hay un lugar<br />para <em>vos.</em></h1><p>Completá tus datos y nos pondremos en contacto. No hace falta pertenecer a la FIUBA ni tener experiencia coral previa.</p></div><aside><div><small>Ensayos</small><strong>Todos los viernes<br />19:30 — 22:00 h</strong></div><div><small>Lugar</small><strong>Av. Paseo Colón 850</strong><a href="https://www.fi.uba.ar/institucional/sedes/paseo-colon" target="_blank" rel="noreferrer">Ver sede ↗</a></div></aside></section>
    <section className="form-section"><div className="form-aside"><span>01</span><h2>Contanos<br />sobre vos.</h2><p>Los campos marcados con <b>*</b> son obligatorios. Revisaremos tus datos únicamente para contactarte por la convocatoria.</p></div><form className="join-form modern" onSubmit={submit} noValidate>
      <div className="form-heading"><div><small>Formulario de participación</small><h2>Datos personales</h2></div><span>01 / 01</span></div>
      <div className="form-row"><label className={fieldClass("fullName")}><span>Nombre y apellido *</span><input name="fullName" autoComplete="name" placeholder="¿Cómo te llamás?" onChange={() => clear("fullName")} aria-invalid={!!errors.fullName} />{errors.fullName && <em>{errors.fullName}</em>}</label><label className={fieldClass("email")}><span>Email *</span><input name="email" type="email" autoComplete="email" placeholder="tu@email.com" onChange={() => clear("email")} aria-invalid={!!errors.email} />{errors.email && <em>{errors.email}</em>}</label></div>
      <div className="form-row"><label className={fieldClass("phone")}><span>Celular *</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="11 0000 0000" onChange={() => clear("phone")} aria-invalid={!!errors.phone} />{errors.phone && <em>{errors.phone}</em>}</label><label className={fieldClass("age")}><span>Edad *</span><input name="age" type="number" inputMode="numeric" placeholder="Tu edad" onChange={() => clear("age")} aria-invalid={!!errors.age} />{errors.age && <em>{errors.age}</em>}</label></div>
      <div className="form-row"><label className={fieldClass("voice")}><span>Registro de voz *</span><div className="select-wrap"><select name="voice" defaultValue="" onChange={() => clear("voice")} aria-invalid={!!errors.voice}><option value="" disabled>Elegí una opción</option><option value="Soprano">Soprano</option><option value="Contralto">Contralto</option><option value="Tenor">Tenor</option><option value="Bajo">Bajo</option><option value="No estoy seguro/a">No estoy seguro/a</option></select></div>{errors.voice && <em>{errors.voice}</em>}</label><label className={fieldClass("experience")}><span>Experiencia previa *</span><div className="select-wrap"><select name="experience" defaultValue="" onChange={() => clear("experience")} aria-invalid={!!errors.experience}><option value="" disabled>Elegí una opción</option><option value="Sin experiencia">Sin experiencia</option><option value="Algo de experiencia">Algo de experiencia</option><option value="Experiencia coral">Experiencia coral</option></select></div>{errors.experience && <em>{errors.experience}</em>}</label></div>
      <label className="field"><span>Contanos algo sobre vos <small>(opcional)</small></span><textarea name="message" rows={4} maxLength={1200} placeholder="¿Qué te acerca al canto coral?" /></label>
      <label className={errors.consent ? "consent invalid" : "consent"}><input name="consent" type="checkbox" onChange={() => clear("consent")} /><i aria-hidden="true">✓</i><span>Acepto que el Coro FIUBA use estos datos para contactarme sobre la convocatoria.</span>{errors.consent && <em>{errors.consent}</em>}</label>
      <div className="form-submit"><button className="button button-blue" disabled={sending}>{sending ? "Enviando…" : "Enviar solicitud"}<span>→</span></button><p>Tu información se almacena de forma segura.</p></div>
      {sent && <div className="form-message success" role="status"><strong>¡Gracias!</strong> Recibimos tus datos y pronto nos pondremos en contacto.</div>}{serverError && <div className="form-message error" role="alert">{serverError}</div>}
    </form></section></>;
}
