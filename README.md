# Coro FIUBA

Sitio web del Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires.

Incluye información institucional, historia del coro, agenda de conciertos, archivo fotográfico y un formulario para quienes quieran participar. La base del panel editorial queda preparada para una próxima versión.

## Tecnologías

Next.js, React, TypeScript, Tailwind CSS y Drizzle ORM.

## Instalación

Requiere Node.js 22 o posterior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Las integraciones con Google Apps Script y EmailJS se configuran en `.env.local`. Para producción también se recomienda definir `NEXT_PUBLIC_SITE_URL`. Las variables disponibles están documentadas en `.env.example`.

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

**Darío Villar** |
**Analista de Sistemas**

Proyecto desarrollado para el Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires.
