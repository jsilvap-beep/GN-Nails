import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PromoDesign,
  CustomServiceConfig,
  Appointment,
  StudioSettings,
  ServiceType,
} from '../types';
import {
  INITIAL_SETTINGS,
  PROMO_CATALOG_DESIGNS,
  INITIAL_SAMPLE_APPOINTMENTS,
} from '../data/catalogData';
import {
  googleSignIn,
  googleLogout,
  initAuth,
  getAccessToken,
} from '../services/googleAuth';
import {
  createGabeeSpreadsheet,
  appendAppointmentToSheet,
  syncAppointmentsSheet,
  syncSettingsSheet,
  syncCatalogPhotosSheet,
  syncAllDataToSpreadsheet,
  getStoredSpreadsheetId,
  storeSpreadsheetId,
} from '../services/googleSheetsService';

interface AppContextType {
  // Navigation & Modals
  currentView: 'home' | 'promotions' | 'custom' | 'admin';
  setCurrentView: (view: 'home' | 'promotions' | 'custom' | 'admin') => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  showTermsModal: boolean;
  setShowTermsModal: (show: boolean) => void;
  showGuideModal: boolean;
  setShowGuideModal: (show: boolean) => void;

  // Booking Flow
  isBookingOpen: boolean;
  openBooking: (serviceType: ServiceType, promoId?: string) => void;
  closeBooking: () => void;
  bookingServiceType: ServiceType;
  selectedPromoForBooking: PromoDesign | null;

  // Promo Catalog
  promoDesigns: PromoDesign[];
  selectedPromoForDetails: PromoDesign | null;
  setSelectedPromoForDetails: (promo: PromoDesign | null) => void;
  addPromoDesign: (design: Omit<PromoDesign, 'id'>) => void;
  updatePromoDesign: (id: string, updates: Partial<PromoDesign>) => void;
  deletePromoDesign: (id: string) => void;
  resetPromoCatalog: () => void;

  // Custom Service Builder
  customConfig: CustomServiceConfig;
  setCustomConfig: React.Dispatch<React.SetStateAction<CustomServiceConfig>>;
  resetCustomConfig: () => void;

  // Appointments Management
  appointments: Appointment[];
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'code' | 'createdAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status'], depositPaid?: boolean) => void;
  deleteAppointment: (id: string) => void;
  clearCancelledAppointments: () => void;

  // Studio Settings
  settings: StudioSettings;
  updateSettings: (newSettings: Partial<StudioSettings>) => void;
  resetSettings: () => void;

  // Helper
  generateWhatsAppLink: (appointment: Appointment) => string;

  // Google Sheets Integration
  googleUser: any | null;
  googleAccessToken: string | null;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  isSyncingSheets: boolean;
  connectGoogleSheets: () => Promise<void>;
  disconnectGoogleSheets: () => Promise<void>;
  syncAllToGoogleSheets: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'gabee_nail_studio_settings_v1';
const PROMOS_STORAGE_KEY = 'gabee_nail_studio_promos_v1';
const APPOINTMENTS_STORAGE_KEY = 'gabee_nail_studio_appointments_v1';
const SPREADSHEET_URL_STORAGE_KEY = 'gabee_google_spreadsheet_url_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'home' | 'promotions' | 'custom' | 'admin'>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Google Auth & Sheets State
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(() => getStoredSpreadsheetId());
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() =>
    localStorage.getItem(SPREADSHEET_URL_STORAGE_KEY)
  );
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);

  // Settings
  const [settings, setSettings] = useState<StudioSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Promo Designs
  const [promoDesigns, setPromoDesigns] = useState<PromoDesign[]>(() => {
    try {
      const saved = localStorage.getItem(PROMOS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : PROMO_CATALOG_DESIGNS;
    } catch {
      return PROMO_CATALOG_DESIGNS;
    }
  });

  // Selected promo for detail modal
  const [selectedPromoForDetails, setSelectedPromoForDetails] = useState<PromoDesign | null>(null);

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_APPOINTMENTS;
    } catch {
      return INITIAL_SAMPLE_APPOINTMENTS;
    }
  });

  // Booking Modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceType, setBookingServiceType] = useState<ServiceType>('promotion');
  const [selectedPromoForBooking, setSelectedPromoForBooking] = useState<PromoDesign | null>(null);

  // Custom Service Builder default state
  const [customConfig, setCustomConfig] = useState<CustomServiceConfig>({
    level: 'moderado',
    system: 'softgel',
    shape: 'almond',
    lengthId: 'length_m',
    addons: {
      rhinestones: false,
      previousRemoval: false,
      stilettoShape: false,
      homeService: false,
    },
    calculatedPrice: 65,
  });

  // Listen for Google Auth state changes
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(promoDesigns));
  }, [promoDesigns]);

  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  // Recalculate custom config price when level, addons or length changes
  useEffect(() => {
    let base = settings.levelModeratePrice;
    if (customConfig.level === 'sencillo') base = settings.levelBasicPrice;
    if (customConfig.level === 'complejo') base = settings.levelComplexPrice;

    let extra = 0;
    if (customConfig.shape === 'stiletto' || customConfig.addons.stilettoShape) {
      extra += settings.stilettoExtraCost;
    }
    if (customConfig.lengthId === 'length_l') extra += 10;
    if (customConfig.lengthId === 'length_xl') extra += settings.longNailExtraCost;
    if (customConfig.lengthId === 'length_xxl') extra += 20;

    if (customConfig.addons.rhinestones) extra += settings.rhinestoneExtraCost;
    if (customConfig.addons.previousRemoval) extra += settings.removalExtraCost;
    if (customConfig.addons.homeService) extra += settings.homeServiceExtraCost;
    if (customConfig.system === 'acrylics') extra += 15;

    setCustomConfig((prev) => ({
      ...prev,
      calculatedPrice: base + extra,
    }));
  }, [
    customConfig.level,
    customConfig.shape,
    customConfig.lengthId,
    customConfig.system,
    customConfig.addons.rhinestones,
    customConfig.addons.previousRemoval,
    customConfig.addons.stilettoShape,
    customConfig.addons.homeService,
    settings,
  ]);

  const resetCustomConfig = () => {
    setCustomConfig({
      level: 'moderado',
      system: 'softgel',
      shape: 'almond',
      lengthId: 'length_m',
      addons: {
        rhinestones: false,
        previousRemoval: false,
        stilettoShape: false,
        homeService: false,
      },
      calculatedPrice: settings.levelModeratePrice,
    });
  };

  const openBooking = (serviceType: ServiceType, promoId?: string) => {
    setBookingServiceType(serviceType);
    if (promoId) {
      const found = promoDesigns.find((p) => p.id === promoId);
      setSelectedPromoForBooking(found || null);
    } else {
      setSelectedPromoForBooking(null);
    }
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  const addPromoDesign = (design: Omit<PromoDesign, 'id'>) => {
    const newId = `promo-${Date.now()}`;
    const newDesign: PromoDesign = { ...design, id: newId };
    setPromoDesigns((prev) => {
      const updated = [newDesign, ...prev];
      if (googleAccessToken && spreadsheetId) {
        syncCatalogPhotosSheet(googleAccessToken, spreadsheetId, updated).catch((err) =>
          console.warn('Sync promos to Google Sheet failed:', err)
        );
      }
      return updated;
    });
  };

  const updatePromoDesign = (id: string, updates: Partial<PromoDesign>) => {
    setPromoDesigns((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      if (googleAccessToken && spreadsheetId) {
        syncCatalogPhotosSheet(googleAccessToken, spreadsheetId, updated).catch((err) =>
          console.warn('Sync promos to Google Sheet failed:', err)
        );
      }
      return updated;
    });
  };

  const deletePromoDesign = (id: string) => {
    setPromoDesigns((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (googleAccessToken && spreadsheetId) {
        syncCatalogPhotosSheet(googleAccessToken, spreadsheetId, updated).catch((err) =>
          console.warn('Sync promos to Google Sheet failed:', err)
        );
      }
      return updated;
    });
  };

  const resetPromoCatalog = () => {
    setPromoDesigns(PROMO_CATALOG_DESIGNS);
    if (googleAccessToken && spreadsheetId) {
      syncCatalogPhotosSheet(googleAccessToken, spreadsheetId, PROMO_CATALOG_DESIGNS).catch((err) =>
        console.warn('Sync promos to Google Sheet failed:', err)
      );
    }
  };

  const updateSettings = (newSettings: Partial<StudioSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (googleAccessToken && spreadsheetId) {
        syncSettingsSheet(googleAccessToken, spreadsheetId, updated).catch((err) =>
          console.warn('Sync settings to Google Sheet failed:', err)
        );
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(INITIAL_SETTINGS);
    if (googleAccessToken && spreadsheetId) {
      syncSettingsSheet(googleAccessToken, spreadsheetId, INITIAL_SETTINGS).catch((err) =>
        console.warn('Sync settings to Google Sheet failed:', err)
      );
    }
  };

  const createAppointment = (
    data: Omit<Appointment, 'id' | 'code' | 'createdAt'>
  ): Appointment => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const code = `GNB-${new Date().getFullYear()}-${randomSuffix}`;
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      code,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => {
      const updated = [newApt, ...prev];
      if (googleAccessToken && spreadsheetId) {
        appendAppointmentToSheet(googleAccessToken, spreadsheetId, newApt).catch((err) =>
          console.warn('Auto-sync to Google Sheet failed:', err)
        );
      }
      return updated;
    });

    return newApt;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => {
      const updated = prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt));
      if (googleAccessToken && spreadsheetId) {
        syncAppointmentsSheet(googleAccessToken, spreadsheetId, updated).catch((err) =>
          console.warn('Sync appointments to Google Sheet failed:', err)
        );
      }
      return updated;
    });
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment['status'],
    depositPaid?: boolean
  ) => {
    setAppointments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id === id) {
          return {
            ...apt,
            status,
            depositPaid: depositPaid !== undefined ? depositPaid : apt.depositPaid,
          };
        }
        return apt;
      });
      if (googleAccessToken && spreadsheetId) {
        syncAppointmentsSheet(googleAccessToken, spreadsheetId, updated).catch((err) =>
          console.warn('Sync appointments to Google Sheet failed:', err)
        );
      }
      return updated;
    });
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => {
      const updated = prev.filter((apt) => apt.id !== id);
      if (googleAccessToken && spreadsheetId) {
        syncAppointmentsSheet(googleAccessToken, spreadsheetId, updated).catch((err) =>
          console.warn('Sync appointments to Google Sheet failed:', err)
        );
      }
      return updated;
    });
  };

  const clearCancelledAppointments = () => {
    setAppointments((prev) => {
      const updated = prev.filter((apt) => apt.status !== 'cancelled');
      if (googleAccessToken && spreadsheetId) {
        syncAppointmentsSheet(googleAccessToken, spreadsheetId, updated).catch((err) =>
          console.warn('Sync appointments to Google Sheet failed:', err)
        );
      }
      return updated;
    });
  };

  // Google Sheets Management
  const connectGoogleSheets = async () => {
    setIsSyncingSheets(true);
    try {
      let token = googleAccessToken;
      let user = googleUser;
      if (!token || !user) {
        const res = await googleSignIn();
        if (!res) throw new Error('No se pudo autenticar');
        token = res.accessToken;
        user = res.user;
        setGoogleUser(user);
        setGoogleAccessToken(token);
      }

      // Check if spreadsheet already stored, otherwise create new
      let currentSheetId = spreadsheetId;
      if (!currentSheetId) {
        const sheetInfo = await createGabeeSpreadsheet(
          token,
          appointments,
          settings,
          promoDesigns
        );
        currentSheetId = sheetInfo.spreadsheetId;
        setSpreadsheetId(sheetInfo.spreadsheetId);
        setSpreadsheetUrl(sheetInfo.spreadsheetUrl);
        localStorage.setItem(SPREADSHEET_URL_STORAGE_KEY, sheetInfo.spreadsheetUrl);
      } else {
        // Sync existing spreadsheet
        await syncAllDataToSpreadsheet(token, currentSheetId, appointments, settings, promoDesigns);
        const url = `https://docs.google.com/spreadsheets/d/${currentSheetId}`;
        setSpreadsheetUrl(url);
        localStorage.setItem(SPREADSHEET_URL_STORAGE_KEY, url);
      }
    } catch (err: any) {
      console.error('Error connecting Google Sheets:', err);
      alert(err.message || 'Error al conectar con Google Sheets');
      throw err;
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const disconnectGoogleSheets = async () => {
    await googleLogout();
    setGoogleUser(null);
    setGoogleAccessToken(null);
  };

  const syncAllToGoogleSheets = async () => {
    if (!googleAccessToken || !spreadsheetId) {
      await connectGoogleSheets();
      return;
    }
    setIsSyncingSheets(true);
    try {
      await syncAllDataToSpreadsheet(
        googleAccessToken,
        spreadsheetId,
        appointments,
        settings,
        promoDesigns
      );
    } catch (err: any) {
      console.error('Error syncing to Google Sheets:', err);
      alert('Error al sincronizar con Google Sheets: ' + (err.message || ''));
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Build high-converting, crystal clear WhatsApp booking dispatch message
  const generateWhatsAppLink = (apt: Appointment): string => {
    const rawNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const serviceName =
      apt.serviceType === 'promotion'
        ? `Promoción: ${apt.promoDesignTitle || 'Diseño Tendencia 2026'}`
        : `Servicio Personalizado (${apt.customDetails?.level.toUpperCase() || 'MODERADO'})`;

    const remainingBalance = apt.totalPrice - apt.depositRequired;

    const message = `✨ *SOLICITUD DE CITA - GABEE NAIL ART 2026* ✨\n` +
      `Código de Reserva: *#${apt.code}*\n` +
      `───────────────────────\n` +
      `👤 *Cliente:* ${apt.clientName}\n` +
      `📱 *WhatsApp:* ${apt.clientPhone}\n` +
      (apt.clientInstagram ? `📸 *Instagram:* ${apt.clientInstagram}\n` : '') +
      `💅 *Servicio:* ${serviceName}\n` +
      `📅 *Fecha:* ${apt.date} (Hora Lima GMT -05)\n` +
      `⏰ *Hora:* ${apt.timeSlot}\n` +
      `📍 *Modalidad:* ${apt.locationType === 'studio' ? 'En Estudio (Surco)' : `A Domicilio (${apt.homeAddress || 'Dirección por confirmar'})`}\n` +
      `───────────────────────\n` +
      `💰 *Costo Total Estimado:* S/. ${apt.totalPrice.toFixed(2)}\n` +
      `💳 *Adelanto a Pagar (Para Separar):* S/. ${apt.depositRequired.toFixed(2)}\n` +
      `💵 *Saldo Pendiente el día de la Cita:* S/. ${remainingBalance.toFixed(2)}\n` +
      `📲 *Método de Pago Adelanto:* ${apt.paymentMethod.toUpperCase()} (Yape: ${settings.yapeNumber} / Plin: ${settings.plinNumber} - Titular: ${settings.yapeName})\n` +
      `───────────────────────\n` +
      (apt.notes ? `📝 *Notas:* ${apt.notes}\n` : '') +
      `📌 *Adjunto mi comprobante de pago de adelanto de S/. ${apt.depositRequired} para confirmar mi cupo.*\n\n` +
      `¡Muchas gracias!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${rawNumber}?text=${encoded}`;
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        isAdmin,
        setIsAdmin,
        showTermsModal,
        setShowTermsModal,
        showGuideModal,
        setShowGuideModal,
        isBookingOpen,
        openBooking,
        closeBooking,
        bookingServiceType,
        selectedPromoForBooking,
        promoDesigns,
        selectedPromoForDetails,
        setSelectedPromoForDetails,
        addPromoDesign,
        updatePromoDesign,
        deletePromoDesign,
        resetPromoCatalog,
        customConfig,
        setCustomConfig,
        resetCustomConfig,
        appointments,
        createAppointment,
        updateAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        clearCancelledAppointments,
        settings,
        updateSettings,
        resetSettings,
        generateWhatsAppLink,
        googleUser,
        googleAccessToken,
        spreadsheetId,
        spreadsheetUrl,
        isSyncingSheets,
        connectGoogleSheets,
        disconnectGoogleSheets,
        syncAllToGoogleSheets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
