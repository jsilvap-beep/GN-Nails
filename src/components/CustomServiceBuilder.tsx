import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NailViewer3D } from './NailViewer3D';
import { NAIL_SHAPES, NAIL_LENGTHS, NAIL_SYSTEMS } from '../data/catalogData';
import { DesignLevel } from '../types';
import {
  Sparkles,
  Calendar,
  Layers,
  Ruler,
  Check,
  Upload,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const CustomServiceBuilder: React.FC = () => {
  const { customConfig, setCustomConfig, resetCustomConfig, openBooking, settings } = useApp();
  const [activeFinish, setActiveFinish] = useState<'pink_glaze' | 'chrome_silver' | 'gold_liquid' | 'ruby_aura' | 'nude' | 'sage_matcha'>('pink_glaze');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const selectedLength = NAIL_LENGTHS.find((l) => l.id === customConfig.lengthId) || NAIL_LENGTHS[1];
  const selectedShape = NAIL_SHAPES.find((s) => s.id === customConfig.shape) || NAIL_SHAPES[0];

  const handleLevelSelect = (level: DesignLevel) => {
    setCustomConfig((prev) => ({ ...prev, level }));
  };

  const handleShapeSelect = (shapeId: string) => {
    const isStiletto = shapeId === 'stiletto';
    setCustomConfig((prev) => ({
      ...prev,
      shape: shapeId,
      addons: {
        ...prev.addons,
        stilettoShape: isStiletto,
      },
    }));
  };

  const handleLengthSelect = (lengthId: string) => {
    setCustomConfig((prev) => ({ ...prev, lengthId }));
  };

  const handleSystemSelect = (systemId: string) => {
    setCustomConfig((prev) => ({ ...prev, system: systemId }));
  };

  const toggleAddon = (key: keyof typeof customConfig.addons) => {
    setCustomConfig((prev) => ({
      ...prev,
      addons: {
        ...prev.addons,
        [key]: !prev.addons[key],
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setCustomConfig((prev) => ({ ...prev, referenceImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#EAE1D3]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9C7954] mb-2 font-brand">
              <span className="text-[#8B6E57] font-serif">✦</span>
              <span>Rubro 02 · Configuración a Medida</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#2F2117] tracking-tight">
              Servicio Personalizado
            </h2>
            <p className="text-xs sm:text-sm text-[#725F4F] mt-1 max-w-2xl">
              Diseña tu set único desde cero. Selecciona el nivel de complejidad del arte, sistema de gel o acrílico, largo y visualiza la forma en nuestro <strong>estudio 3D interactivo</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetCustomConfig}
              className="p-2.5 rounded-xl border border-[#D5C6B1] text-[#786453] hover:text-[#2F2117] hover:bg-[#F0E8DC] transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Restablecer configuración"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>

            <button
              type="button"
              onClick={() => openBooking('custom')}
              className="px-5 py-2.5 rounded-xl bg-[#3B2B20] hover:bg-[#251A13] text-[#FAF7F2] text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E6C665]" />
              <span>Agendar este Set</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Configurator Left, 3D Studio & Summary Sticky Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Options (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Design Level Selection (3 Levels as required) */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7DDCE] shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-display font-bold text-[#2E2017]">
                    1. Nivel de Complejidad del Diseño
                  </h3>
                  <p className="text-xs text-[#7B6756] mt-0.5">
                    Clasificación oficial según el tiempo y técnica requerida.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    id: 'sencillo' as DesignLevel,
                    title: 'Básico (S)',
                    subtitle: 'Esmaltado liso o francés minimalista',
                    price: settings.levelBasicPrice,
                    badge: 'Rápido',
                  },
                  {
                    id: 'moderado' as DesignLevel,
                    title: 'Moderado (M)',
                    subtitle: 'Flores a mano alzada, lazos, cat-eye',
                    price: settings.levelModeratePrice,
                    badge: 'Popular',
                  },
                  {
                    id: 'complejo' as DesignLevel,
                    title: 'Complejo (C)',
                    subtitle: 'Relieves 3D, cromo extremo, pedrería',
                    price: settings.levelComplexPrice,
                    badge: 'Editorial',
                  },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleLevelSelect(lvl.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      customConfig.level === lvl.id
                        ? 'border-[#B89230] bg-[#FDFBF7] ring-2 ring-[#D4AF37]/40 shadow-xs'
                        : 'border-[#EAE1D2] bg-white hover:border-[#D5C6B1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-[#302117]">{lvl.title}</span>
                      <span className="text-[10px] font-semibold text-[#8B6E57] bg-[#F3ECE1] px-2 py-0.5 rounded">
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#725F50] leading-relaxed mb-3">
                      {lvl.subtitle}
                    </p>
                    <div className="text-sm font-bold text-[#8C6B1C] font-mono">
                      S/. {lvl.price}.00
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: System Selection */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7DDCE] shadow-2xs">
              <h3 className="text-base font-display font-bold text-[#2E2017] mb-1">
                2. Sistema de Aplicación
              </h3>
              <p className="text-xs text-[#7B6756] mb-4">
                La profesional evaluará la salud de tu uña natural para confirmar el sistema óptimo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NAIL_SYSTEMS.map((sys) => (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => handleSystemSelect(sys.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      customConfig.system === sys.id
                        ? 'border-[#B89230] bg-[#FDFBF7] ring-1 ring-[#D4AF37]/50 shadow-2xs'
                        : 'border-[#EAE1D2] bg-white hover:border-[#D5C6B1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#302117]">{sys.name}</span>
                      {sys.extraCost > 0 && (
                        <span className="text-[10px] font-bold text-[#94742B] font-mono">
                          + S/. {sys.extraCost}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#725F50] leading-relaxed">
                      {sys.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Nail Shape & Length */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7DDCE] shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-display font-bold text-[#2E2017] mb-1">
                  3. Forma de la Uña
                </h3>
                <p className="text-xs text-[#7B6756] mb-3.5">
                  Visualízala en tiempo real en el visor 3D de la derecha.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {NAIL_SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => handleShapeSelect(shape.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        customConfig.shape === shape.id
                          ? 'border-[#B89230] bg-[#FDFBF7] ring-1 ring-[#D4AF37]/50 shadow-2xs font-bold text-[#2F2117]'
                          : 'border-[#EAE1D2] bg-white hover:border-[#D5C6B1] text-[#554234]'
                      }`}
                    >
                      <span className="text-xs block">{shape.name}</span>
                      <span className="text-[10px] text-[#86715F] block mt-0.5">
                        {shape.extraCost === 0 ? 'Sin recargo' : `+ S/. ${shape.extraCost}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EFE7DC]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#35251B]">
                    Largo de la Uña ({selectedLength.label})
                  </h4>
                  <span className="text-xs font-semibold text-[#8B6E57]">
                    Rango: {selectedLength.range}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {NAIL_LENGTHS.map((len) => (
                    <button
                      key={len.id}
                      type="button"
                      onClick={() => handleLengthSelect(len.id)}
                      className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                        customConfig.lengthId === len.id
                          ? 'border-[#B89230] bg-[#FAF5ED] ring-1 ring-[#D4AF37]/50 font-bold text-[#2E2017]'
                          : 'border-[#EAE1D2] bg-white text-[#635041] hover:border-[#D5C6B1]'
                      }`}
                    >
                      <span className="block text-sm font-display font-bold">{len.code}</span>
                      <span className="block text-[10px] text-[#8A7563] mt-0.5">{len.range}</span>
                      {len.extraCost > 0 && (
                        <span className="block text-[9px] text-[#9A7A30] font-mono mt-0.5">
                          +S/.{len.extraCost}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Adicionales y Cuidados */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7DDCE] shadow-2xs">
              <h3 className="text-base font-display font-bold text-[#2E2017] mb-1">
                4. Servicios Adicionales
              </h3>
              <p className="text-xs text-[#7B6756] mb-4">
                Selecciona complementos según las necesidades de tus uñas.
              </p>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAE1D2] bg-white hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={customConfig.addons.previousRemoval}
                      onChange={() => toggleAddon('previousRemoval')}
                      className="w-4 h-4 rounded text-[#B89230] focus:ring-[#D4AF37] border-[#D1C3B2]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#2F2117] block">
                        Retiro de set o esmalte anterior
                      </span>
                      <span className="text-[11px] text-[#7A6757]">
                        Retiro cuidadoso sin limado agresivo para preservar la queratina natural.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#8C6B1C] font-mono shrink-0 pl-2">
                    + S/. {settings.removalExtraCost}
                  </span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAE1D2] bg-white hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={customConfig.addons.rhinestones}
                      onChange={() => toggleAddon('rhinestones')}
                      className="w-4 h-4 rounded text-[#B89230] focus:ring-[#D4AF37] border-[#D1C3B2]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#2F2117] block">
                        Pedrería & Cristales Swarovski Adicionales
                      </span>
                      <span className="text-[11px] text-[#7A6757]">
                        Gemas facetadas, micro perlas o charms metálicos 3D asegurados con resina UV.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#8C6B1C] font-mono shrink-0 pl-2">
                    + S/. {settings.rhinestoneExtraCost}
                  </span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAE1D2] bg-white hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={customConfig.addons.homeService}
                      onChange={() => toggleAddon('homeService')}
                      className="w-4 h-4 rounded text-[#B89230] focus:ring-[#D4AF37] border-[#D1C3B2]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#2F2117] block">
                        Atención a Domicilio (Lima)
                      </span>
                      <span className="text-[11px] text-[#7A6757]">
                        Tarifa base de traslado en Lima metropolitana (puede variar según distancia exacta).
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#8C6B1C] font-mono shrink-0 pl-2">
                    + S/. {settings.homeServiceExtraCost}
                  </span>
                </label>
              </div>
            </div>

            {/* Step 5: Reference Image Upload or Notes */}
            <div className="p-6 rounded-3xl bg-white border border-[#E7DDCE] shadow-2xs">
              <h3 className="text-base font-display font-bold text-[#2E2017] mb-1">
                5. Foto de Referencia o Idea Especial
              </h3>
              <p className="text-xs text-[#7B6756] mb-4">
                Si viste un diseño en Pinterest o Instagram, adjúntalo para prepararlo con anticipación.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex-1 border-2 border-dashed border-[#DCD0BE] hover:border-[#B89230] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#FAF7F2]">
                    <Upload className="w-5 h-5 text-[#8F745B] mx-auto mb-1.5" />
                    <span className="text-xs font-semibold text-[#302117] block">
                      Subir foto de referencia
                    </span>
                    <span className="text-[10px] text-[#8A7563]">
                      Formatos JPG, PNG (Captura de pantalla o foto)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {photoPreview && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#D5C6B1] shrink-0">
                      <img
                        src={photoPreview}
                        alt="Referencia"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setCustomConfig((prev) => ({ ...prev, referenceImage: undefined }));
                        }}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <textarea
                  placeholder="Describe colores preferidos, ocasión especial o cualquier detalle que desees..."
                  value={customConfig.customNotes || ''}
                  onChange={(e) =>
                    setCustomConfig((prev) => ({ ...prev, customNotes: e.target.value }))
                  }
                  rows={2}
                  className="w-full p-3 rounded-xl border border-[#DDD1BF] bg-[#FAF7F2] text-xs text-[#2F2016] placeholder:text-[#9A8676] focus:outline-none focus:ring-2 focus:ring-[#C29D38]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: 3D Studio & Live Quote Box (5 Cols, Sticky) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* 3D Nail Viewer */}
            <div className="rounded-3xl bg-white border border-[#E5DAC8] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#35251B]">
                  Simulador de Forma & Largo 3D
                </span>
                <span className="text-[11px] font-semibold text-[#8C6B1C] font-mono">
                  {selectedShape.name} ({selectedLength.code})
                </span>
              </div>

              <NailViewer3D
                shape={customConfig.shape}
                lengthCode={selectedLength.code}
                finish={activeFinish}
                onShapeChange={(s) => handleShapeSelect(s)}
                className="w-full"
              />
            </div>

            {/* Live Price Summary Box */}
            <div className="rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE6] border-2 border-[#D4AF37]/45 p-6 shadow-md neon-gold-border">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D1]">
                <div>
                  <span className="text-[10px] font-brand uppercase tracking-widest text-[#947D68]">
                    Cotización en Vivo
                  </span>
                  <h4 className="text-xl font-display font-bold text-[#302117]">
                    Resumen del Set
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#7C6856] block">Total Estimado</span>
                  <span className="text-2xl font-bold font-mono text-[#8C6B1C]">
                    S/. {customConfig.calculatedPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="py-4 space-y-2 text-xs text-[#5D4A3D] border-b border-[#EAE0D1]">
                <div className="flex justify-between">
                  <span>Nivel {customConfig.level.toUpperCase()}:</span>
                  <span className="font-mono font-medium">
                    S/.{' '}
                    {customConfig.level === 'sencillo'
                      ? settings.levelBasicPrice
                      : customConfig.level === 'moderado'
                      ? settings.levelModeratePrice
                      : settings.levelComplexPrice}
                    .00
                  </span>
                </div>

                <div className="flex justify-between text-[#786454]">
                  <span>Forma: {selectedShape.name}</span>
                  <span className="font-mono">
                    {selectedShape.extraCost > 0 ? `+ S/. ${selectedShape.extraCost}.00` : 'S/. 0.00'}
                  </span>
                </div>

                <div className="flex justify-between text-[#786454]">
                  <span>Largo: {selectedLength.label}</span>
                  <span className="font-mono">
                    {selectedLength.extraCost > 0 ? `+ S/. ${selectedLength.extraCost}.00` : 'S/. 0.00'}
                  </span>
                </div>

                {customConfig.addons.previousRemoval && (
                  <div className="flex justify-between text-[#786454]">
                    <span>Retiro previo:</span>
                    <span className="font-mono">+ S/. {settings.removalExtraCost}.00</span>
                  </div>
                )}

                {customConfig.addons.rhinestones && (
                  <div className="flex justify-between text-[#786454]">
                    <span>Pedrería / Cristales:</span>
                    <span className="font-mono">+ S/. {settings.rhinestoneExtraCost}.00</span>
                  </div>
                )}

                {customConfig.addons.homeService && (
                  <div className="flex justify-between text-[#786454]">
                    <span>Servicio a domicilio:</span>
                    <span className="font-mono">+ S/. {settings.homeServiceExtraCost}.00</span>
                  </div>
                )}
              </div>

              {/* Deposit Required Highlight */}
              <div className="pt-4 pb-5 space-y-2">
                <div className="p-3 rounded-xl bg-[#F4EFE6] border border-[#DFCBB5] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#322319] block">Adelanto para Separar Cita:</span>
                    <span className="text-[10px] text-[#786454]">Vía Yape o Plin</span>
                  </div>
                  <span className="text-base font-bold font-mono text-[#8C6B1C]">
                    S/. {settings.defaultDepositAmount}.00
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-[#7A6655] px-1">
                  <span>Saldo a pagar el día de la cita:</span>
                  <span className="font-mono font-semibold text-[#322319]">
                    S/. {(customConfig.calculatedPrice - settings.defaultDepositAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* CTA Booking Button */}
              <button
                type="button"
                onClick={() => openBooking('custom')}
                className="w-full py-3.5 px-5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-[#FAF7F2] text-xs font-semibold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#E6C665]" />
                <span>Continuar y Agendar Día & Hora</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
