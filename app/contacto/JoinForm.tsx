"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { saveApplication, type ApplicationPayload } from "@/lib/applications";
import { FIUBA_AFFILIATIONS, FIUBA_CAREERS, FIUBA_STUDENT_AFFILIATION } from "@/lib/application-options";
import { isValidEmail } from "@/lib/validation";

type Errors = Record<string, string>;
type SubmissionState = "idle" | "submitting" | "success" | "error";

function validate(values: Record<string, string>) {
  const errors: Errors = {};
  if (values.fullName.trim().length < 3) errors.fullName = "Ingresá tu nombre y apellido.";
  if (!isValidEmail(values.email || "")) errors.email = "Ingresá una dirección de correo válida.";
  const phone = values.phone.replace(/[\s()-]/g, "");
  if (!/^\+?\d{8,15}$/.test(phone) || /^(\+?)(\d)\2{7,}$/.test(phone)) errors.phone = "Ingresá un celular válido, con código de área.";
  const age = Number(values.age);
  if (!Number.isInteger(age) || age < 16 || age > 99) errors.age = "Por favor, ingresá una edad correcta.";
  if (!values.affiliation) errors.affiliation = "Seleccioná cuál es tu vínculo con FIUBA.";
  if (values.affiliation === FIUBA_STUDENT_AFFILIATION && !values.career) errors.career = "Seleccioná tu carrera.";
  if (!values.voice) errors.voice = "Seleccioná una opción.";
  if (!values.experience) errors.experience = "Seleccioná una opción.";
  if (!values.consent) errors.consent = "Necesitamos tu autorización para poder contactarte.";
  return errors;
}

export default function JoinForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [serverError, setServerError] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sending = submissionState === "submitting";

  const closeSuccess = useCallback(() => {
    setSubmissionState("idle");
    window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>("[name=\"fullName\"]")?.focus());
  }, []);

  useEffect(() => {
    if (submissionState !== "success") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") closeSuccess(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeSuccess, submissionState]);

  useEffect(() => {
    if (!sending) return;
    const previousOverflow = document.body.style.overflow;
    const preventExit = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("beforeunload", preventExit);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("beforeunload", preventExit);
    };
  }, [sending]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setServerError("");

    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const values = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, String(value)])) as Record<string, string>;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    const payload: ApplicationPayload = {
      nombre: values.fullName.trim(),
      email: values.email.trim(),
      celular: values.phone.trim(),
      edad: Number(values.age),
      vinculoFiuba: values.affiliation,
      carrera: values.affiliation === FIUBA_STUDENT_AFFILIATION ? values.career : "",
      registroVoz: values.voice,
      experiencia: values.experience,
      sobreVos: values.message?.trim() || "",
      consentimiento: true,
    };

    setSubmissionState("submitting");
    try {
      await saveApplication(payload);
      form.reset();
      setAffiliation("");
      setErrors({});
      setServerError("");
      setSubmissionState("success");
    } catch (error) {
      setSubmissionState("error");
      setServerError(error instanceof Error ? error.message : "No pudimos enviar tus datos en este momento. Por favor, intentá nuevamente.");
    }
  }

  const clear = (name: string) => {
    setErrors(current => { const next = { ...current }; delete next[name]; return next; });
    if (submissionState === "error") {
      setSubmissionState("idle");
      setServerError("");
    }
  };
  const fieldClass = (name: string) => errors[name] ? "field invalid" : "field";
  const checkEmail = (value: string) => setErrors(current => isValidEmail(value) ? current : { ...current, email: "Ingresá una dirección de correo válida." });

  return <><section className="join-page-hero"><div><p className="section-index">05 — Contacto</p><p className="eyebrow"><span /> Tu voz también construye</p><h1>Hay un lugar<br />para <em>vos.</em></h1><p>Completá tus datos y nos pondremos en contacto. No hace falta pertenecer a la FIUBA ni tener experiencia coral previa.</p></div><aside><div><small>Ensayos</small><strong>Todos los viernes<br />19:30 — 22:00 h</strong></div><div><small>Lugar</small><strong>Av. Paseo Colón 850</strong><a href="https://maps.app.goo.gl/p9ZfPAG2v7PEmbyP6" target="_blank" rel="noreferrer">Abrir en Maps ↗</a></div></aside></section>
    <section className="form-section"><div className="form-aside"><span>01</span><h2>Contanos<br />sobre vos.</h2><p>Los campos marcados con <b>*</b> son obligatorios. Revisaremos tus datos únicamente para contactarte por la convocatoria.</p></div><form ref={formRef} className="join-form modern" onSubmit={submit} noValidate aria-busy={sending}>
      <div className="form-heading"><div><small>Formulario de contacto y participación</small><h2>Datos personales</h2></div><span>01 / 01</span></div>
      <div className="form-row"><label className={fieldClass("fullName")}><span>Nombre y apellido *</span><input name="fullName" autoComplete="name" placeholder="¿Cómo te llamás?" required maxLength={120} onChange={() => clear("fullName")} aria-invalid={!!errors.fullName} />{errors.fullName && <em>{errors.fullName}</em>}</label><label className={fieldClass("email")}><span>Correo electrónico *</span><input name="email" type="email" inputMode="email" autoComplete="email" placeholder="tu@email.com" required maxLength={150} onChange={() => clear("email")} onBlur={event => checkEmail(event.currentTarget.value)} aria-invalid={!!errors.email} />{errors.email && <em>{errors.email}</em>}</label></div>
      <div className="form-row"><label className={fieldClass("phone")}><span>Celular *</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={50} placeholder="11 0000 0000" onChange={() => clear("phone")} aria-invalid={!!errors.phone} />{errors.phone && <em>{errors.phone}</em>}</label><label className={fieldClass("age")}><span>Edad *</span><input name="age" type="number" inputMode="numeric" min={16} max={99} placeholder="Tu edad" onChange={() => clear("age")} aria-invalid={!!errors.age} />{errors.age && <em>{errors.age}</em>}</label></div>
      <div className={`form-row affiliation-row ${affiliation === FIUBA_STUDENT_AFFILIATION ? "has-career" : ""}`}><label className={fieldClass("affiliation")}><span>Vínculo con FIUBA *</span><div className="select-wrap"><select name="affiliation" value={affiliation} onChange={event => { setAffiliation(event.currentTarget.value); clear("affiliation"); clear("career"); }} aria-invalid={!!errors.affiliation}><option value="" disabled>Elegí una opción</option>{FIUBA_AFFILIATIONS.map(option => <option key={option} value={option}>{option}</option>)}</select></div>{errors.affiliation && <em>{errors.affiliation}</em>}</label>{affiliation === FIUBA_STUDENT_AFFILIATION && <label className={`${fieldClass("career")} conditional-field`}><span>Carrera en FIUBA *</span><div className="select-wrap"><select name="career" defaultValue="" onChange={() => clear("career")} aria-invalid={!!errors.career}><option value="" disabled>Elegí tu carrera</option>{FIUBA_CAREERS.map(career => <option key={career} value={career}>{career}</option>)}</select></div>{errors.career && <em>{errors.career}</em>}</label>}</div>
      <div className="form-row"><label className={fieldClass("voice")}><span>Registro de voz *</span><div className="select-wrap"><select name="voice" defaultValue="" onChange={() => clear("voice")} aria-invalid={!!errors.voice}><option value="" disabled>Elegí una opción</option><option value="Soprano">Soprano</option><option value="Contralto">Contralto</option><option value="Tenor">Tenor</option><option value="Bajo">Bajo</option><option value="No estoy seguro/a">No estoy seguro/a</option></select></div>{errors.voice && <em>{errors.voice}</em>}</label><label className={fieldClass("experience")}><span>Experiencia previa *</span><div className="select-wrap"><select name="experience" defaultValue="" onChange={() => clear("experience")} aria-invalid={!!errors.experience}><option value="" disabled>Elegí una opción</option><option value="Sin experiencia">Sin experiencia</option><option value="Algo de experiencia">Algo de experiencia</option><option value="Experiencia coral">Experiencia coral</option></select></div>{errors.experience && <em>{errors.experience}</em>}</label></div>
      <label className="field"><span>Contanos algo sobre vos <small>(opcional)</small></span><textarea name="message" rows={4} maxLength={1500} placeholder="¿Qué te acerca al canto coral?" /></label>
      <label className={errors.consent ? "consent invalid" : "consent"}><input name="consent" type="checkbox" onChange={() => clear("consent")} /><i aria-hidden="true">✓</i><span>Acepto que el Coro FIUBA use estos datos para contactarme sobre la convocatoria.</span>{errors.consent && <em>{errors.consent}</em>}</label>
      <div className="form-submit"><button className="button button-blue button-submit" type="submit" disabled={sending}>{sending ? "Enviando…" : "Enviar solicitud"}</button><p>Tu información se almacena de forma segura.</p></div>
      {serverError && <div className="form-message error" role="alert">{serverError}</div>}
    </form></section>
    <section className="locations-section"><header><p className="section-index">Dónde encontrarnos</p><h2>Dos sedes.<br /><em>Una comunidad.</em></h2><p>Los ensayos regulares se realizan en Paseo Colón. El Ciclo de Conciertos Corales y presentaciones como La Noche de los Museos tienen lugar en Las Heras.</p></header><div className="locations-grid"><article><div className="location-copy"><span>01</span><div><small>Conciertos y presentaciones</small><h3>Sede Las Heras</h3><p>Av. Las Heras 2214 · Ciudad de Buenos Aires</p></div></div><div className="map-frame"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.6210611631477!2d-58.3963223!3d-34.588453699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca98ed16e55b%3A0xbbef040fda1e66bd!2sUBA%2C%20Facultad%20de%20Ingenier%C3%ADa%20-%20Sede%20Las%20Heras!5e0!3m2!1ses!2sar!4v1787329063865!5m2!1ses!2sar" title="Mapa de la sede Las Heras de la Facultad de Ingeniería UBA" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></article><article><div className="location-copy"><span>02</span><div><small>Ensayos de los viernes</small><h3>Sede Paseo Colón</h3><p>Av. Paseo Colón 850 · Ciudad de Buenos Aires</p></div></div><div className="map-frame"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.469098129668!2d-58.37080352445762!3d-34.61758407294931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca98f0058631%3A0x98688c83fc192f2e!2sUBA%2C%20Facultad%20de%20Ingenier%C3%ADa%20-%20Sede%20Paseo%20Col%C3%B3n!5e0!3m2!1ses!2sar!4v1787329094480!5m2!1ses!2sar" title="Mapa de la sede Paseo Colón de la Facultad de Ingeniería UBA" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></article></div></section>
    {sending && <div className="dashboard-notice-backdrop application-processing-backdrop" role="presentation"><section className="dashboard-notice application-processing-modal" role="status" aria-live="polite" aria-busy="true"><span className="dashboard-notice-kicker">Enviando mensaje</span><div className="dashboard-notice-mark" aria-hidden="true"><i /><i /><i /><i /><i /></div><h2>Estamos enviando<br /><em>tu mensaje.</em></h2><strong className="application-processing-warning">No cierres esta ventana.</strong><small>Esto suele demorar solo unos segundos.</small></section></div>}
    {submissionState === "success" && <div className="dashboard-notice-backdrop application-success-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeSuccess(); }}><section className="dashboard-notice application-success-modal" role="dialog" aria-modal="true" aria-labelledby="application-success-title" aria-describedby="application-success-copy"><span className="dashboard-notice-kicker">Mensaje recibido</span><div className="application-success-check" aria-hidden="true"><span /></div><h2 id="application-success-title">¡Gracias por contactarte<br /><em>con el Coro FIUBA!</em></h2><p id="application-success-copy">Recibimos tu mensaje correctamente.</p><p className="application-success-note">Nos pondremos en contacto con vos a la brevedad.</p><button ref={closeButtonRef} className="button button-blue" type="button" onClick={closeSuccess}>Cerrar</button></section></div>}
  </>;
}
