import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GabeeLogo } from './GabeeLogo';
import { Sparkles, Calendar, ShieldCheck, Menu, X, Lock, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isAdmin,
    setIsAdmin,
    setShowTermsModal,
    setShowGuideModal,
    openBooking,
    settings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setCurrentView('home');
    } else {
      setShowPinModal(true);
      setPinInput('');
      setPinError(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === '1234') {
      setIsAdmin(true);
      setShowPinModal(false);
      setCurrentView('admin');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      {/* Top Bar Contract (3 Zones, gap-8) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE2D5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark with Official Crowned Bee Logo */}
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          >
            <GabeeLogo size="sm" showSubtitle={false} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold tracking-tight text-[#34271E] leading-tight">
                {settings.studioName}
              </span>
              <span className="text-[10px] tracking-widest uppercase font-brand text-[#9B8066] -mt-0.5">
                Tendencia 2026
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line, clean unboxed text) */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#655243]">
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className={`hover:text-[#2E2017] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'home' ? 'text-[#2E2017] font-semibold underline underline-offset-6 decoration-[#C29D38]' : ''
              }`}
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('promotions')}
              className={`hover:text-[#2E2017] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'promotions' ? 'text-[#2E2017] font-semibold underline underline-offset-6 decoration-[#C29D38]' : ''
              }`}
            >
              Promociones <span className="text-[#B38728] text-xs font-semibold font-mono">(S/. 60)</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('custom')}
              className={`hover:text-[#2E2017] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'custom' ? 'text-[#2E2017] font-semibold underline underline-offset-6 decoration-[#C29D38]' : ''
              }`}
            >
              Servicio Personalizado
            </button>
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="hover:text-[#2E2017] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-[#796352]"
            >
              Términos & Condiciones
            </button>
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="hover:text-[#2E2017] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-[#796352]"
            >
              Guía de Medidas
            </button>
          </nav>

          {/* Zone 3: Single Primary Action & Admin Mode Switch */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Admin Switcher */}
            <button
              type="button"
              onClick={handleAdminToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isAdmin
                  ? 'bg-[#38281F] text-[#FAF7F2] border-[#38281F] shadow-xs'
                  : 'bg-white/80 text-[#7C634F] border-[#E0D4C3] hover:bg-white hover:text-[#38281F]'
              }`}
              title={isAdmin ? "Estás en Modo Administrador" : "Acceder como Administrador"}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E6C665]" />
                  <span>Modo Admin Activo</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#9B826B]" />
                  <span>Acceso Admin</span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setCurrentView('admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#533D2D] hover:bg-[#3D2C20] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Panel Administrador
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openBooking('promotion')}
                className="px-4 py-2 rounded-lg bg-[#3C2D22] hover:bg-[#2A1E16] text-[#FAF7F2] text-xs font-medium shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E7C66A]" />
                <span>Agendar Cita</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#5A4537] hover:text-[#2E2017] cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE2D5] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#5E4B3E]">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg ${currentView === 'home' ? 'bg-[#EFE8DD] text-[#2E2017] font-semibold' : ''}`}
              >
                Inicio
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('promotions');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg flex items-center justify-between ${currentView === 'promotions' ? 'bg-[#EFE8DD] text-[#2E2017] font-semibold' : ''}`}
              >
                <span>Promociones del Catálogo</span>
                <span className="text-xs font-bold text-[#A87B20] bg-[#F7EACD] px-2 py-0.5 rounded">S/. 60</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('custom');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg ${currentView === 'custom' ? 'bg-[#EFE8DD] text-[#2E2017] font-semibold' : ''}`}
              >
                Servicio Personalizado
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTermsModal(true);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F2ECE2]"
              >
                Términos y Condiciones (PDF)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowGuideModal(true);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#F2ECE2]"
              >
                Guía de Medidas y Formas (PDF)
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg bg-[#443124] text-white font-medium"
                >
                  Panel de Administrador
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-[#EAE2D5] flex gap-2">
              <button
                type="button"
                onClick={() => {
                  openBooking('promotion');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#3C2D22] text-[#FAF7F2] text-xs font-semibold text-center flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#E7C66A]" />
                <span>Agendar Cita en Promoción</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Admin PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E3D7C5] rounded-2xl max-w-sm w-full p-6 shadow-xl relative">
            <button
              type="button"
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#887463] hover:text-[#38281F] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-11 h-11 rounded-full bg-[#EFE6D8] border border-[#DFCBB5] flex items-center justify-center text-[#58412F] mb-3">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-display font-bold text-[#36271D]">Acceso Administrador</h3>
            <p className="text-xs text-[#7A6655] mt-1 mb-4">
              Ingresa el PIN de seguridad para gestionar citas, subir nuevos diseños y modificar tarifas.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5C493B] mb-1">
                  Código PIN (Por defecto: 1234)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-center text-lg tracking-widest font-mono rounded-lg border border-[#D9CCB9] bg-white text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#C29D38]"
                />
                {pinError && (
                  <p className="text-xs text-rose-700 mt-1.5 text-center font-medium">
                    PIN incorrecto. Intenta con 1234.
                  </p>
                )}
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#DACDBB] text-xs font-medium text-[#6B5747] hover:bg-[#F2ECE2] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-lg bg-[#3C2D22] text-[#FAF7F2] text-xs font-medium hover:bg-[#271B13] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#E7C66A]" />
                  <span>Ingresar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
