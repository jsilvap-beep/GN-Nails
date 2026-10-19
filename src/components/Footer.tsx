import React from 'react';
import { useApp } from '../context/AppContext';
import { GabeeLogo } from './GabeeLogo';
import { ShieldCheck, Instagram, MessageCircle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setShowTermsModal, setShowGuideModal, settings, setIsAdmin } = useApp();

  return (
    <footer className="bg-[#241A13] text-[#D8CEBE] border-t border-[#3B2D22] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Studio Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <GabeeLogo size="sm" variant="dark" />
            </div>
            <p className="text-xs text-[#A89886] leading-relaxed">
              Estudio exclusivo de nail art en Lima, Perú. Especialistas en Softgel, Polygel y Builder Gel con diseños en tendencia 2026.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/gabeenailsart"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#34271D] hover:bg-[#48372A] flex items-center justify-center text-[#E6C665] transition-colors"
                title="Instagram @gabeenailsart"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#34271D] hover:bg-[#48372A] flex items-center justify-center text-emerald-400 transition-colors"
                title="WhatsApp Directo"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Secciones */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-semibold text-sm text-[#F7F2EA] font-display uppercase tracking-wider mb-1">
              Navegación
            </h4>
            <div>
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="hover:text-white transition-colors cursor-pointer text-[#B6A795]"
              >
                Inicio y Portada
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setCurrentView('promotions')}
                className="hover:text-white transition-colors cursor-pointer text-[#B6A795]"
              >
                Catálogo Promociones (S/. {settings.defaultPromoPrice})
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setCurrentView('custom')}
                className="hover:text-white transition-colors cursor-pointer text-[#B6A795]"
              >
                Servicio Personalizado & 3D
              </button>
            </div>
          </div>

          {/* Col 3: Políticas del Catálogo */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-semibold text-sm text-[#F7F2EA] font-display uppercase tracking-wider mb-1">
              Políticas del Servicio
            </h4>
            <div>
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="hover:text-white transition-colors cursor-pointer text-[#B6A795]"
              >
                Términos y Condiciones (PDF)
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="hover:text-white transition-colors cursor-pointer text-[#B6A795]"
              >
                Guía de Medidas y Formas (PDF)
              </button>
            </div>
            <div className="text-[11px] text-[#8E7E6E] pt-1 leading-relaxed">
              Adelanto de S/. {settings.defaultDepositAmount} por Yape o Plin obligatorio para separar cupo.
            </div>
          </div>

          {/* Col 4: Atención & Ubicación */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-semibold text-sm text-[#F7F2EA] font-display uppercase tracking-wider mb-1">
              Atención en Lima
            </h4>
            <p className="text-[#B6A795]">
              Surco, Lima, Perú / Servicio a Domicilio disponible.
            </p>
            <p className="text-[11px] text-[#918171]">
              Zona Horaria: {settings.timezone}
            </p>
            <p className="text-[11px] text-[#918171]">
              WhatsApp: {settings.whatsappNumber}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#34271D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A7969]">
          <p>© 2026 {settings.studioName}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado con pasión por el arte de las uñas
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
