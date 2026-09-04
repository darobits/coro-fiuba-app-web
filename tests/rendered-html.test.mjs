import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
}

test("genera una salida nativa de Next.js compatible con Vercel", async () => {
  await access(new URL("../.next/BUILD_ID", import.meta.url));
  const appPaths = await readJson("../.next/server/app-paths-manifest.json");
  assert.ok(appPaths["/page"]);
  assert.ok(appPaths["/login/page"]);
});

test("el SEO usa el dominio canónico y publica sitemap y robots", async () => {
  const site = await readFile(new URL("../lib/site.ts", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  const robots = await readFile(new URL("../app/robots.ts", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const homePage = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const structuredData = await readFile(new URL("../app/components/StructuredData.tsx", import.meta.url), "utf8");
  const socialImage = await readFile(new URL("../public/social-preview-fiuba-v2.png", import.meta.url));
  assert.match(site, /https:\/\/www\.corofiuba\.com\.ar/);
  assert.match(sitemap, /\/el-coro/);
  assert.match(sitemap, /\/agenda/);
  assert.match(sitemap, /\/archivo/);
  assert.match(sitemap, /lastModified/);
  assert.match(sitemap, /2026-08-27/);
  assert.doesNotMatch(sitemap, /\/login/);
  assert.match(robots, /\/sitemap\.xml/);
  assert.match(robots, /\/login/);
  assert.match(layout, /Coro de la Facultad de Ingeniería UBA/);
  assert.match(layout, /max-image-preview/);
  assert.match(layout, /favicon\.ico/);
  assert.match(layout, /android-chrome-192x192\.png/);
  assert.doesNotMatch(layout, /favicon[^"']*\?v=/);
  assert.match(structuredData, /"WebSite"/);
  assert.match(structuredData, /"MusicGroup"/);
  assert.match(structuredData, /"MusicEvent"/);
  assert.match(structuredData, /endDate: event\.endDate \?\? event\.eventDate/);
  assert.match(structuredData, /"Offer"/);
  assert.match(structuredData, /priceCurrency: "ARS"/);
  assert.match(structuredData, /instagram\.com\/corofiuba/);
  assert.match(structuredData, /youtube\.com\/@CoroFIUBA/);
  assert.match(structuredData, /fi\.uba\.ar\/bienestar\/cultura\/coro/);
  assert.match(structuredData, /Facultad de Ingeniería de la Universidad de Buenos Aires/);
  assert.match(structuredData, /Universidad de Buenos Aires/);
  assert.match(structuredData, /alternateName: "FIUBA"/);
  assert.match(structuredData, /alternateName: "UBA"/);
  assert.match(structuredData, /"FIUBA Coro"/);
  assert.match(layout, /coro de la facultad de ingeniería UBA/i);
  assert.match(layout, /coro de ingeniería de la UBA/i);
  assert.match(layout, /summary_large_image/);
  assert.match(layout, /\/social-preview-fiuba-v2\.png/);
  assert.ok(socialImage.length > 100_000);
  assert.equal(socialImage.subarray(1, 4).toString("ascii"), "PNG");
  assert.doesNotMatch(homePage, /también conocido como FIUBA Coro/);
});
test("las rutas de login y administración permanecen cerradas", async () => {
  const login = await readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8");
  const admin = await readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8");
  assert.match(login, /import \{ notFound \} from "next\/navigation"/);
  assert.match(admin, /import \{ notFound \} from "next\/navigation"/);
  assert.match(login, /notFound\(\)/);
  assert.match(admin, /notFound\(\)/);
  assert.doesNotMatch(login, /DashboardNotice/);
});
test("la convocatoria guarda únicamente mediante Google Apps Script", async () => {
  const route = await readFile(new URL("../app/api/join/route.ts", import.meta.url), "utf8");
  const form = await readFile(new URL("../app/contacto/JoinForm.tsx", import.meta.url), "utf8");
  const helper = await readFile(new URL("../lib/applications.ts", import.meta.url), "utf8");
  assert.match(route, /process\.env\.APPS_SCRIPT_URL/);
  assert.match(route, /maxDuration = 60/);
  assert.match(route, /AbortSignal\.timeout\(55_000\)/);
  assert.doesNotMatch(route, /EMAILJS/i);
  assert.match(form, /saveApplication\(payload\)/);
  assert.match(form, /application-processing-backdrop/);
  assert.match(form, /application-success-check/);
  assert.match(form, /Mensaje recibido/);
  assert.match(form, /Vínculo con FIUBA/);
  assert.match(form, /FIUBA_CAREERS\.map/);
  assert.match(route, /FIUBA_STUDENT_AFFILIATION/);
  assert.match(helper, /vinculoFiuba/);
  assert.doesNotMatch(form, /Número de inscripción/i);
  assert.match(helper, /\/api\/join/);
});

test("Code.gs genera IDs seguros y configura el flujo de estados", async () => {
  const script = await readFile(new URL("../google-apps-script/Code.gs", import.meta.url), "utf8");
  assert.match(script, /function doPost\(e\)/);
  assert.match(script, /LockService\.getScriptLock\(\)/);
  assert.match(script, /CF-/);
  assert.match(script, /Pendiente de audición/);
  assert.match(script, /setDataValidation/);
  assert.match(script, /processEmailQueue_\(\)/);
  assert.match(script, /Vínculo con FIUBA/);
  assert.match(script, /insertColumnsAfter\(7, 2\)/);
  assert.match(script, /CAREER_OPTIONS/);
});
