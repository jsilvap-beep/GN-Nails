import React from 'react';
import { useApp } from '../context/AppContext';
import { NAIL_SHAPES, NAIL_LENGTHS } from '../data/catalogData';
import { GabeeLogo } from './GabeeLogo';
import { X, Sparkles, Layers, Ruler } from 'lucide-react';

export const GuideModal: React.FC = () => {
  const { showGuideModal, setShowGuideModal, setCurrentView } = useApp();

  if (!showGuideModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF7F2] border border-[#E3D6C3] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8DEC9] bg-[#F5EFE6] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <GabeeLogo size="sm" />
            <div>
              <span className="text-[10px] font-brand uppercase tracking-widest text-[#947D68]">
                Página 03 del Catálogo
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#322319] tracking-tight">
                Guía para Saber Explicar tu Servicio
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowGuideModal(false)}
            className="p-2 text-[#7C6755] hover:text-[#2E2017] rounded-full hover:bg-[#EAE0D0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#523F32]">
          {/* Seccion 1: Diseño */}
          <div>
            <div className="flex items-center gap-2 text-sm font-display font-bold text-[#302117] mb-2 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#C29D38]" />
              <span>1. Diseño (3 Categorías Oficiales)</span>
            </div>
            <p className="text-[#645244] leading-relaxed mb-3">
              "Hay muchos diseños dentro del mundo de las uñas, desde los más elaborados hasta los más sencillos, por eso yo los divido en 3 categorías:"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-[#E4D7C4] shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm text-[#38261A]">Sencillo (S)</h4>
                  <span className="text-[10px] font-semibold text-[#826952] bg-[#F5EFE5] px-2 py-0.5 rounded">Básico</span>
                </div>
                <p className="text-[11px] text-[#695647] leading-relaxed">
                  Color sólido, francesa minimalista, un solo tono, detalles limpios y discretos. Rápido y elegante.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#D4AF37]/50 shadow-xs relative">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm text-[#38261A]">Moderado (M)</h4>
                  <span className="text-[10px] font-bold text-[#8A6115] bg-[#F7E7C4] px-2 py-0.5 rounded">En Promoción S/. 60</span>
                </div>
                <p className="text-[11px] text-[#695647] leading-relaxed">
                  Lazos coquette, flores botánicas a mano alzada, efecto cat-eye, degradé aura, líneas cromadas. <em>(Todos los diseños de la promo están en este nivel).</em>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4D7C4] shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm text-[#38261A]">Complejo (C)</h4>
                  <span className="text-[10px] font-semibold text-[#735C48] bg-[#F5EFE5] px-2 py-0.5 rounded">3D Art</span>
                </div>
                <p className="text-[11px] text-[#695647] leading-relaxed">
                  Esculpidos 3D extremos, relieves acrílicos, pedrería Swarovski masiva, personajes a mano alzada, multilayers Y2K.
                </p>
              </div>
            </div>
          </div>

          {/* Seccion 2: Tamaño */}
          <div className="pt-4 border-t border-[#EAE0D0]">
            <div className="flex items-center gap-2 text-sm font-display font-bold text-[#302117] mb-2 uppercase tracking-wide">
              <Ruler className="w-4 h-4 text-[#C29D38]" />
              <span>2. Tamaño (Qué tan largas deseas tus uñas)</span>
            </div>
            <p className="text-[#645244] leading-relaxed mb-3">
              "El tamaño significa qué tan largas deseas tus uñas. En la promoción está incluido hasta el #3:"
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {NAIL_LENGTHS.map((len) => (
                <div
                  key={len.id}
                  className={`p-3 rounded-xl border text-center ${
                    len.code === 'S' || len.code === 'M'
                      ? 'bg-[#FAF4EB] border-[#D8C7B0]'
                      : 'bg-white border-[#E8DFC9]'
                  }`}
                >
                  <span className="block font-bold text-base text-[#38261A] font-display">
                    {len.code}
                  </span>
                  <span className="block text-[11px] font-semibold text-[#8B6E57]">
                    {len.range}
                  </span>
                  <span className="block text-[10px] text-[#715D4C] mt-1">
                    {len.extraCost === 0 ? 'Incluido' : `+ S/. ${len.extraCost}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seccion 3: Forma */}
          <div className="pt-4 border-t border-[#EAE0D0]">
            <div className="flex items-center gap-2 text-sm font-display font-bold text-[#302117] mb-2 uppercase tracking-wide">
              <Layers className="w-4 h-4 text-[#C29D38]" />
              <span>3. Forma (Cómo deseas que se vean las puntas)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {NAIL_SHAPES.map((shape) => (
                <div key={shape.id} className="p-3.5 rounded-xl bg-white border border-[#E8DFC9]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#302016]">{shape.name}</span>
                    <span className="text-[10px] font-medium text-[#7C634F]">
                      {shape.extraCost === 0 ? 'Sin recargo' : `+ S/. ${shape.extraCost}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E5A4B]">{shape.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DEC9] bg-[#F7F2EA] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowGuideModal(false)}
            className="py-2.5 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#574334] hover:bg-[#EBE2D4] cursor-pointer"
          >
            Cerrar Guía
          </button>
          <button
            type="button"
            onClick={() => {
              setShowGuideModal(false);
              setCurrentView('custom');
            }}
            className="py-2.5 px-5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Probar en Configurador 3D</span>
          </button>
        </div>
      </div>
    </div>
  );
};
