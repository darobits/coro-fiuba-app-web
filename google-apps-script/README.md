# Google Sheets · Inscripciones Coro FIUBA

Esta carpeta contiene la primera etapa de la integración del formulario:

```text
Formulario → API del sitio → Google Apps Script → Google Sheets
```

En esta etapa no se utiliza EmailJS ni se envían correos.

## Configuración paso a paso

1. Entrá a Google Sheets y creá una hoja de cálculo nueva.
2. Asignale el nombre **Inscripciones Coro FIUBA**.
3. Copiá el ID del documento. Es el texto ubicado entre `/d/` y `/edit` en la URL:

   ```text
   https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
   ```

4. Abrí **Extensiones → Apps Script** desde esa hoja.
5. Eliminá el contenido inicial del editor y pegá completo el archivo [`Code.gs`](./Code.gs).
6. En `CONFIG.SPREADSHEET_ID`, reemplazá `REEMPLAZAR_CON_EL_ID_DE_LA_SHEET` por el ID obtenido en el paso 3.
7. Guardá el proyecto de Apps Script.
8. Elegí **Implementar → Nueva implementación**.
9. En tipo de implementación, seleccioná **Aplicación web**.
10. Configurá:

    - **Ejecutar como:** Yo.
    - **Quién tiene acceso:** Cualquier usuario.

    El acceso público es necesario para que una persona pueda enviar el formulario sin iniciar sesión en Google.

11. Presioná **Implementar** y autorizá los permisos solicitados para acceder a Google Sheets.
12. Copiá la URL de la aplicación web. Debe terminar en `/exec`, no en `/dev`.
13. En la raíz del proyecto, creá o editá `.env.local`:

    ```env
    APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_IMPLEMENTACION/exec
    ```

14. Reiniciá el proyecto para que Next.js tome la variable:

    ```bash
    npm run dev
    ```

En Vercel, cargá `APPS_SCRIPT_URL` desde la configuración de variables de entorno del proyecto y volvé a desplegar.

## Qué configura automáticamente

En el primer envío, Apps Script crea o prepara la pestaña **Inscripciones Coro FIUBA** con:

- Las trece columnas definidas para la convocatoria.
- Encabezado azul institucional, texto blanco y primera fila congelada.
- Filtros, anchos de columna, ajuste de texto, formatos de fecha y hora.
- Filas alternadas para mejorar la lectura.
- Estado inicial **Nuevo**.
- Desplegable de estado con las opciones del flujo de seguimiento.
- ID correlativo `CF-0001`, `CF-0002`, etc.

El ID se genera dentro de Apps Script bajo `LockService`, por lo que dos envíos simultáneos no deberían recibir el mismo número. También se evita repetir exactamente la misma inscripción durante unos pocos segundos.

## Actualizaciones futuras de Code.gs

Cuando modifiques `Code.gs`, guardá los cambios y creá una nueva versión desde **Administrar implementaciones**. Conservá la URL `/exec` configurada en el proyecto si Google mantiene la misma implementación.
