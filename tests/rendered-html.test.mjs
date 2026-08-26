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

test("la ruta del panel informa que estará disponible próximamente", async () => {
  const page = await readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8");
  const notice = await readFile(new URL("../app/components/DashboardNotice.tsx", import.meta.url), "utf8");
  assert.match(page, /Panel en preparación/i);
  assert.match(notice, /próxima versión/i);
  assert.match(notice, /router\.replace\("\/"\)/i);
});
test("la convocatoria guarda únicamente mediante Google Apps Script", async () => {
  const route = await readFile(new URL("../app/api/join/route.ts", import.meta.url), "utf8");
  const form = await readFile(new URL("../app/contacto/JoinForm.tsx", import.meta.url), "utf8");
  const helper = await readFile(new URL("../lib/applications.ts", import.meta.url), "utf8");
  assert.match(route, /process\.env\.APPS_SCRIPT_URL/);
  assert.doesNotMatch(route, /EMAILJS/i);
  assert.match(form, /saveApplication\(payload\)/);
  assert.match(form, /applicationId/);
  assert.match(form, /application-processing-backdrop/);
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
});
