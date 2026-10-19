import React from 'react';
import { useApp } from '../context/AppContext';
import { TERMS_AND_CONDITIONS } from '../data/catalogData';
import { GabeeLogo } from './GabeeLogo';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const TermsModal: React.FC = () => {
  const { showTermsModal, setShowTermsModal, openBooking } = useApp();

  if (!showTermsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF7F2] border border-[#E3D6C3] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header (Page 2 PDF Styling) */}
        <div className="px-6 py-5 border-b border-[#E8DEC9] bg-[#F5EFE6] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <GabeeLogo size="sm" />
            <div>
              <span className="text-[10px] font-brand uppercase tracking-widest text-[#947D68]">
                Catálogo Oficial · Gabee Nail Art
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#322319] tracking-tight">
                Términos y Condiciones
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowTermsModal(false)}
            className="p-2 text-[#7C6755] hover:text-[#2E2017] rounded-full hover:bg-[#EAE0D0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#523F32]">
          <div className="p-3.5 rounded-xl bg-[#F4EFE6] border border-[#DECDB8] flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-[#C29D38] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Por favor, lee con detenimiento cada una de las condiciones antes de agendar tu cita. Al transferir tu adelanto de <strong>S/. 20 soles</strong>, se entiende la total aceptación de estas pautas.
            </p>
          </div>

          <div className="space-y-3.5">
            {TERMS_AND_CONDITIONS.map((term, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white border border-[#EBE2D5] shadow-2xs hover:border-[#DCCDBA] transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-sm text-[#2F2117] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#EFE7D8] text-[#7A614B] font-mono text-[11px] flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span>{term.title}</span>
                  </h4>
                  <span className="text-[10px] font-medium text-[#8F7254] bg-[#F4EFE6] px-2.5 py-0.5 rounded-full border border-[#DFD1BE]">
                    {term.badge}
                  </span>
                </div>
                <p className="text-[#645244] leading-relaxed pl-7">
                  {term.description}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-[11px] text-[#86715F]">
            Dudas adicionales preguntar directamente a nuestro WhatsApp o Instagram @gabeenailsart
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DEC9] bg-[#F7F2EA] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowTermsModal(false)}
            className="py-2.5 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#574334] hover:bg-[#EBE2D4] cursor-pointer"
          >
            Entendido, cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTermsModal(false);
              openBooking('promotion');
            }}
            className="py-2.5 px-5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E6C665]" />
            <span>Acepto y deseo Agendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
