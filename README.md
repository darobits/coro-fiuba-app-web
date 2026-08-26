# Coro FIUBA

Sitio web del Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires.

Incluye información institucional, la historia del coro, la agenda de conciertos, un archivo fotográfico y el formulario de participación.

## Tecnologías

Next.js, React, TypeScript y Tailwind CSS.

## Instalación

Requiere Node.js 22 o posterior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

El formulario de participación se integra con Google Sheets mediante Apps Script. La configuración se encuentra en [`google-apps-script/README.md`](google-apps-script/README.md). Para producción también se recomienda definir `NEXT_PUBLIC_SITE_URL`; las variables disponibles están documentadas en `.env.example`.

## Comandos

```bash
npm run dev          # entorno de desarrollo
npm run build        # compilación de producción
npm run lint         # análisis del código
npm test             # compilación y pruebas
```

---
## Autor

**Darío Villar** |
**Analista de Sistemas**

Proyecto desarrollado para el Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires.
