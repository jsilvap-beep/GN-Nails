import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PromoDesign, Appointment, StudioSettings, DesignLevel, AppointmentStatus } from '../types';
import { GabeeLogo } from './GabeeLogo';
import {
  ShieldCheck,
  Calendar,
  Layers,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Upload,
  Edit2,
  Eye,
  EyeOff,
  DollarSign,
  Save,
  X,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Check,
  AlertCircle,
  RotateCcw,
  User,
  MapPin,
  Tag,
  Sparkles,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    appointments,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    clearCancelledAppointments,
    promoDesigns,
    addPromoDesign,
    updatePromoDesign,
    deletePromoDesign,
    resetPromoCatalog,
    settings,
    updateSettings,
    resetSettings,
    setIsAdmin,
    setCurrentView,
    spreadsheetId,
    spreadsheetUrl,
    isSyncingSheets,
    connectGoogleSheets,
    syncAllToGoogleSheets,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'appointments' | 'catalog' | 'settings' | 'sheets'>('appointments');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchClient, setSearchClient] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-app deletion confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'appointment' | 'promo' | 'cancelled' | 'reset_catalog' | 'reset_settings';
    id?: string;
    title?: string;
  } | null>(null);

  // Promo Modal State (Grabar / Modificar)
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [promoForm, setPromoForm] = useState<{
    title: string;
    collection: string;
    description: string;
    technique: string;
    level: DesignLevel;
    durationMinutes: number;
    price: number;
    image: string;
    tags: string;
    recommendedSystem: string;
    featured: boolean;
    active: boolean;
  }>({
    title: '',
    collection: 'Lujo & Cromo',
    description: '',
    technique: '',
    level: 'moderado',
    durationMinutes: 90,
    price: settings.defaultPromoPrice,
    image: '',
    tags: 'Tendencia 2026, Elegante',
    recommendedSystem: 'Softgel o Polygel',
    featured: false,
    active: true,
  });

  // Appointment Modal State (Grabar / Modificar Cita)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [appointmentForm, setAppointmentForm] = useState<{
    clientName: string;
    clientPhone: string;
    clientInstagram: string;
    serviceType: 'promotion' | 'custom';
    promoDesignTitle: string;
    date: string;
    timeSlot: string;
    locationType: 'studio' | 'home';
    homeAddress: string;
    status: AppointmentStatus;
    totalPrice: number;
    depositRequired: number;
    depositPaid: boolean;
    paymentMethod: 'yape' | 'plin';
    notes: string;
  }>({
    clientName: '',
    clientPhone: '',
    clientInstagram: '',
    serviceType: 'promotion',
    promoDesignTitle: promoDesigns[0]?.title || 'Tendencia 2026',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '02:30 PM',
    locationType: 'studio',
    homeAddress: '',
    status: 'confirmed',
    totalPrice: 60,
    depositRequired: 20,
    depositPaid: true,
    paymentMethod: 'yape',
    notes: '',
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<StudioSettings>({ ...settings });

  // Show Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchClient.toLowerCase()) ||
      apt.clientPhone.includes(searchClient) ||
      apt.code.toLowerCase().includes(searchClient.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // =====================
  // CITAS (GRABAR & MODIFICAR)
  // =====================
  const handleOpenNewAppointment = () => {
    setEditingAppointmentId(null);
    setAppointmentForm({
      clientName: '',
      clientPhone: '+51 ',
      clientInstagram: '',
      serviceType: 'promotion',
      promoDesignTitle: promoDesigns[0]?.title || 'Tendencia 2026',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '02:30 PM',
      locationType: 'studio',
      homeAddress: '',
      status: 'confirmed',
      totalPrice: settings.defaultPromoPrice,
      depositRequired: settings.defaultDepositAmount,
      depositPaid: true,
      paymentMethod: 'yape',
      notes: '',
    });
    setShowAppointmentModal(true);
  };

  const handleOpenEditAppointment = (apt: Appointment) => {
    setEditingAppointmentId(apt.id);
    setAppointmentForm({
      clientName: apt.clientName,
      clientPhone: apt.clientPhone,
      clientInstagram: apt.clientInstagram || '',
      serviceType: apt.serviceType,
      promoDesignTitle: apt.promoDesignTitle || (apt.serviceType === 'promotion' ? 'Promo Catálogo' : 'Set Personalizado'),
      date: apt.date,
      timeSlot: apt.timeSlot,
      locationType: apt.locationType,
      homeAddress: apt.homeAddress || '',
      status: apt.status,
      totalPrice: apt.totalPrice,
      depositRequired: apt.depositRequired,
      depositPaid: apt.depositPaid,
      paymentMethod: apt.paymentMethod,
      notes: apt.notes || '',
    });
    setShowAppointmentModal(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.clientName.trim() || !appointmentForm.clientPhone.trim()) {
      alert('Ingresa el nombre y teléfono de la clienta.');
      return;
    }

    if (editingAppointmentId) {
      // Modificar cita existente
      updateAppointment(editingAppointmentId, {
        clientName: appointmentForm.clientName.trim(),
        clientPhone: appointmentForm.clientPhone.trim(),
        clientInstagram: appointmentForm.clientInstagram.trim() || undefined,
        serviceType: appointmentForm.serviceType,
        promoDesignTitle: appointmentForm.serviceType === 'promotion' ? appointmentForm.promoDesignTitle : undefined,
        date: appointmentForm.date,
        timeSlot: appointmentForm.timeSlot,
        locationType: appointmentForm.locationType,
        homeAddress: appointmentForm.locationType === 'home' ? appointmentForm.homeAddress.trim() : undefined,
        status: appointmentForm.status,
        totalPrice: Number(appointmentForm.totalPrice),
        depositRequired: Number(appointmentForm.depositRequired),
        depositPaid: appointmentForm.depositPaid,
        paymentMethod: appointmentForm.paymentMethod,
        notes: appointmentForm.notes.trim() || undefined,
      });
      triggerToast('✓ Cita modificada y guardada correctamente.');
    } else {
      // Grabar nueva cita
      createAppointment({
        clientName: appointmentForm.clientName.trim(),
        clientPhone: appointmentForm.clientPhone.trim(),
        clientInstagram: appointmentForm.clientInstagram.trim() || undefined,
        serviceType: appointmentForm.serviceType,
        promoDesignTitle: appointmentForm.serviceType === 'promotion' ? appointmentForm.promoDesignTitle : undefined,
        date: appointmentForm.date,
        timeSlot: appointmentForm.timeSlot,
        locationType: appointmentForm.locationType,
        homeAddress: appointmentForm.locationType === 'home' ? appointmentForm.homeAddress.trim() : undefined,
        status: appointmentForm.status,
        totalPrice: Number(appointmentForm.totalPrice),
        depositRequired: Number(appointmentForm.depositRequired),
        depositPaid: appointmentForm.depositPaid,
        paymentMethod: appointmentForm.paymentMethod,
        notes: appointmentForm.notes.trim() || undefined,
      });
      triggerToast('✓ Nueva cita registrada en la agenda exitosamente.');
    }
    setShowAppointmentModal(false);
  };

  // =====================
  // CATÁLOGO (GRABAR & MODIFICAR)
  // =====================
  const handleOpenAddPromo = (promoToEdit?: PromoDesign) => {
    if (promoToEdit) {
      setEditingPromoId(promoToEdit.id);
      setPromoForm({
        title: promoToEdit.title,
        collection: promoToEdit.collection,
        description: promoToEdit.description,
        technique: promoToEdit.technique,
        level: promoToEdit.level,
        durationMinutes: promoToEdit.durationMinutes,
        price: promoToEdit.price,
        image: promoToEdit.image,
        tags: promoToEdit.tags.join(', '),
        recommendedSystem: promoToEdit.recommendedSystem,
        featured: !!promoToEdit.featured,
        active: promoToEdit.active,
      });
    } else {
      setEditingPromoId(null);
      setPromoForm({
        title: '',
        collection: 'Florales & Jardín',
        description: 'Elegante manicura en tendencia con diseño artesanal.',
        technique: '1. Preparación de lámina natural y cutícula. 2. Colocación de Softgel o Builder Gel. 3. Pintado artesanal con gel liner de alta densidad. 4. Doble sellado con top coat cristalino.',
        level: 'moderado',
        durationMinutes: 90,
        price: settings.defaultPromoPrice,
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        tags: 'Nuevo, Tendencia 2026',
        recommendedSystem: 'Softgel o Builder Gel',
        featured: false,
        active: true,
      });
    }
    setShowAddPromoModal(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.title.trim() || !promoForm.image.trim()) {
      alert('Ingresa el nombre del diseño y una imagen.');
      return;
    }

    const tagsArray = promoForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingPromoId) {
      updatePromoDesign(editingPromoId, {
        ...promoForm,
        price: Number(promoForm.price),
        tags: tagsArray,
      });
      triggerToast('✓ Diseño promocional modificado correctamente.');
    } else {
      addPromoDesign({
        ...promoForm,
        price: Number(promoForm.price),
        tags: tagsArray,
      });
      triggerToast('✓ Nuevo diseño grabado y añadido al catálogo.');
    }
    setShowAddPromoModal(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPromoForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // =====================
  // CONFIGURACIÓN (GRABAR & RESTABLECER)
  // =====================
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    triggerToast('✓ Configuración del estudio guardada correctamente.');
  };

  // =====================
  // CONFIRMED DELETION DISPATCH
  // =====================
  const handleConfirmAction = () => {
    if (!deleteConfirmation) return;

    if (deleteConfirmation.type === 'appointment' && deleteConfirmation.id) {
      deleteAppointment(deleteConfirmation.id);
      triggerToast('✓ Cita eliminada permanentemente.');
    } else if (deleteConfirmation.type === 'promo' && deleteConfirmation.id) {
      deletePromoDesign(deleteConfirmation.id);
      triggerToast('✓ Diseño eliminado del catálogo.');
    } else if (deleteConfirmation.type === 'cancelled') {
      clearCancelledAppointments();
      triggerToast('✓ Todas las citas canceladas fueron eliminadas.');
    } else if (deleteConfirmation.type === 'reset_catalog') {
      resetPromoCatalog();
      triggerToast('✓ Catálogo original de 19 diseños restaurado.');
    } else if (deleteConfirmation.type === 'reset_settings') {
      resetSettings();
      setSettingsForm({ ...settings });
      triggerToast('✓ Ajustes restaurados a los valores iniciales.');
    }

    setDeleteConfirmation(null);
  };

  return (
    <div className="py-8 lg:py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 animate-bounce duration-300">
            <div className="bg-[#2E2016] text-[#FAF7F2] px-5 py-3 rounded-2xl shadow-xl border border-[#D4AF37]/50 flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#E6C665]" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Top Header of Admin Console */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E8DEC9]">
          <div className="flex items-center gap-3.5">
            <GabeeLogo size="sm" />
            <div>
              <span className="text-[10px] font-brand uppercase tracking-widest text-[#947D68]">
                Panel de Administración Oficial
              </span>
              <h2 className="text-2xl font-display font-bold text-[#302117]">
                Gestión de Gabee Nail Art
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Google Sheets Connection Status Badge */}
            {spreadsheetUrl ? (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                title="Abrir hoja de cálculo en Google Sheets"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Sheets Conectado</span>
                <ExternalLink className="w-3 h-3 text-emerald-700" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('sheets')}
                className="py-1.5 px-3 rounded-xl bg-[#F4EFE6] border border-[#DFCBB5] text-[#7A614A] text-xs font-medium flex items-center gap-1.5 hover:bg-[#EAE0D0] transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#B89230]" />
                <span>Configurar Google Sheets</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsAdmin(false);
                setCurrentView('home');
              }}
              className="py-2 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#5A4535] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
            >
              Salir del Modo Admin
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-[#E8DFC9] pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-[#3B2B20] text-white shadow-xs'
                : 'text-[#6C5747] hover:bg-[#F2ECE2]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#E6C665]" />
            <span>Gestión de Citas ({appointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-[#3B2B20] text-white shadow-xs'
                : 'text-[#6C5747] hover:bg-[#F2ECE2]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#E6C665]" />
            <span>Catálogo de Promociones ({promoDesigns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#3B2B20] text-white shadow-xs'
                : 'text-[#6C5747] hover:bg-[#F2ECE2]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#E6C665]" />
            <span>Configuración y Tarifas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Google Spreadsheet {spreadsheetId ? '✓' : '(Conectar)'}</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: Appointments Management (Grabar, Modificar, Eliminar) */}
        {/* ========================================================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Top Action Bar: Register Manual Appointment & Clean Cancelled */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E7DDCE] shadow-2xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'pending_deposit', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-[#39291E] text-white'
                        : 'bg-[#F2ECE2] text-[#695647] hover:bg-[#E7DDCE]'
                    }`}
                  >
                    {st === 'all' && `Todas (${appointments.length})`}
                    {st === 'pending_deposit' && `Pendiente Adelanto (${appointments.filter(a => a.status === 'pending_deposit').length})`}
                    {st === 'confirmed' && `Confirmadas (${appointments.filter(a => a.status === 'confirmed').length})`}
                    {st === 'completed' && `Atendidas (${appointments.filter(a => a.status === 'completed').length})`}
                    {st === 'cancelled' && `Canceladas (${appointments.filter(a => a.status === 'cancelled').length})`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar por clienta o código..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BF] bg-[#FAF7F2] text-[#302117] focus:outline-none focus:ring-1 focus:ring-[#C29D38] w-full sm:w-56"
                />

                <button
                  type="button"
                  onClick={handleOpenNewAppointment}
                  className="py-2 px-3.5 rounded-xl bg-[#39291E] hover:bg-[#231710] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  title="Grabar y registrar nueva cita en la agenda"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E6C665]" />
                  <span>Registrar Cita Manual</span>
                </button>

                {appointments.some((a) => a.status === 'cancelled') && (
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteConfirmation({
                        type: 'cancelled',
                        title: '¿Deseas eliminar todas las citas canceladas de la agenda?',
                      })
                    }
                    className="py-2 px-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Limpiar citas canceladas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Limpiar Canceladas</span>
                  </button>
                )}
              </div>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E7DDCE] text-xs text-[#7B6756] space-y-2">
                <Calendar className="w-8 h-8 text-[#C4B29E] mx-auto" />
                <p>No hay citas que coincidan con el filtro seleccionado.</p>
                <button
                  type="button"
                  onClick={handleOpenNewAppointment}
                  className="text-xs font-semibold text-[#8C6B1C] hover:underline"
                >
                  + Registrar una nueva cita aquí
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-white border border-[#E7DDCE] shadow-2xs hover:border-[#D5C6B1] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#8C6B1C] bg-[#FAF4EB] px-2 py-0.5 rounded border border-[#E8DFC9]">
                          #{apt.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'pending_deposit'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {apt.status === 'confirmed' && 'Confirmado (Adelanto OK)'}
                          {apt.status === 'pending_deposit' && 'Esperando Adelanto'}
                          {apt.status === 'completed' && 'Atendido'}
                          {apt.status === 'cancelled' && 'Cancelado'}
                        </span>

                        <span className="text-[11px] text-[#917E6F] font-mono ml-auto lg:ml-0">
                          Reg: {new Date(apt.createdAt).toLocaleDateString('es-PE')}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#2F2016]">
                        {apt.clientName}{' '}
                        {apt.clientInstagram && (
                          <span className="text-xs font-normal text-[#8A7563]">
                            ({apt.clientInstagram})
                          </span>
                        )}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6F5B4D]">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#8C6B1C]" />
                          <span>{apt.date} · {apt.timeSlot}</span>
                        </span>

                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#8C6B1C]" />
                          <span>{apt.clientPhone}</span>
                        </span>

                        <span>
                          Modalidad: <strong>{apt.locationType === 'studio' ? 'En Estudio' : `A Domicilio (${apt.homeAddress || 'Sin dirección'})`}</strong>
                        </span>
                      </div>

                      <p className="text-xs text-[#7A6655] pt-1">
                        Servicio:{' '}
                        <strong>
                          {apt.serviceType === 'promotion'
                            ? apt.promoDesignTitle
                            : `Set Personalizado (${apt.customDetails?.shape || 'Forma libre'} - Nivel ${apt.customDetails?.level || 'Moderado'})`}
                        </strong>
                        {apt.notes && <span className="italic block mt-0.5 text-[#8A725D]">Notas: "{apt.notes}"</span>}
                      </p>
                    </div>

                    {/* Financials & Action Buttons (Modificar & Eliminar) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F2ECE2]">
                      <div className="text-left sm:text-right text-xs">
                        <span className="text-[#887463] block">Total S/. {apt.totalPrice.toFixed(2)}</span>
                        <span className="font-bold font-mono text-[#8C6B1C] block">
                          Adelanto: S/. {apt.depositRequired} ({apt.paymentMethod.toUpperCase()})
                        </span>
                        <span className={`text-[10px] font-semibold ${apt.depositPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {apt.depositPaid ? '✓ Adelanto verificado' : '⏳ Pendiente de verificar'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* WhatsApp direct chat */}
                        <a
                          href={`https://wa.me/${apt.clientPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                          title="Contactar clienta por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* Status switcher quick action */}
                        <select
                          value={apt.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as AppointmentStatus;
                            updateAppointmentStatus(
                              apt.id,
                              newStatus,
                              newStatus === 'confirmed' ? true : undefined
                            );
                            triggerToast(`✓ Estado de cita actualizado a: ${newStatus}`);
                          }}
                          className="text-xs py-1.5 px-2.5 rounded-xl border border-[#DDD1BF] bg-[#FAF7F2] text-[#2E2017] cursor-pointer"
                        >
                          <option value="pending_deposit">Esperando Adelanto</option>
                          <option value="confirmed">Confirmar (Adelanto OK)</option>
                          <option value="completed">Marcar Atendido</option>
                          <option value="cancelled">Cancelar Cita</option>
                        </select>

                        {/* Modificar Cita */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditAppointment(apt)}
                          className="p-2 rounded-xl border border-[#DDD1BF] text-[#5C493B] hover:bg-[#F2ECE2] transition-colors cursor-pointer"
                          title="Modificar datos de la cita"
                        >
                          <Edit2 className="w-4 h-4 text-[#8C6B1C]" />
                        </button>

                        {/* Eliminar Cita */}
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'appointment',
                              id: apt.id,
                              title: `¿Eliminar permanentemente la cita #${apt.code} de ${apt.clientName}?`,
                            })
                          }
                          className="p-2 text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Eliminar cita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: Promos Catalog Management (Grabar, Modificar, Eliminar) */}
        {/* ========================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-bold text-[#302117]">
                  Diseños de la Sección Promociones
                </h3>
                <p className="text-xs text-[#7A6655]">
                  Agrega nuevas fotos del catálogo, ajusta precios, descripciones o técnicas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteConfirmation({
                      type: 'reset_catalog',
                      title: '¿Restaurar el catálogo original de 19 fotos del PDF? (Se mantendrán los diseños iniciales)',
                    })
                  }
                  className="py-2.5 px-3.5 rounded-xl border border-[#D5C6B1] bg-white hover:bg-[#F2ECE2] text-[#695444] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restaurar catálogo inicial"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Catálogo Original</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAddPromo()}
                  className="py-2.5 px-4 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#E6C665]" />
                  <span>Agregar Nuevo Diseño (Grabar)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {promoDesigns.map((design) => (
                <div
                  key={design.id}
                  className="rounded-2xl bg-white border border-[#E7DDCE] overflow-hidden shadow-2xs flex flex-col justify-between hover:border-[#D0BFAC] transition-all"
                >
                  <div className="relative h-48 bg-[#F2ECE2] overflow-hidden">
                    <img
                      src={design.image}
                      alt={design.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 text-[#8C6B1C] font-mono font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
                      S/. {design.price}
                    </div>

                    <div className="absolute top-2 left-2 bg-[#2D1F16]/80 text-[#FAF7F2] text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                      {design.collection}
                    </div>

                    {!design.active && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                        Inactivo (Oculto en Catálogo)
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#8C7664] font-medium">
                        <span>Nivel: <strong>{design.level.toUpperCase()}</strong></span>
                        <span>{design.durationMinutes} min</span>
                      </div>

                      <h4 className="font-bold text-sm text-[#302117] mt-1">
                        {design.title}
                      </h4>

                      <p className="text-[11px] text-[#715E4E] line-clamp-2 mt-1.5 leading-relaxed">
                        {design.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {design.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-[#FAF4EB] text-[#785E47] border border-[#EADFCB] px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions: Activar/Ocultar, Modificar, Eliminar */}
                    <div className="pt-3 mt-3 border-t border-[#F2ECE2] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          updatePromoDesign(design.id, { active: !design.active });
                          triggerToast(
                            design.active ? 'Diseño ocultado en el catálogo.' : 'Diseño activado en el catálogo.'
                          );
                        }}
                        className="text-xs text-[#7B6756] hover:text-[#2E2017] flex items-center gap-1 cursor-pointer"
                        title={design.active ? 'Ocultar en catálogo' : 'Mostrar en catálogo'}
                      >
                        {design.active ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[11px] font-medium">Activo</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-[11px] font-medium">Oculto</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenAddPromo(design)}
                          className="p-1.5 rounded-lg border border-[#DDD1BF] text-[#5C493B] hover:bg-[#F2ECE2] cursor-pointer"
                          title="Modificar diseño"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#8C6B1C]" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'promo',
                              id: design.id,
                              title: `¿Eliminar el diseño "${design.title}" del catálogo de promociones?`,
                            })
                          }
                          className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer"
                          title="Eliminar diseño"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: Studio Settings (Grabar, Modificar, Restablecer) */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E7DDCE] shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE7DC] pb-4">
                <div>
                  <h3 className="text-lg font-display font-bold text-[#302117]">
                    Configuración del Estudio & Datos de Pago
                  </h3>
                  <p className="text-xs text-[#7A6655]">
                    Modifica números de Yape/Plin, teléfono de WhatsApp y todas las tarifas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteConfirmation({
                        type: 'reset_settings',
                        title: '¿Restablecer todas las tarifas y configuraciones a los valores iniciales?',
                      })
                    }
                    className="py-2.5 px-3.5 rounded-xl border border-[#D5C6B1] bg-white hover:bg-[#F2ECE2] text-[#695444] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer Valores Iniciales</span>
                  </button>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#E6C665]" />
                    <span>Guardar Cambios (Grabar)</span>
                  </button>
                </div>
              </div>

              {/* General Studio Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#48372A] mb-1">
                    Nombre del Estudio
                  </label>
                  <input
                    type="text"
                    value={settingsForm.studioName}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, studioName: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-[#FAF7F2] text-xs text-[#2E2017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#48372A] mb-1">
                    WhatsApp para Notificaciones
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-[#FAF7F2] text-xs text-[#2E2017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#48372A] mb-1">
                    Instagram Oficial
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instagram}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, instagram: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-[#FAF7F2] text-xs text-[#2E2017]"
                  />
                </div>
              </div>

              {/* Yape & Plin Accounts */}
              <div className="pt-4 border-t border-[#EFE7DC] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC9] space-y-3">
                  <span className="text-xs font-bold text-[#742384] uppercase tracking-wider block">
                    🟣 Configuración Yape
                  </span>
                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Número de Teléfono Yape
                    </label>
                    <input
                      type="text"
                      value={settingsForm.yapeNumber}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, yapeNumber: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Nombre del Titular Yape
                    </label>
                    <input
                      type="text"
                      value={settingsForm.yapeName}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, yapeName: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC9] space-y-3">
                  <span className="text-xs font-bold text-[#009FE3] uppercase tracking-wider block">
                    🔵 Configuración Plin
                  </span>
                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Número de Teléfono Plin
                    </label>
                    <input
                      type="text"
                      value={settingsForm.plinNumber}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, plinNumber: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Nombre del Titular Plin
                    </label>
                    <input
                      type="text"
                      value={settingsForm.plinName}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, plinName: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Fees */}
              <div className="pt-4 border-t border-[#EFE7DC] space-y-4">
                <h4 className="text-sm font-bold text-[#302117]">
                  Tarifas Principales (Soles)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Precio Promo Base
                    </label>
                    <input
                      type="number"
                      value={settingsForm.defaultPromoPrice}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          defaultPromoPrice: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Adelanto Requerido
                    </label>
                    <input
                      type="number"
                      value={settingsForm.defaultDepositAmount}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          defaultDepositAmount: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Nivel Básico (Sencillo)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.levelBasicPrice}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          levelBasicPrice: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Nivel Complejo (3D Art)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.levelComplexPrice}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          levelComplexPrice: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-[#302117] pt-2">
                  Recargos y Servicios Adicionales (Soles)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Recargo Stiletto
                    </label>
                    <input
                      type="number"
                      value={settingsForm.stilettoExtraCost}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          stilettoExtraCost: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Recargo Domicilio
                    </label>
                    <input
                      type="number"
                      value={settingsForm.homeServiceExtraCost}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          homeServiceExtraCost: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Retiro Set Anterior
                    </label>
                    <input
                      type="number"
                      value={settingsForm.removalExtraCost}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          removalExtraCost: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Pedrería / Cristales
                    </label>
                    <input
                      type="number"
                      value={settingsForm.rhinestoneExtraCost}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          rhinestoneExtraCost: Number(e.target.value),
                        }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      Dirección del Estudio (Surco, Lima)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.studioAddress}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, studioAddress: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#564335] mb-1">
                      PIN de Acceso al Panel Admin
                    </label>
                    <input
                      type="text"
                      value={settingsForm.adminPin}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({ ...prev, adminPin: e.target.value }))
                      }
                      className="w-full p-2 rounded-lg border border-[#DDD1BF] bg-[#FAF7F2] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 4: Google Spreadsheet (Hojas de Cálculo) */}
        {/* ========================================================= */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E7DDCE] shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EFE7DC]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-brand uppercase tracking-widest text-[#947D68] block">
                      Google Workspace · Sheets API
                    </span>
                    <h3 className="text-xl font-display font-bold text-[#302117]">
                      Google Spreadsheet Oficial
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {spreadsheetUrl ? (
                    <>
                      <a
                        href={spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <span>Abrir en Google Sheets</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          await syncAllToGoogleSheets();
                          triggerToast('¡Datos sincronizados exitosamente con Google Sheets!');
                        }}
                        disabled={isSyncingSheets}
                        className="py-2 px-4 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-[#E6C665] ${isSyncingSheets ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSheets ? 'Sincronizando...' : 'Sincronizar Todo'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        await connectGoogleSheets();
                        triggerToast('¡Hoja de cálculo creada y conectada exitosamente!');
                      }}
                      disabled={isSyncingSheets}
                      className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>{isSyncingSheets ? 'Creando Hoja de Cálculo...' : 'Crear y Conectar Google Spreadsheet'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Connection Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D0]">
                  <span className="text-[10px] text-[#86715F] block uppercase font-bold tracking-wider">
                    Estado de Conexión
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${spreadsheetId ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    <span className="font-semibold text-[#302117]">
                      {spreadsheetId ? 'Conectado a Google Sheets' : 'Pendiente de Conexión'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D0]">
                  <span className="text-[10px] text-[#86715F] block uppercase font-bold tracking-wider">
                    Nombre del Archivo
                  </span>
                  <span className="font-semibold text-[#302117] block mt-1 truncate">
                    Gabee Nail Art - Gestión & Catálogo 2026
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D0]">
                  <span className="text-[10px] text-[#86715F] block uppercase font-bold tracking-wider">
                    Auto-Sincronización
                  </span>
                  <span className="font-semibold text-emerald-700 block mt-1">
                    {spreadsheetId ? 'Activa (Registra citas y fotos al instante)' : 'Inactiva'}
                  </span>
                </div>
              </div>
            </div>

            {/* Overview of 3 Worksheets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-[#E7DDCE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Pestaña 1
                  </span>
                  <span className="text-[11px] font-semibold text-[#8C6B1C] font-mono">
                    {appointments.length} citas
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-[#302117]">
                  Citas_Agenda
                </h4>
                <p className="text-xs text-[#715D4E] leading-relaxed">
                  Almacena el código de reserva, nombre de la clienta, teléfono de WhatsApp, Instagram, servicio, fecha, hora, modalidad (estudio o domicilio), estado, costo total y adelanto de S/. 20.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E7DDCE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Pestaña 2
                  </span>
                  <span className="text-[11px] font-semibold text-[#8C6B1C] font-mono">
                    18 parámetros
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-[#302117]">
                  Configuracion_Admin
                </h4>
                <p className="text-xs text-[#715D4E] leading-relaxed">
                  Guarda todos los ajustes del negocio: precio base de promoción (S/. {settings.defaultPromoPrice}), monto de adelanto (S/. {settings.defaultDepositAmount}), recargos de stiletto, números y titulares de Yape y Plin, y WhatsApp.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E7DDCE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Pestaña 3
                  </span>
                  <span className="text-[11px] font-semibold text-[#8C6B1C] font-mono">
                    {promoDesigns.length} fotos
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-[#302117]">
                  Catalogo_Fotos
                </h4>
                <p className="text-xs text-[#715D4E] leading-relaxed">
                  Guarda todas las fotos e imágenes del catálogo oficial con sus URLs directas, colecciones, descripción estética, técnica de manicura paso a paso y precio promocional de S/. 60.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT PROMO DESIGN (GRABAR & MODIFICAR) */}
      {/* ========================================================= */}
      {showAddPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E3D6C3] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8DEC9] bg-[#F5EFE6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C29D38]" />
                <h3 className="text-lg font-display font-bold text-[#302117]">
                  {editingPromoId ? 'Modificar Diseño del Catálogo' : 'Grabar Nuevo Diseño en Promociones'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPromoModal(false)}
                className="p-1.5 text-[#7A6655] hover:text-[#2E2017] rounded-lg hover:bg-[#EAE0D0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#48372A] mb-1">
                  Nombre del Diseño *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Velvet Cat-Eye con Lazos 3D"
                  value={promoForm.title}
                  onChange={(e) => setPromoForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Colección</label>
                  <select
                    value={promoForm.collection}
                    onChange={(e) => setPromoForm((p) => ({ ...p, collection: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  >
                    <option value="Lujo & Cromo">Lujo & Cromo</option>
                    <option value="Florales & Jardín">Florales & Jardín</option>
                    <option value="Y2K & Celestial Cyber">Y2K & Celestial Cyber</option>
                    <option value="Frutas Verano">Frutas Verano</option>
                    <option value="Coquette & Lazos">Coquette & Lazos</option>
                    <option value="Minimalistas & Clásicos">Minimalistas & Clásicos</option>
                    <option value="Gothic & Airbrush">Gothic & Airbrush</option>
                    <option value="Verano & Texturas">Verano & Texturas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Precio Promo (S/.)</label>
                  <input
                    type="number"
                    value={promoForm.price}
                    onChange={(e) =>
                      setPromoForm((p) => ({ ...p, price: Number(e.target.value) }))
                    }
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Image Input (File Upload or URL) */}
              <div>
                <label className="block font-semibold text-[#48372A] mb-1">
                  Imagen del Diseño (URL o Subir Archivo) *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    placeholder="https://... o sube una imagen abajo"
                    value={promoForm.image}
                    onChange={(e) => setPromoForm((p) => ({ ...p, image: e.target.value }))}
                    className="flex-1 p-2 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  />
                  <label className="py-2 px-3 rounded-xl border border-[#D5C6B1] bg-[#F2ECE2] text-[#4A382A] text-xs font-semibold cursor-pointer hover:bg-[#EAE0D0] flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {promoForm.image && (
                  <div className="h-32 rounded-xl overflow-hidden border border-[#D5C6B1] bg-[#F0E9DF]">
                    <img
                      src={promoForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#48372A] mb-1">
                  ¿De qué se trata? (Descripción estética)
                </label>
                <textarea
                  rows={2}
                  value={promoForm.description}
                  onChange={(e) =>
                    setPromoForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#48372A] mb-1">
                  ¿Cómo se hace? (Paso a paso técnico)
                </label>
                <textarea
                  rows={3}
                  value={promoForm.technique}
                  onChange={(e) =>
                    setPromoForm((p) => ({ ...p, technique: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Sistema Sugerido</label>
                  <input
                    type="text"
                    value={promoForm.recommendedSystem}
                    onChange={(e) => setPromoForm((p) => ({ ...p, recommendedSystem: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Etiquetas (comas)</label>
                  <input
                    type="text"
                    value={promoForm.tags}
                    onChange={(e) => setPromoForm((p) => ({ ...p, tags: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promoForm.featured}
                    onChange={(e) =>
                      setPromoForm((p) => ({ ...p, featured: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-[#B89230]"
                  />
                  <span>Destacar en carrusel</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promoForm.active}
                    onChange={(e) =>
                      setPromoForm((p) => ({ ...p, active: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-[#B89230]"
                  />
                  <span>Visible en catálogo</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8DEC9] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddPromoModal(false)}
                  className="py-2 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#574334] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#39291E] hover:bg-[#231710] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#E6C665]" />
                  <span>{editingPromoId ? 'Guardar Modificación' : 'Grabar Diseño'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT APPOINTMENT (GRABAR & MODIFICAR CITAS) */}
      {/* ========================================================= */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E3D6C3] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8DEC9] bg-[#F5EFE6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C29D38]" />
                <h3 className="text-lg font-display font-bold text-[#302117]">
                  {editingAppointmentId ? 'Modificar Cita de la Agenda' : 'Grabar Nueva Cita en la Agenda'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAppointmentModal(false)}
                className="p-1.5 text-[#7A6655] hover:text-[#2E2017] rounded-lg hover:bg-[#EAE0D0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">
                    Nombre de la Clienta *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Luciana Morales"
                    value={appointmentForm.clientName}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, clientName: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">
                    Teléfono WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+51 987 654 321"
                    value={appointmentForm.clientPhone}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, clientPhone: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">
                    Instagram de la Clienta (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="@usuario"
                    value={appointmentForm.clientInstagram}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, clientInstagram: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Tipo de Servicio</label>
                  <select
                    value={appointmentForm.serviceType}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, serviceType: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  >
                    <option value="promotion">Promoción Catálogo (S/. 60)</option>
                    <option value="custom">Servicio Personalizado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#48372A] mb-1">
                  Detalle / Diseño Seleccionado
                </label>
                {appointmentForm.serviceType === 'promotion' ? (
                  <select
                    value={appointmentForm.promoDesignTitle}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, promoDesignTitle: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  >
                    {promoDesigns.map((d) => (
                      <option key={d.id} value={d.title}>
                        {d.title} ({d.collection})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Ej: Set Almendra Polygel con Lazos y Cristales"
                    value={appointmentForm.promoDesignTitle}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, promoDesignTitle: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Fecha de la Cita</label>
                  <input
                    type="date"
                    required
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Horario (Lima GMT -05)</label>
                  <select
                    value={appointmentForm.timeSlot}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, timeSlot: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="07:30 PM">07:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Modalidad</label>
                  <select
                    value={appointmentForm.locationType}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, locationType: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  >
                    <option value="studio">En Estudio (Surco)</option>
                    <option value="home">A Domicilio</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Estado de la Cita</label>
                  <select
                    value={appointmentForm.status}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, status: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs font-semibold"
                  >
                    <option value="pending_deposit">Esperando Adelanto</option>
                    <option value="confirmed">Confirmada (Adelanto OK)</option>
                    <option value="completed">Atendida</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>

              {appointmentForm.locationType === 'home' && (
                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Dirección a Domicilio</label>
                  <input
                    type="text"
                    placeholder="Distrito, Calle, Número y Referencia"
                    value={appointmentForm.homeAddress}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, homeAddress: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Total (S/.)</label>
                  <input
                    type="number"
                    value={appointmentForm.totalPrice}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, totalPrice: Number(e.target.value) }))}
                    className="w-full p-2 rounded-xl border border-[#DDD1BF] bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Adelanto (S/.)</label>
                  <input
                    type="number"
                    value={appointmentForm.depositRequired}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, depositRequired: Number(e.target.value) }))}
                    className="w-full p-2 rounded-xl border border-[#DDD1BF] bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#48372A] mb-1">Medio Adelanto</label>
                  <select
                    value={appointmentForm.paymentMethod}
                    onChange={(e) => setAppointmentForm((p) => ({ ...p, paymentMethod: e.target.value as any }))}
                    className="w-full p-2 rounded-xl border border-[#DDD1BF] bg-white text-xs uppercase"
                  >
                    <option value="yape">Yape</option>
                    <option value="plin">Plin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="depositPaidCheck"
                  checked={appointmentForm.depositPaid}
                  onChange={(e) => setAppointmentForm((p) => ({ ...p, depositPaid: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#B89230]"
                />
                <label htmlFor="depositPaidCheck" className="text-xs font-semibold text-[#302117] cursor-pointer">
                  Adelanto verificado y recibido en cuenta bancaria
                </label>
              </div>

              <div>
                <label className="block font-semibold text-[#48372A] mb-1">
                  Notas Especiales de la Clienta
                </label>
                <textarea
                  rows={2}
                  placeholder="Preferencias de color, diseño previo, requerimientos especiales..."
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs"
                />
              </div>

              <div className="pt-4 border-t border-[#E8DEC9] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="py-2 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#574334] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#39291E] hover:bg-[#231710] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#E6C665]" />
                  <span>{editingAppointmentId ? 'Guardar Modificación de Cita' : 'Grabar Cita en Agenda'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: IN-APP CONFIRMATION MODAL (ELIMINAR SEGURO) */}
      {/* ========================================================= */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#E3D6C3] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h4 className="text-base font-display font-bold text-[#302117]">
              Confirmar Acción
            </h4>

            <p className="text-xs text-[#6F5B4D] leading-relaxed">
              {deleteConfirmation.title}
            </p>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="py-2 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#574334] hover:bg-[#F2ECE2] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="py-2 px-5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, Continuar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
