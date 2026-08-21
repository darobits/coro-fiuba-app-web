import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renderiza la portada institucional del Coro FIUBA", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="es"/i);
  assert.match(html, /<title>Coro FIUBA[^<]*Ingeniería en armonía<\/title>/i);
  assert.match(html, /Ingeniería/);
  assert.match(html, /armonía/);
  assert.match(html, /El coro/i);
  assert.match(html, /Ciclo de conciertos/i);
  assert.match(html, /Agenda/i);
  assert.match(html, /Archivo/i);
  assert.match(html, /Contacto/i);
  assert.match(html, /rel="(?:shortcut )?icon"[^>]*href="\/favicon-32x32\.png\?v=2"/i);
  assert.doesNotMatch(html, /codex-preview|vinext-starter|Starter Project/i);
});

test("la ruta del panel informa que estará disponible próximamente", async () => {
  const response = await render("/login");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Panel en preparación/i);
  assert.match(html, /próxima versión/i);
  assert.doesNotMatch(html, /404|This page could not be found/i);
});
