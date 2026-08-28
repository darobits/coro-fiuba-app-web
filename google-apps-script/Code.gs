/**
 * Integra las inscripciones del Coro FIUBA con Google Sheets y envía
 * las notificaciones correspondientes por correo electrónico.
 */
var CONFIG = {
  SPREADSHEET_ID: '1-Z5buQGnlY-EkTODQctI4swrDqbPDz4vBMZetHQ86_Y',
  SHEET_NAME: 'Inscripciones Coro FIUBA',
  EMAIL_QUEUE_SHEET_NAME: '_Cola Emails',
  TIME_ZONE: 'America/Argentina/Buenos_Aires',
  DUPLICATE_WINDOW_SECONDS: 25,

  CORO_EMAIL: 'fiubacoro@gmail.com',
  CORO_NAME: 'Coro FIUBA',
  LOGO_FILE_ID: '14aLAMOoOgds0ozRVtxuN5dgjISsAUdKt',

  EMAIL_BATCH_SIZE: 10,
  EMAIL_MAX_ATTEMPTS: 4,
  EMAIL_STALE_MINUTES: 10
};

var HEADERS = [
  'ID',
  'Fecha',
  'Hora',
  'Nombre y apellido',
  'Correo electrónico',
  'Celular',
  'Edad',
  'Vínculo con FIUBA',
  'Carrera',
  'Registro de voz',
  'Experiencia previa',
  'Sobre vos',
  'Consentimiento',
  'Estado',
  'Observaciones internas'
];

var LEGACY_HEADERS = [
  'ID',
  'Fecha',
  'Hora',
  'Nombre y apellido',
  'Correo electrónico',
  'Celular',
  'Edad',
  'Registro de voz',
  'Experiencia previa',
  'Sobre vos',
  'Consentimiento',
  'Estado',
  'Observaciones internas'
];

var QUEUE_HEADERS = [
  'Job ID',
  'Creado',
  'Tipo',
  'Payload',
  'Estado',
  'Intentos',
  'Último error',
  'Actualizado',
  'Enviado'
];

var STATUS_OPTIONS = [
  'Nuevo',
  'Contactado',
  'Pendiente de audición',
  'Audición realizada',
  'Admitido',
  'No continúa'
];

var VOICE_OPTIONS = ['Soprano', 'Contralto', 'Tenor', 'Bajo', 'No estoy seguro/a'];
var EXPERIENCE_OPTIONS = ['Sin experiencia', 'Algo de experiencia', 'Experiencia coral'];
var AFFILIATION_OPTIONS = ['Estudiante de FIUBA', 'Graduado/a de FIUBA', 'Persona externa a FIUBA'];
var CAREER_OPTIONS = [
  'Bioingeniería',
  'Ingeniería Civil',
  'Ingeniería en Alimentos',
  'Ingeniería en Energía Eléctrica',
  'Ingeniería Electrónica',
  'Ingeniería en Agrimensura',
  'Ingeniería en Informática',
  'Ingeniería en Petróleo',
  'Ingeniería Industrial',
  'Ingeniería Mecánica',
  'Ingeniería Naval',
  'Ingeniería Química',
  'Lic. en Análisis de Sistemas'
];

function doGet() {
  try {
    var spreadsheet = getSpreadsheet_();
    var sheet = getOrCreateSheet_(spreadsheet);
    configureSheet_(sheet);
    getOrCreateQueueSheet_(spreadsheet);

    return jsonResponse_({
      success: true,
      message: 'Integración Coro FIUBA configurada correctamente',
      sheetName: sheet.getName()
    });
  } catch (error) {
    console.error('No se pudo verificar la integración: ' + getErrorMessage_(error));
    return jsonResponse_({
      success: false,
      code: getErrorCode_(error),
      message: getPublicErrorMessage_(error)
    });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Solicitud vacía');
    }

    var raw = JSON.parse(e.postData.contents);
    var data = validateAndSanitize_(raw);
    var spreadsheet = getSpreadsheet_();
    var sheet = getOrCreateSheet_(spreadsheet);

    assertSheetStructure_(sheet);

    var cache = CacheService.getScriptCache();
    var duplicateKey = buildDuplicateKey_(data);
    var existingId = cache.get(duplicateKey);

    if (existingId) {
      return jsonResponse_({
        success: true,
        id: existingId,
        message: 'Inscripción registrada correctamente'
      });
    }

    var id = getNextId_(sheet);
    var now = new Date();

    var row = [
      id,
      now,
      now,
      data.nombre,
      data.email,
      data.celular,
      data.edad,
      data.vinculoFiuba,
      data.carrera,
      data.registroVoz,
      data.experiencia,
      data.sobreVos,
      'Sí',
      'Nuevo',
      ''
    ];

    sheet.appendRow(row);

    try {
      formatNewRow_(sheet, sheet.getLastRow());
    } catch (formatError) {
      console.warn('La fila se guardó, pero no pudo formatearse: ' + getErrorMessage_(formatError));
    }

    var payload = {
      id: id,
      fecha: Utilities.formatDate(now, CONFIG.TIME_ZONE, 'dd/MM/yyyy HH:mm'),
      nombre: data.nombre,
      email: data.email,
      celular: data.celular,
      edad: data.edad,
      vinculoFiuba: data.vinculoFiuba,
      carrera: data.carrera,
      registroVoz: data.registroVoz,
      experiencia: data.experiencia,
      sobreVos: data.sobreVos
    };

    enqueueEmails_(spreadsheet, payload);
    cache.put(duplicateKey, id, CONFIG.DUPLICATE_WINDOW_SECONDS);

    // El procesador de la cola usa el mismo bloqueo. Lo liberamos para intentar
    // el envío inmediatamente y conservamos el trigger periódico como respaldo.
    if (lock.hasLock()) lock.releaseLock();

    try {
      processEmailQueue_();
    } catch (emailError) {
      console.error(
        'La inscripción se guardó, pero el envío inmediato quedó en cola: ' +
        getErrorMessage_(emailError)
      );
    }

    return jsonResponse_({
      success: true,
      id: id,
      emailQueued: true,
      message: 'Inscripción registrada correctamente'
    });

  } catch (error) {
    console.error('No se pudo registrar la inscripción: ' + getErrorMessage_(error));
    return jsonResponse_({
      success: false,
      code: getErrorCode_(error),
      message: getPublicErrorMessage_(error)
    });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function setupCoroFIUBA() {
  var spreadsheet = getSpreadsheet_();
  var sheet = getOrCreateSheet_(spreadsheet);

  configureSheet_(sheet);
  getOrCreateQueueSheet_(spreadsheet);
  ensureEmailTrigger_();

  // Fuerza la autorización de Drive y MailApp durante la configuración.
  DriveApp.getFileById(CONFIG.LOGO_FILE_ID).getName();
  MailApp.getRemainingDailyQuota();

  Logger.log('Coro FIUBA configurado. Cola de correos activa.');
}

function processEmailQueue_() {
  var spreadsheet = getSpreadsheet_();
  var queue = getOrCreateQueueSheet_(spreadsheet);
  var lastRow = queue.getLastRow();

  if (lastRow < 2) return;

  var claimLock = LockService.getScriptLock();
  var jobs = [];

  try {
    if (!claimLock.tryLock(3000)) return;

    var values = queue.getRange(2, 1, lastRow - 1, QUEUE_HEADERS.length).getValues();
    var now = new Date();
    var staleLimit = new Date(now.getTime() - CONFIG.EMAIL_STALE_MINUTES * 60 * 1000);

    for (var i = 0; i < values.length && jobs.length < CONFIG.EMAIL_BATCH_SIZE; i++) {
      var row = values[i];
      var status = String(row[4] || '');
      var attempts = Number(row[5] || 0);
      var updated = row[7] instanceof Date ? row[7] : null;

      var canRetry = (status === 'Pendiente' || status === 'Error') && attempts < CONFIG.EMAIL_MAX_ATTEMPTS;
      var staleProcessing = status === 'Procesando' && (!updated || updated < staleLimit) && attempts < CONFIG.EMAIL_MAX_ATTEMPTS;

      if (!canRetry && !staleProcessing) continue;

      var sheetRow = i + 2;
      var nextAttempts = attempts + 1;

      queue.getRange(sheetRow, 5, 1, 4).setValues([[
        'Procesando',
        nextAttempts,
        '',
        now
      ]]);

      jobs.push({
        rowNumber: sheetRow,
        jobId: String(row[0]),
        type: String(row[2]),
        payloadText: String(row[3]),
        attempts: nextAttempts
      });
    }

    SpreadsheetApp.flush();
  } finally {
    if (claimLock.hasLock()) claimLock.releaseLock();
  }

  if (jobs.length === 0) return;

  var logoBlob = DriveApp.getFileById(CONFIG.LOGO_FILE_ID).getBlob().setName('logo-coro-fiuba.png');

  jobs.forEach(function(job) {
    try {
      var payload = JSON.parse(job.payloadText);

      if (job.type === 'INTERNO') {
        sendInternalEmail_(payload, logoBlob);
      } else if (job.type === 'CONFIRMACION') {
        sendConfirmationEmail_(payload, logoBlob);
      } else {
        throw new Error('Tipo de correo desconocido: ' + job.type);
      }

      queue.getRange(job.rowNumber, 5, 1, 5).setValues([[
        'Enviado',
        job.attempts,
        '',
        new Date(),
        new Date()
      ]]);

    } catch (error) {
      queue.getRange(job.rowNumber, 5, 1, 4).setValues([[
        'Error',
        job.attempts,
        getErrorMessage_(error).slice(0, 500),
        new Date()
      ]]);

      console.error('Error enviando ' + job.jobId + ': ' + getErrorMessage_(error));
    }
  });
}

function enqueueEmails_(spreadsheet, payload) {
  var queue = getOrCreateQueueSheet_(spreadsheet);
  var now = new Date();
  var json = JSON.stringify(payload);

  queue.getRange(queue.getLastRow() + 1, 1, 2, QUEUE_HEADERS.length).setValues([
    [
      payload.id + '-interno',
      now,
      'INTERNO',
      json,
      'Pendiente',
      0,
      '',
      now,
      ''
    ],
    [
      payload.id + '-confirmacion',
      now,
      'CONFIRMACION',
      json,
      'Pendiente',
      0,
      '',
      now,
      ''
    ]
  ]);
}

function sendInternalEmail_(data, logoBlob) {
  MailApp.sendEmail({
    to: CONFIG.CORO_EMAIL,
    replyTo: data.email,
    name: CONFIG.CORO_NAME,
    subject: 'Nueva inscripción · ' + data.id + ' · ' + data.nombre,
    body: buildInternalPlainText_(data),
    htmlBody: buildInternalEmailHtml_(data),
    inlineImages: {
      logoCoro: logoBlob.copyBlob()
    }
  });
}

function sendConfirmationEmail_(data, logoBlob) {
  MailApp.sendEmail({
    to: data.email,
    replyTo: CONFIG.CORO_EMAIL,
    name: CONFIG.CORO_NAME,
    subject: 'Recibimos tu solicitud · Coro FIUBA',
    body: buildConfirmationPlainText_(data),
    htmlBody: buildConfirmationEmailHtml_(data),
    inlineImages: {
      logoCoro: logoBlob.copyBlob()
    }
  });
}

function buildInternalPlainText_(data) {
  return [
    'Nueva inscripción al Coro FIUBA',
    '',
    'Identificador: ' + data.id,
    'Nombre y apellido: ' + data.nombre,
    'Correo: ' + data.email,
    'Celular: ' + data.celular,
    'Edad: ' + data.edad,
    'Vínculo con FIUBA: ' + data.vinculoFiuba,
    'Carrera: ' + (data.carrera || '-'),
    'Registro de voz: ' + data.registroVoz,
    'Experiencia previa: ' + data.experiencia,
    '',
    'Sobre vos:',
    data.sobreVos || '-',
    '',
    'Fecha de recepción: ' + data.fecha
  ].join('\n');
}

function buildConfirmationPlainText_(data) {
  return [
    'Hola ' + data.nombre + ',',
    '',
    'Gracias por tu interés en participar del Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires.',
    '',
    'Recibimos correctamente tu solicitud con el identificador ' + data.id + '.',
    'Vamos a revisar la información y nos pondremos en contacto con vos para contarte cómo continuar.',
    '',
    'Ensayos: viernes de 19:30 a 22:00 h.',
    'Sede Paseo Colón · Facultad de Ingeniería UBA.',
    '',
    'Esperamos conocerte pronto.',
    '',
    'Coro FIUBA',
    'Facultad de Ingeniería · Universidad de Buenos Aires'
  ].join('\n');
}

function buildInternalEmailHtml_(data) {
  var nombre = escapeHtml_(data.nombre);
  var email = escapeHtml_(data.email);
  var celular = escapeHtml_(data.celular);
  var edad = escapeHtml_(String(data.edad));
  var vinculoFiuba = escapeHtml_(data.vinculoFiuba);
  var carrera = escapeHtml_(data.carrera || '-');
  var registro = escapeHtml_(data.registroVoz);
  var experiencia = escapeHtml_(data.experiencia);
  var sobreVos = nl2br_(data.sobreVos || '-');
  var id = escapeHtml_(data.id);
  var fecha = escapeHtml_(data.fecha);

  return '<!doctype html>' +
    '<html lang="es"><body style="margin:0;padding:0;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#334155;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f6f8;padding:28px 12px;">' +
      '<tr><td align="center">' +
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 8px 28px rgba(25,52,103,.12);">' +
          '<tr><td style="background:#193467;border-bottom:3px solid #079ddd;padding:24px 32px;">' +
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>' +
              '<td width="72" valign="middle"><img src="cid:logoCoro" width="62" height="62" alt="Coro FIUBA" style="display:block;width:62px;height:62px;object-fit:contain;"></td>' +
              '<td valign="middle" style="padding-left:14px;">' +
                '<div style="font-family:Georgia,Times New Roman,serif;font-size:27px;line-height:32px;color:#ffffff;">Coro FIUBA</div>' +
                '<div style="margin-top:4px;color:#c8d5e8;font-size:10px;line-height:16px;letter-spacing:1px;text-transform:uppercase;">Facultad de Ingeniería · Universidad de Buenos Aires</div>' +
              '</td>' +
            '</tr></table>' +
          '</td></tr>' +

          '<tr><td style="padding:34px 36px 32px;">' +
            '<div style="color:#079ddd;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">Nueva solicitud de participación</div>' +
            '<div style="font-family:Georgia,Times New Roman,serif;font-size:30px;line-height:38px;color:#193467;">Nueva inscripción al Coro</div>' +
            '<div style="margin-top:10px;color:#64748b;font-size:14px;line-height:22px;">Se recibió una nueva solicitud desde el formulario del sitio web.</div>' +

            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;background:#f4f8fc;border-left:4px solid #079ddd;">' +
              '<tr><td style="padding:15px 18px;">' +
                '<div style="font-size:10px;color:#64748b;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;">Identificador</div>' +
                '<div style="margin-top:5px;font-size:20px;color:#193467;font-weight:bold;">' + id + '</div>' +
              '</td></tr>' +
            '</table>' +

            '<div style="margin-top:28px;padding-bottom:9px;border-bottom:2px solid #edf1f5;color:#193467;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Datos de la persona</div>' +
            buildDataRow_('Nombre y apellido', nombre, true) +
            buildDataRow_('Correo electrónico', '<a href="mailto:' + email + '" style="color:#078dc7;text-decoration:none;">' + email + '</a>', false) +
            buildDataRow_('Celular', celular, false) +
            buildDataRow_('Edad', edad, false) +
            buildDataRow_('Vínculo con FIUBA', vinculoFiuba, false) +
            buildDataRow_('Carrera', carrera, false) +
            buildDataRow_('Registro de voz', registro, false) +
            buildDataRow_('Experiencia previa', experiencia, false) +

            '<div style="margin-top:28px;padding-bottom:9px;border-bottom:2px solid #edf1f5;color:#193467;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Sobre la persona</div>' +
            '<div style="margin-top:14px;padding:17px 19px;background:#fafbfc;border:1px solid #e7ecf2;border-radius:6px;color:#475569;font-size:14px;line-height:22px;">' + sobreVos + '</div>' +

            '<div style="margin-top:24px;padding-top:16px;border-top:1px solid #edf1f5;color:#8592a3;font-size:12px;line-height:18px;">Fecha de recepción: <strong style="color:#526173;">' + fecha + '</strong></div>' +
          '</td></tr>' +

          '<tr><td style="background:#193467;padding:19px 28px;text-align:center;">' +
            '<div style="width:34px;height:2px;background:#d5a900;margin:0 auto 10px;"></div>' +
            '<div style="font-family:Georgia,Times New Roman,serif;color:#ffffff;font-size:15px;">Coro FIUBA</div>' +
            '<div style="margin-top:5px;color:#aebdd2;font-size:9px;letter-spacing:.8px;text-transform:uppercase;">Facultad de Ingeniería · Universidad de Buenos Aires</div>' +
          '</td></tr>' +
        '</table>' +
      '</td></tr>' +
    '</table>' +
    '</body></html>';
}

function buildConfirmationEmailHtml_(data) {
  var nombre = escapeHtml_(data.nombre);
  var id = escapeHtml_(data.id);

  return '<!doctype html>' +
    '<html lang="es"><body style="margin:0;padding:0;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#334155;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f6f8;padding:28px 12px;">' +
      '<tr><td align="center">' +
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 8px 28px rgba(25,52,103,.12);">' +

          '<tr><td style="background:#193467;border-bottom:3px solid #079ddd;padding:28px 34px;text-align:center;">' +
            '<img src="cid:logoCoro" width="82" height="82" alt="Coro FIUBA" style="display:block;width:82px;height:82px;margin:0 auto 12px;object-fit:contain;">' +
            '<div style="font-family:Georgia,Times New Roman,serif;font-size:29px;color:#ffffff;">Coro FIUBA</div>' +
            '<div style="margin-top:6px;color:#c8d5e8;font-size:10px;line-height:16px;letter-spacing:1px;text-transform:uppercase;">Facultad de Ingeniería · Universidad de Buenos Aires</div>' +
          '</td></tr>' +

          '<tr><td style="padding:38px 40px 34px;">' +
            '<div style="text-align:center;color:#079ddd;font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;">Solicitud recibida</div>' +
            '<div style="margin-top:10px;text-align:center;font-family:Georgia,Times New Roman,serif;font-size:31px;line-height:39px;color:#193467;">¡Gracias por querer sumarte al Coro!</div>' +

            '<div style="margin-top:28px;color:#334155;font-size:15px;line-height:24px;">Hola <strong style="color:#193467;">' + nombre + '</strong>,</div>' +
            '<div style="margin-top:15px;color:#526173;font-size:15px;line-height:24px;">Gracias por tu interés en participar del <strong style="color:#193467;">Coro de la Facultad de Ingeniería de la Universidad de Buenos Aires</strong>.</div>' +
            '<div style="margin-top:15px;color:#526173;font-size:15px;line-height:24px;">Recibimos correctamente tu solicitud. Vamos a revisar la información que nos enviaste y nos pondremos en contacto con vos para contarte cómo continuar.</div>' +

            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:25px;background:#f4f8fc;border-left:4px solid #079ddd;">' +
              '<tr><td align="center" style="padding:17px 18px;">' +
                '<div style="font-size:10px;color:#64748b;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;">Tu identificación de solicitud</div>' +
                '<div style="margin-top:6px;font-size:20px;color:#193467;font-weight:bold;">' + id + '</div>' +
              '</td></tr>' +
            '</table>' +

            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:26px;border:1px solid #e3eaf1;border-radius:6px;">' +
              '<tr><td style="padding:20px 22px;">' +
                '<div style="color:#079ddd;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">Ensayos</div>' +
                '<div style="margin-top:7px;font-family:Georgia,Times New Roman,serif;font-size:20px;line-height:27px;color:#193467;">Viernes · 19:30 a 22:00</div>' +
                '<div style="margin-top:5px;color:#68778a;font-size:13px;line-height:20px;">Sede Paseo Colón<br>Facultad de Ingeniería · UBA</div>' +
              '</td></tr>' +
            '</table>' +

            '<div style="margin-top:27px;color:#526173;font-size:15px;line-height:24px;">Esperamos conocerte pronto.</div>' +
            '<div style="margin-top:17px;color:#193467;font-size:15px;line-height:22px;"><strong>Coro FIUBA</strong><br><span style="color:#718096;">Facultad de Ingeniería<br>Universidad de Buenos Aires</span></div>' +
          '</td></tr>' +

          '<tr><td style="background:#193467;padding:21px 26px;text-align:center;">' +
            '<div style="width:36px;height:2px;background:#d5a900;margin:0 auto 11px;"></div>' +
            '<div style="font-family:Georgia,Times New Roman,serif;color:#ffffff;font-size:15px;">Ingeniería en armonía.</div>' +
            '<div style="margin-top:6px;color:#9fb1c9;font-size:9px;line-height:15px;letter-spacing:.7px;text-transform:uppercase;">Coro de la Facultad de Ingeniería · UBA</div>' +
            '<div style="margin-top:11px;color:#8195b1;font-size:9px;line-height:14px;">Este mensaje fue enviado automáticamente porque completaste el formulario de participación del Coro FIUBA.</div>' +
          '</td></tr>' +

        '</table>' +
      '</td></tr>' +
    '</table>' +
    '</body></html>';
}

function buildDataRow_(label, valueHtml, bold) {
  return '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">' +
    '<tr>' +
      '<td width="38%" style="padding:12px 8px 12px 0;border-bottom:1px solid #edf1f5;color:#7b8797;font-size:13px;">' + escapeHtml_(label) + '</td>' +
      '<td style="padding:12px 0;border-bottom:1px solid #edf1f5;color:#193467;font-size:14px;' + (bold ? 'font-weight:bold;' : '') + '">' + valueHtml + '</td>' +
    '</tr>' +
  '</table>';
}

function getSpreadsheet_() {
  if (!CONFIG.SPREADSHEET_ID || CONFIG.SPREADSHEET_ID.indexOf('REEMPLAZAR_') === 0) {
    throw new Error('Falta configurar SPREADSHEET_ID');
  }

  var spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  spreadsheet.setSpreadsheetTimeZone(CONFIG.TIME_ZONE);
  return spreadsheet;
}

function getOrCreateSheet_(spreadsheet) {
  return spreadsheet.getSheetByName(CONFIG.SHEET_NAME) || spreadsheet.insertSheet(CONFIG.SHEET_NAME);
}

function getOrCreateQueueSheet_(spreadsheet) {
  var sheet = spreadsheet.getSheetByName(CONFIG.EMAIL_QUEUE_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.EMAIL_QUEUE_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, QUEUE_HEADERS.length).setValues([QUEUE_HEADERS]);
    sheet.getRange(1, 1, 1, QUEUE_HEADERS.length)
      .setBackground('#193467')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else {
    var current = sheet.getRange(1, 1, 1, QUEUE_HEADERS.length).getDisplayValues()[0];
    var valid = QUEUE_HEADERS.every(function(header, index) {
      return current[index] === header;
    });
    if (!valid) throw new Error('La cola de emails no tiene la estructura esperada');
  }

  if (!sheet.isSheetHidden()) {
    sheet.hideSheet();
  }

  return sheet;
}

function assertSheetStructure_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return;
  }

  var legacyHeaders = sheet.getRange(1, 1, 1, LEGACY_HEADERS.length).getDisplayValues()[0];
  var usesLegacyStructure = LEGACY_HEADERS.every(function(header, index) {
    return legacyHeaders[index] === header;
  });

  if (usesLegacyStructure) {
    sheet.insertColumnsAfter(7, 2);
    sheet.getRange(1, 8, 1, 2).setValues([['Vínculo con FIUBA', 'Carrera']]);
  }

  var currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  var validHeaders = HEADERS.every(function(header, index) {
    return currentHeaders[index] === header;
  });

  if (!validHeaders) {
    throw new Error('La primera fila no coincide con la estructura esperada');
  }
}

function configureSheet_(sheet) {
  assertSheetStructure_(sheet);

  var maxRows = Math.max(sheet.getMaxRows(), 2);
  var bodyRows = Math.max(maxRows - 1, 1);
  var header = sheet.getRange(1, 1, 1, HEADERS.length);

  header
    .setBackground('#193467')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setTabColor('#D5A900');
  sheet.setRowHeight(1, 36);

  var widths = [110, 100, 80, 220, 220, 150, 70, 180, 230, 140, 170, 340, 120, 180, 300];
  widths.forEach(function(width, index) {
    sheet.setColumnWidth(index + 1, width);
  });

  sheet.getRange(2, 2, bodyRows, 1).setNumberFormat('dd/MM/yyyy').setHorizontalAlignment('center');
  sheet.getRange(2, 3, bodyRows, 1).setNumberFormat('HH:mm').setHorizontalAlignment('center');
  sheet.getRange(2, 7, bodyRows, 1).setHorizontalAlignment('center');
  sheet.getRange(2, 13, bodyRows, 2).setHorizontalAlignment('center');
  sheet.getRange(2, 4, bodyRows, 10).setVerticalAlignment('middle').setWrap(true);
  sheet.getRange(2, 15, bodyRows, 1).setVerticalAlignment('middle').setWrap(true);

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_OPTIONS, true)
    .setAllowInvalid(false)
    .setHelpText('Seleccioná un estado de la lista.')
    .build();

  sheet.getRange(2, 14, bodyRows, 1).setDataValidation(statusRule);

  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, maxRows, HEADERS.length).createFilter();
  }

  if (sheet.getBandings().length === 0) {
    var banding = sheet.getRange(1, 1, maxRows, HEADERS.length)
      .applyRowBanding(SpreadsheetApp.BandingTheme.BLUE, true, false);

    banding
      .setHeaderRowColor('#193467')
      .setFirstRowColor('#FFFFFF')
      .setSecondRowColor('#EEF3F8');
  }
}

function ensureEmailTrigger_() {
  var handler = 'processEmailQueue_';
  var exists = ScriptApp.getProjectTriggers().some(function(trigger) {
    return trigger.getHandlerFunction() === handler;
  });

  if (!exists) {
    ScriptApp.newTrigger(handler)
      .timeBased()
      .everyMinutes(1)
      .create();
  }
}

function getErrorMessage_(error) {
  return String(error && error.message ? error.message : error);
}

function getErrorCode_(error) {
  var message = getErrorMessage_(error);
  var normalized = message.toLowerCase();

  if (message.indexOf('SPREADSHEET_ID') !== -1) return 'SHEET_ID_NOT_CONFIGURED';
  if (message.indexOf('estructura esperada') !== -1) return 'INVALID_SHEET_STRUCTURE';

  if (
    normalized.indexOf('permission') !== -1 ||
    normalized.indexOf('permiso') !== -1 ||
    normalized.indexOf('autoriz') !== -1
  ) {
    return 'SHEET_PERMISSION_DENIED';
  }

  if (
    message.indexOf('inválid') !== -1 ||
    message.indexOf('consentimiento') !== -1 ||
    message.indexOf('Solicitud vacía') !== -1
  ) {
    return 'INVALID_REQUEST';
  }

  return 'SHEETS_ERROR';
}

function getPublicErrorMessage_(error) {
  var code = getErrorCode_(error);

  if (code === 'SHEET_ID_NOT_CONFIGURED') {
    return 'Falta configurar el ID de la planilla en Apps Script';
  }
  if (code === 'INVALID_SHEET_STRUCTURE') {
    return 'La hoja configurada no tiene la estructura esperada';
  }
  if (code === 'SHEET_PERMISSION_DENIED') {
    return 'Apps Script no tiene permisos para acceder a la planilla';
  }
  if (code === 'INVALID_REQUEST') {
    return 'Los datos enviados no son válidos';
  }

  return 'No se pudo registrar la inscripción';
}

function formatNewRow_(sheet, rowNumber) {
  sheet.setRowHeight(rowNumber, 52);
  sheet.getRange(rowNumber, 2).setNumberFormat('dd/MM/yyyy').setHorizontalAlignment('center');
  sheet.getRange(rowNumber, 3).setNumberFormat('HH:mm').setHorizontalAlignment('center');
  sheet.getRange(rowNumber, 7).setHorizontalAlignment('center');
  sheet.getRange(rowNumber, 13, 1, 2).setHorizontalAlignment('center');
  sheet.getRange(rowNumber, 4, 1, 10).setVerticalAlignment('middle').setWrap(true);
  sheet.getRange(rowNumber, 15).setVerticalAlignment('middle').setWrap(true);
}

function getNextId_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 'CF-0001';

  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
  var highest = ids.reduce(function(maximum, row) {
    var match = /^CF-(\d+)$/.exec(String(row[0]).trim());
    return match ? Math.max(maximum, Number(match[1])) : maximum;
  }, 0);

  return 'CF-' + String(highest + 1).padStart(4, '0');
}

function validateAndSanitize_(raw) {
  if (!raw || Object.prototype.toString.call(raw) !== '[object Object]') {
    throw new Error('Payload inválido');
  }

  var data = {
    nombre: sanitizeText_(raw.nombre, 120),
    email: sanitizeText_(raw.email, 150).toLowerCase(),
    celular: sanitizeText_(raw.celular, 50),
    edad: Number(raw.edad),
    vinculoFiuba: sanitizeText_(raw.vinculoFiuba, 40),
    carrera: sanitizeText_(raw.carrera, 100),
    registroVoz: sanitizeText_(raw.registroVoz, 40),
    experiencia: sanitizeText_(raw.experiencia, 60),
    sobreVos: sanitizeText_(raw.sobreVos, 1500),
    consentimiento: raw.consentimiento === true
  };

  if (data.nombre.length < 3) throw new Error('Nombre inválido');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) throw new Error('Email inválido');

  var normalizedPhone = data.celular.replace(/[\s()-]/g, '');
  if (!/^\+?\d{8,15}$/.test(normalizedPhone) || /^(\+?)(\d)\2{7,}$/.test(normalizedPhone)) {
    throw new Error('Celular inválido');
  }

  if (!Number.isInteger(data.edad) || data.edad < 16 || data.edad > 99) throw new Error('Edad inválida');
  if (AFFILIATION_OPTIONS.indexOf(data.vinculoFiuba) === -1) throw new Error('Vínculo con FIUBA inválido');
  if (data.vinculoFiuba === 'Estudiante de FIUBA' && CAREER_OPTIONS.indexOf(data.carrera) === -1) {
    throw new Error('Carrera inválida');
  }
  if (data.vinculoFiuba !== 'Estudiante de FIUBA') data.carrera = '';
  if (VOICE_OPTIONS.indexOf(data.registroVoz) === -1) throw new Error('Registro de voz inválido');
  if (EXPERIENCE_OPTIONS.indexOf(data.experiencia) === -1) throw new Error('Experiencia inválida');
  if (!data.consentimiento) throw new Error('Falta consentimiento');

  return data;
}

function sanitizeText_(value, maxLength) {
  if (typeof value !== 'string') return '';

  var cleaned = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);

  return cleaned === '[object Object]' ? '' : cleaned;
}

function buildDuplicateKey_(data) {
  var fingerprintSource = JSON.stringify([
    data.email,
    data.nombre,
    data.celular,
    data.edad,
    data.vinculoFiuba,
    data.carrera,
    data.registroVoz,
    data.experiencia,
    data.sobreVos
  ]);

  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    fingerprintSource,
    Utilities.Charset.UTF_8
  );

  return 'application-' + Utilities.base64EncodeWebSafe(digest).replace(/=+$/g, '');
}

function escapeHtml_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br_(value) {
  return escapeHtml_(value).replace(/\r?\n/g, '<br>');
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
