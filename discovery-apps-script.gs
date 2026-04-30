/**
 * The Ops Hack — Discovery Form Backend
 *
 * Recibe POST del form en ops-hack.vercel.app/discovery
 * Appendea fila al tab "Ops Hack — Leads" del Master Plan v2
 * Manda email notificación a Laura
 *
 * Sheet ID: 15Gk8U_OHCUqLIea3wweJ8Uzp5D08-QlARAUcMKLr-yA (Master Plan v2 sandbox)
 * Sheet URL: https://docs.google.com/spreadsheets/d/15Gk8U_OHCUqLIea3wweJ8Uzp5D08-QlARAUcMKLr-yA/edit
 * Tab: "Ops Hack — Leads"
 *
 * INSTRUCCIONES DE DEPLOY:
 * 1. Pegar este código en script.google.com → New Project
 * 2. Save (nombre: "Ops Hack Discovery Backend")
 * 3. Deploy → New deployment → Type: Web App
 * 4. Execute as: Me · Who has access: Anyone
 * 5. Copy the Web App URL
 * 6. Pegarla en discovery.html en const ENDPOINT
 * 7. Push del HTML a GitHub → Vercel auto-deploy
 */

const SHEET_ID = '15Gk8U_OHCUqLIea3wweJ8Uzp5D08-QlARAUcMKLr-yA';
const SHEET_TAB = 'Ops Hack — Leads';
const NOTIFICATION_EMAIL = 'lauracuatri123@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TAB);

    // Append row (20 columns)
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.nombre || '',
      data.email || '',
      data.whatsapp || '',
      data.rol || '',
      data.proyectos || '',
      data.tools || '',
      data.pago || '',
      data.frecuencia || '',
      data.ia || '',
      data.claude_modo || '',
      data.claude_proyectos || '',
      data.claude_skills || '',
      data.claude_memoria || '',
      data.claude_frustracion || '',
      data.frustracion || '',
      data.exito || '',
      data.no_quiere || '',
      data.source || '',
      data.status || 'NEW',
    ]);

    // Send notification email to Laura
    sendNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotification(data) {
  const subject = `🎯 Nueva piloto Ops Hack: ${data.nombre}`;

  const labelMap = {
    rol: {
      'founder-solo': 'Founder / dueña sola',
      'freelance': 'Freelance / consultora',
      'duo': 'Duo / co-founder',
      'lead-equipo': 'Lead de equipo (3+ personas)',
      'empleada-side': 'Empleada con side projects',
      'otro': 'Otro',
    },
    proyectos: {
      '1': '1 — todo enfocado',
      '2-3': '2-3 — manejable',
      '4-5': '4-5 — empieza a desbordarme',
      '6+': '6+ — sé que tengo demasiado',
    },
    pago: {
      '0': '$0 / mes',
      '1-30': '$1-30 / mes',
      '31-100': '$31-100 / mes',
      '100+': '$100+ / mes',
    },
    frecuencia: {
      'nunca': 'Nunca',
      'a-veces': 'A veces (mensual)',
      'seguido': 'Seguido (semanal)',
      'todo-el-tiempo': 'Todo el tiempo',
    },
    ia: {
      'no': 'No usa IA',
      'chatgpt': 'ChatGPT',
      'claude': 'Claude',
      'varias': 'Varias IA',
      'claude-code': 'Claude Code (CLI)',
    },
    frustracion: {
      'todo-disperso': 'Todo en lugares distintos',
      'ia-olvida': 'Mi IA olvida todo',
      'empiezo-no-termino': 'Arranco mil cosas, termino pocas',
      'nadie-me-fuerza': 'Nadie me fuerza a sostener un sistema',
      'prioridades': 'Prioridades poco claras',
      'otro': 'Otra (ver textarea)',
    },
    claude_modo: {
      'no-uso': 'No usa Claude',
      'web': 'Web (claude.ai)',
      'desktop': 'Claude Desktop',
      'cli': 'Claude Code (CLI)',
      'varios': 'Varios (combina)',
    },
    claude_proyectos: {
      'no': 'No, chat nuevo siempre',
      '1-2': '1-2 conversaciones recurrentes',
      '3+': '3+ proyectos organizados',
      'no-se': 'No sabe',
    },
    claude_skills: {
      'si': 'Sí, skills + memoria',
      'solo-system-prompt': 'Solo system prompt / project doc',
      'no': 'No, Claude vainilla',
      'no-se': 'No sabe qué es',
    },
    claude_memoria: {
      'si': 'Sí, recuerda todo',
      'a-veces': 'A veces sí, a veces no',
      'no': 'No, cada chat de cero',
      'no-se': 'No sabe',
    },
  };

  const body = `
${data.nombre} (${data.email} · ${data.whatsapp})

═══ CONTEXTO LABORAL ═══
→ Rol: ${labelMap.rol[data.rol] || data.rol}
→ Proyectos en paralelo: ${labelMap.proyectos[data.proyectos] || data.proyectos}
→ Tools actuales: ${data.tools || '(ninguna)'}
→ Pago en tools: ${labelMap.pago[data.pago] || data.pago}
→ Frecuencia se le escapa algo: ${labelMap.frecuencia[data.frecuencia] || data.frecuencia}

═══ STACK CLAUDE ACTUAL ═══
→ Usa IA: ${labelMap.ia[data.ia] || data.ia}
→ Cómo usa Claude: ${labelMap.claude_modo[data.claude_modo] || data.claude_modo}
→ Proyectos en Claude: ${labelMap.claude_proyectos[data.claude_proyectos] || data.claude_proyectos}
→ Skills / memoria: ${labelMap.claude_skills[data.claude_skills] || data.claude_skills}
→ Memoria entre sesiones: ${labelMap.claude_memoria[data.claude_memoria] || data.claude_memoria}
→ Frustración con Claude: "${data.claude_frustracion || '(no especificó)'}"

═══ FRUSTRACIÓN + OBJETIVOS ═══
→ Frustración org. principal: ${labelMap.frustracion[data.frustracion] || data.frustracion}

Éxito al final del primer mes:
"${data.exito}"

NO quiere del sistema:
"${data.no_quiere || '(no especificó)'}"

—
Source: ${data.source}
Schedulea call dentro de 24hs.
Ver completa en Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit
`;

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: subject,
    body: body,
  });
}

// Test function (run manually from Apps Script editor to verify)
function testSubmit() {
  const fakeData = {
    timestamp: new Date().toISOString(),
    nombre: 'Test User',
    email: 'test@test.com',
    whatsapp: '+54 11 5555 5555',
    rol: 'founder-solo',
    proyectos: '4-5',
    tools: 'notion, apple-notes',
    pago: '31-100',
    frecuencia: 'seguido',
    ia: 'claude',
    claude_modo: 'web',
    claude_proyectos: '1-2',
    claude_skills: 'no',
    claude_memoria: 'no',
    claude_frustracion: 'Que olvida todo entre sesiones',
    frustracion: 'todo-disperso',
    exito: 'Tener todo en un solo lugar y que mi Claude se acuerde',
    no_quiere: 'Compartir con nadie',
    source: 'test',
    status: 'TEST',
  };

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TAB);
  sheet.appendRow([
    fakeData.timestamp, fakeData.nombre, fakeData.email, fakeData.whatsapp,
    fakeData.rol, fakeData.proyectos, fakeData.tools, fakeData.pago,
    fakeData.frecuencia, fakeData.ia,
    fakeData.claude_modo, fakeData.claude_proyectos, fakeData.claude_skills,
    fakeData.claude_memoria, fakeData.claude_frustracion,
    fakeData.frustracion, fakeData.exito, fakeData.no_quiere,
    fakeData.source, fakeData.status,
  ]);

  sendNotification(fakeData);
  Logger.log('✅ Test row appended + notification sent');
}
