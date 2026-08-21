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
