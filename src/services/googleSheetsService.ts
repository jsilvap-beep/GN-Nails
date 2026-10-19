import { Appointment, StudioSettings, PromoDesign } from '../types';

export interface SpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  lastSyncedAt?: string;
}

const SPREADSHEET_ID_STORAGE_KEY = 'gabee_google_spreadsheet_id_v1';

export const getStoredSpreadsheetId = (): string | null => {
  return localStorage.getItem(SPREADSHEET_ID_STORAGE_KEY);
};

export const storeSpreadsheetId = (id: string) => {
  localStorage.setItem(SPREADSHEET_ID_STORAGE_KEY, id);
};

// Create a new Google Spreadsheet with the 3 required worksheets
export const createGabeeSpreadsheet = async (
  accessToken: string,
  appointments: Appointment[],
  settings: StudioSettings,
  promos: PromoDesign[]
): Promise<SpreadsheetInfo> => {
  const requestBody = {
    properties: {
      title: 'Gabee Nail Art - Gestión & Catálogo 2026',
    },
    sheets: [
      {
        properties: {
          title: 'Citas_Agenda',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: 'Configuracion_Admin',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: 'Catalogo_Fotos',
          gridProperties: { frozenRowCount: 1 },
        },
      },
    ],
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Error al crear la hoja de cálculo en Google Sheets');
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl;

  storeSpreadsheetId(spreadsheetId);

  // Populate all sheets with headers and initial data
  await syncAllDataToSpreadsheet(accessToken, spreadsheetId, appointments, settings, promos);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title: data.properties.title,
    lastSyncedAt: new Date().toISOString(),
  };
};

// Append a single new appointment row to Citas_Agenda
export const appendAppointmentToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  apt: Appointment
) => {
  const row = [
    apt.id,
    apt.code,
    new Date(apt.createdAt).toLocaleString('es-PE'),
    apt.clientName,
    apt.clientPhone,
    apt.clientInstagram || '-',
    apt.serviceType === 'promotion' ? 'Promoción Catálogo' : 'Servicio Personalizado',
    apt.serviceType === 'promotion'
      ? apt.promoDesignTitle || 'Promo 2026'
      : `Personalizado (${apt.customDetails?.shape} / Nivel ${apt.customDetails?.level})`,
    apt.date,
    apt.timeSlot,
    apt.locationType === 'studio' ? 'En Estudio (Surco)' : 'A Domicilio',
    apt.homeAddress || '-',
    apt.status === 'confirmed'
      ? 'Confirmada (Adelanto OK)'
      : apt.status === 'pending_deposit'
      ? 'Esperando Adelanto'
      : apt.status === 'completed'
      ? 'Atendido'
      : 'Cancelado',
    apt.totalPrice,
    apt.depositRequired,
    apt.depositPaid ? 'SÍ' : 'NO',
    apt.paymentMethod.toUpperCase(),
    apt.notes || '-',
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Citas_Agenda!A:R:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    }
  );

  if (!res.ok) {
    console.warn('Could not append row to Google Sheets:', await res.text());
  }
};

// Sync all appointments to Citas_Agenda
export const syncAppointmentsSheet = async (
  accessToken: string,
  spreadsheetId: string,
  appointments: Appointment[]
) => {
  const headers = [
    'ID Cita',
    'Código Reserva',
    'Fecha Registro',
    'Cliente',
    'WhatsApp',
    'Instagram',
    'Tipo Servicio',
    'Diseño / Set',
    'Fecha Cita',
    'Hora',
    'Modalidad',
    'Dirección Domicilio',
    'Estado',
    'Total (S/.)',
    'Adelanto Requerido (S/.)',
    'Adelanto Pagado',
    'Método Pago',
    'Notas Especiales',
  ];

  const rows = appointments.map((apt) => [
    apt.id,
    apt.code,
    new Date(apt.createdAt).toLocaleString('es-PE'),
    apt.clientName,
    apt.clientPhone,
    apt.clientInstagram || '-',
    apt.serviceType === 'promotion' ? 'Promoción Catálogo' : 'Servicio Personalizado',
    apt.serviceType === 'promotion'
      ? apt.promoDesignTitle || 'Promo 2026'
      : `Personalizado (${apt.customDetails?.shape} / Nivel ${apt.customDetails?.level})`,
    apt.date,
    apt.timeSlot,
    apt.locationType === 'studio' ? 'En Estudio (Surco)' : 'A Domicilio',
    apt.homeAddress || '-',
    apt.status === 'confirmed'
      ? 'Confirmada (Adelanto OK)'
      : apt.status === 'pending_deposit'
      ? 'Esperando Adelanto'
      : apt.status === 'completed'
      ? 'Atendido'
      : 'Cancelado',
    apt.totalPrice,
    apt.depositRequired,
    apt.depositPaid ? 'SÍ' : 'NO',
    apt.paymentMethod.toUpperCase(),
    apt.notes || '-',
  ]);

  const allValues = [headers, ...rows];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Citas_Agenda!A1:R${allValues.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: allValues,
      }),
    }
  );
};

// Sync admin configuration to Configuracion_Admin
export const syncSettingsSheet = async (
  accessToken: string,
  spreadsheetId: string,
  settings: StudioSettings
) => {
  const headers = ['Parámetro de Configuración', 'Valor Actual', 'Descripción'];

  const rows = [
    ['Nombre del Estudio', settings.studioName, 'Nombre comercial del salón'],
    ['Slogan Oficial', settings.slogan, 'Eslogan principal del catálogo'],
    ['Instagram', settings.instagram, 'Cuenta de redes sociales oficial'],
    ['WhatsApp de Recepción', settings.whatsappNumber, 'Número para recibir las reservas'],
    ['Número Yape', settings.yapeNumber, 'Teléfono asociado para cobrar adelantos por Yape'],
    ['Titular Yape', settings.yapeName, 'Nombre registrado en la cuenta Yape'],
    ['Número Plin', settings.plinNumber, 'Teléfono asociado para cobrar adelantos por Plin'],
    ['Titular Plin', settings.plinName, 'Nombre registrado en la cuenta Plin'],
    ['Precio Promociones (S/.)', String(settings.defaultPromoPrice), 'Tarifa plana de diseños de promoción'],
    ['Monto Adelanto (S/.)', String(settings.defaultDepositAmount), 'Adelanto formal obligatorio para separar cita'],
    ['Precio Nivel Básico (S/.)', String(settings.levelBasicPrice), 'Tarifa servicio personalizado sencillo'],
    ['Precio Nivel Moderado (S/.)', String(settings.levelModeratePrice), 'Tarifa servicio personalizado moderado'],
    ['Precio Nivel Complejo (S/.)', String(settings.levelComplexPrice), 'Tarifa servicio personalizado complejo 3D'],
    ['Recargo Stiletto (S/.)', String(settings.stilettoExtraCost), 'Costo adicional por esculpido en punta stiletto'],
    ['Recargo Uñas Largas (S/.)', String(settings.longNailExtraCost), 'Costo adicional para largos superiores a #3'],
    ['Recargo Domicilio (S/.)', String(settings.homeServiceExtraCost), 'Tarifa base de movilidad para atención a domicilio'],
    ['Dirección Estudio', settings.studioAddress, 'Ubicación física en Lima (Surco)'],
    ['Zona Horaria', settings.timezone, 'Zona horaria oficial de atención'],
  ];

  const allValues = [headers, ...rows];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Configuracion_Admin!A1:C${allValues.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: allValues,
      }),
    }
  );
};

// Sync promo designs and photos to Catalogo_Fotos
export const syncCatalogPhotosSheet = async (
  accessToken: string,
  spreadsheetId: string,
  promos: PromoDesign[]
) => {
  const headers = [
    'ID Diseño',
    'Título del Diseño',
    'Colección',
    'Nivel',
    'Precio Promo (S/.)',
    'URL Imagen / Foto del Catálogo',
    'Descripción Estética',
    'Técnica Paso a Paso',
    'Duración (min)',
    'Sistema Recomendado',
    'Etiquetas',
    'Destacado en Carrusel',
    'Estado Activo',
  ];

  const rows = promos.map((p) => [
    p.id,
    p.title,
    p.collection,
    p.level,
    p.price,
    p.image,
    p.description,
    p.technique,
    p.durationMinutes,
    p.recommendedSystem,
    p.tags.join(', '),
    p.featured ? 'SÍ' : 'NO',
    p.active ? 'ACTIVO' : 'OCULTO',
  ]);

  const allValues = [headers, ...rows];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Catalogo_Fotos!A1:M${allValues.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: allValues,
      }),
    }
  );
};

// Sync everything in one go
export const syncAllDataToSpreadsheet = async (
  accessToken: string,
  spreadsheetId: string,
  appointments: Appointment[],
  settings: StudioSettings,
  promos: PromoDesign[]
) => {
  await Promise.all([
    syncAppointmentsSheet(accessToken, spreadsheetId, appointments),
    syncSettingsSheet(accessToken, spreadsheetId, settings),
    syncCatalogPhotosSheet(accessToken, spreadsheetId, promos),
  ]);
};
