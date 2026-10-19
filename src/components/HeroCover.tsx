import React from 'react';
import { useApp } from '../context/AppContext';
import { GabeeLogo } from './GabeeLogo';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Clock, CreditCard, ChevronRight } from 'lucide-react';

export const HeroCover: React.FC = () => {
  const { setCurrentView, openBooking, setShowTermsModal, setShowGuideModal, settings } = useApp();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2]">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#DFBA68]/15 via-[#F2CFC7]/20 to-[#EAD6C9]/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Cover Presentation Header (Replicating Page 1 PDF) */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          {/* Official Crowned Bee Golden Logo */}
          <div className="mb-6">
            <GabeeLogo size="lg" showSubtitle={true} className="hover:scale-105 transition-transform" />
          </div>

          {/* Headline requested: "Tus Manos en las Mejores Manos" */}
          <div className="relative py-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-[#322319] tracking-tight [text-wrap:balance]">
              Tus Manos en las Mejores Manos
            </h1>
            <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#C29D38] to-transparent mx-auto mt-3" />
          </div>

          {/* Subtitle requested: "TENDENCIA 2026" */}
          <p className="text-base sm:text-xl font-brand font-semibold tracking-widest uppercase text-[#96752C] mt-2">
            Tendencia 2026
          </p>

          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#8A7563]">
            <span>Lima, Perú</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://instagram.com/gabeenailsart"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#2A1D15] underline decoration-[#D4AF37] font-medium"
            >
              {settings.instagram}
            </a>
            <span aria-hidden="true">·</span>
            <span>GMT -05:00</span>
          </div>
        </div>

        {/* 2 Major Service Pillars (Rubros Principales) Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-14">
          {/* Rubro 1: Sección de Promociones (Foco Principal del Catálogo) */}
          <div className="group relative rounded-3xl bg-[#FFFDF9] border border-[#E5DAC9] p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden neon-gold-border">
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-2">
              <span className="inline-block bg-[#3B2C21] text-[#FAF7F2] text-[11px] font-semibold tracking-wider uppercase py-1.5 px-4 rounded-bl-xl shadow-xs">
                Tarifa Fija S/. 60
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#A07722] mb-3">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="uppercase tracking-wider">Rubro 01 · Tendencias 2026</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2E2017] mb-3">
                Sección Promociones
              </h2>

              <p className="text-sm text-[#6C594A] leading-relaxed mb-6">
                Todos los diseños fotográficos del catálogo incluidos en tarifa promocional. Nivel moderado con la más alta técnica de manicura rusa y productos profesionales.
              </p>

              {/* Promo Key Rules List */}
              <div className="space-y-2.5 mb-7 text-xs text-[#5D4A3D]">
                <div className="flex items-start gap-2">
                  <span className="text-[#A07722] font-bold">✓</span>
                  <span><strong>Sistema a elección:</strong> Softgel, Polygel o Builder Gel recomendado según tu lámina ungueal.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#A07722] font-bold">✓</span>
                  <span><strong>Tamaño incluido:</strong> Válido hasta número #3 (S y M).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#A07722] font-bold">✓</span>
                  <span><strong>Formas sin costo extra:</strong> Almendra, Cuadrada, Coffin u Ovalada.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#A07722] font-bold">✓</span>
                  <span><strong>Separación formal:</strong> S/. 20 de adelanto por Yape o Plin.</span>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-[#EFE7DC] flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('promotions')}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-[#3B2C21] hover:bg-[#251A13] text-[#FAF7F2] text-xs font-semibold tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explorar Galería de Diseños</span>
                <ArrowRight className="w-4 h-4 text-[#E6C665]" />
              </button>

              <button
                type="button"
                onClick={() => openBooking('promotion')}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#F0E6D6] hover:bg-[#E5DAC8] text-[#413125] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#A07722]" />
                <span>Agendar Promo</span>
              </button>
            </div>
          </div>

          {/* Rubro 2: Sección de Servicio Personalizado */}
          <div className="group relative rounded-3xl bg-[#FAF7F2] border border-[#E0D4C2] p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#8B6E57] mb-3">
                <span className="text-[#8B6E57] font-serif">✦</span>
                <span className="uppercase tracking-wider">Rubro 02 · Configuración a Medida</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2E2017] mb-3">
                Servicio Personalizado
              </h2>

              <p className="text-sm text-[#6C594A] leading-relaxed mb-6">
                Crea tu set soñado seleccionando cada detalle: complejidad del diseño, longitud extrema de #0 a #10, forma con visor 3D interactivo y subida de fotos de referencia.
              </p>

              {/* Custom Key Rules List */}
              <div className="space-y-2.5 mb-7 text-xs text-[#5D4A3D]">
                <div className="flex items-start gap-2">
                  <span className="text-[#8B6E57] font-bold">1.</span>
                  <span><strong>3 Niveles de Diseño:</strong> Básico (S/. 50), Moderado (S/. 65) o Complejo / 3D (S/. 85).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#8B6E57] font-bold">2.</span>
                  <span><strong>Visor 3D en Vivo:</strong> Elige puntas Stiletto, Coffin, Almendra y visualiza el acabado.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#8B6E57] font-bold">3.</span>
                  <span><strong>Longitudes especiales:</strong> De corto natural hasta XL (#6-#7) y XXL (#8-#10).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#8B6E57] font-bold">4.</span>
                  <span><strong>Adicionales disponibles:</strong> Cristales Swarovski, retiro de set anterior o servicio a domicilio.</span>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-[#EAE0D1] flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('custom')}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-white hover:bg-[#F3ECE2] text-[#34241A] text-xs font-semibold border border-[#DCD0BE] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Configurar Set Personalizado (3D)</span>
                <ChevronRight className="w-4 h-4 text-[#8B6E57]" />
              </button>

              <button
                type="button"
                onClick={() => openBooking('custom')}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#523F31] hover:bg-[#3D2E23] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E6C665]" />
                <span>Agendar Cita</span>
              </button>
            </div>
          </div>
        </div>

        {/* Studio Highlights Bar */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-[#E7DDCE] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#5C493B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F3ECE0] flex items-center justify-center text-[#8C6D45] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[#2D2017]">Zona Horaria GMT -05</p>
              <p className="text-[#7F6B5C]">Horarios exactos de Lima y Bogotá</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F3ECE0] flex items-center justify-center text-[#8C6D45] shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[#2D2017]">Adelanto S/. 20 Yape / Plin</p>
              <p className="text-[#7F6B5C]">Garantía de reserva formal inmediata</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F3ECE0] flex items-center justify-center text-[#8C6D45] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[#2D2017]">Higiene & Esterilización</p>
              <p className="text-[#7F6B5C]">Instrumental embolsado de grado médico</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F3ECE0] flex items-center justify-center text-[#8C6D45] shrink-0">
              <span className="text-base">📍</span>
            </div>
            <div>
              <p className="font-semibold text-[#2D2017]">Estudio & A Domicilio</p>
              <p className="text-[#7F6B5C]">Surco, Lima o en la comodidad de tu hogar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
