# Coro FIUBA — Sitio web oficial

Sitio institucional del **Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires**. Reúne su historia, el Ciclo de Conciertos Corales, la agenda, el archivo fotográfico y el formulario para participar.

## Funcionalidades

- Páginas institucionales para el coro, el ciclo, la agenda y el archivo.
- Archivo visual responsive con fotografías históricas y actuales.
- Formulario de contacto y convocatoria con validación de datos.
- Registro opcional de formularios mediante Google Apps Script.
- Notificaciones y respuestas automáticas mediante EmailJS.
- Panel editorial preparado para administrar anuncios y contenidos.
- Carga de imágenes en almacenamiento R2 y datos persistentes en D1.
- Metadatos sociales, favicons y Web App Manifest.

## Tecnologías

- React 19
- TypeScript
- vinext y Vite
- Cloudflare Workers, D1 y R2
- Drizzle ORM
- OpenAI Sites

## Requisitos

- Node.js `22.13.0` o posterior
- npm

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

La aplicación estará disponible en la dirección indicada por la terminal, normalmente `http://localhost:3000`.

## Variables de entorno

Copiá `.env.example` como `.env.local` y completá únicamente los servicios que vayas a utilizar:

| Variable | Uso |
| --- | --- |
| `ADMIN_EMAILS` | Correos autorizados para acceder al panel, separados por comas. |
| `APPS_SCRIPT_URL` | URL pública del Web App de Google Apps Script que registra las postulaciones. |
| `EMAILJS_SERVICE_ID` | Identificador del servicio de EmailJS. |
| `EMAILJS_PUBLIC_KEY` | Clave pública de EmailJS. |
| `EMAILJS_PRIVATE_KEY` | Clave privada de EmailJS, solo del lado servidor. |
| `EMAILJS_REPLY_TEMPLATE_ID` | Plantilla de respuesta automática para quien completa el formulario. |
| `EMAILJS_NOTICE_TEMPLATE_ID` | Plantilla de aviso interno por una nueva postulación. |

Los archivos `.env*` están excluidos del repositorio. Nunca publiques credenciales reales.

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # compilación de producción
npm run lint         # análisis estático
npm test             # compilación y prueba del HTML renderizado
npm run db:generate  # genera migraciones de Drizzle
```

## Estructura principal

```text
app/                 páginas, componentes y endpoints
db/                  esquema y acceso a D1
drizzle/             migraciones versionadas
lib/                 datos, metadatos y validaciones compartidas
public/              imágenes, identidad visual e iconos
tests/               pruebas automatizadas
worker/              entrada del Cloudflare Worker
.openai/hosting.json recursos administrados por Sites
```

## Rutas

- `/` — inicio
- `/el-coro` — identidad, historia y dirección artística
- `/ciclo` — Ciclo de Conciertos Corales
- `/agenda` — próximos conciertos y presentaciones
- `/archivo` — memoria fotográfica
- `/contacto` — convocatoria, formulario y sedes
- `/login` — ingreso al panel editorial
- `/admin` — gestión de anuncios y contenidos

## Datos y publicación

La configuración de `.openai/hosting.json` declara los recursos lógicos `DB` y `MEDIA`. La plataforma de Sites administra sus equivalentes reales durante la publicación. Las migraciones de D1 se conservan en `drizzle/` y los archivos cargados desde el panel se almacenan en R2.

Antes de publicar, verificá que la compilación y las pruebas finalicen correctamente y configurá las variables de entorno en el servicio de alojamiento.

## Autoría

Proyecto desarrollado para el Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires.
