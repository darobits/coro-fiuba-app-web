# Coro FIUBA

Sitio web del Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires.

Incluye información institucional, historia del coro, agenda de conciertos, archivo fotográfico y un formulario para quienes quieran participar. También cuenta con un panel de administración para gestionar anuncios y contenido multimedia.

## Tecnologías

React, TypeScript, vinext, Vite, Drizzle ORM, Cloudflare D1 y R2.

## Instalación

Requiere Node.js 22 o posterior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Las integraciones con Google Apps Script y EmailJS se configuran en `.env.local`. Las variables disponibles están documentadas en `.env.example`.

## Comandos

```bash
npm run dev          # entorno de desarrollo
npm run build        # compilación de producción
npm run lint         # análisis del código
npm test             # compilación y pruebas
npm run db:generate  # generación de migraciones
```

---
## Autor

**Darío Villar**
**Analista de Sistemas**

Proyecto desarrollado para el Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires.
