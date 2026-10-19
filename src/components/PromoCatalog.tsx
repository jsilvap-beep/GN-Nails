import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PromoDesign } from '../types';
import {
  Search,
  Sparkles,
  Calendar,
  Info,
  Clock,
  Layers,
  Check,
  ChevronRight,
  ArrowRight,
  X,
} from 'lucide-react';

export const PromoCatalog: React.FC = () => {
  const {
    promoDesigns,
    openBooking,
    selectedPromoForDetails,
    setSelectedPromoForDetails,
    settings,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(promoDesigns.map((d) => d.collection)));
    return ['Todas', ...list];
  }, [promoDesigns]);

  // Filtered designs
  const filteredDesigns = useMemo(() => {
    return promoDesigns.filter((d) => {
      if (!d.active) return false;
      const matchesCategory =
        activeCategory === 'Todas' || d.collection === activeCategory;
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [promoDesigns, activeCategory, searchQuery]);

  // Featured designs for trending carousel
  const featuredTrends = useMemo(() => {
    return promoDesigns.filter((d) => d.featured && d.active);
  }, [promoDesigns]);

  return (
    <section className="py-12 lg:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#EAE1D3]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9C7954] mb-2 font-brand">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Tendencia 2026 · Diseños Oficiales</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#2F2117] tracking-tight">
              Sección Promociones
            </h2>
            <p className="text-xs sm:text-sm text-[#725F4F] mt-1 max-w-2xl">
              Todos los diseños de esta sección se realizan en nivel de diseño <strong>Moderado</strong> a la tarifa fija promocional de <strong className="text-[#966E19] font-mono">S/. {settings.defaultPromoPrice} soles</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#7F6B5A]">
              Adelanto: <strong className="text-[#322319] font-mono">S/. {settings.defaultDepositAmount}</strong> por Yape/Plin
            </span>
            <button
              type="button"
              onClick={() => openBooking('promotion')}
              className="px-5 py-2.5 rounded-xl bg-[#3B2B20] hover:bg-[#251A13] text-[#FAF7F2] text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E6C665]" />
              <span>Agendar en Promoción</span>
            </button>
          </div>
        </div>

        {/* Dynamic Carousel / Spotlight of 2026 Trending Designs */}
        {featuredTrends.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-[#35261C] flex items-center gap-2">
                <span>Tendencias Destacadas 2026</span>
                <span className="text-[11px] font-normal text-[#8A7563] italic">
                  (Inspiración del Catálogo)
                </span>
              </h3>
              <span className="text-xs text-[#8E7966] hidden sm:inline">Desliza para explorar</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
              {featuredTrends.map((trend) => (
                <div
                  key={trend.id}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start rounded-2xl bg-white border border-[#E5DAC8] p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                  onClick={() => setSelectedPromoForDetails(trend)}
                >
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-[#F0E9DF]">
                    <img
                      src={trend.image}
                      alt={trend.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#33241A]/85 backdrop-blur-md text-[#FAF7F2] text-[10px] font-semibold px-2 py-0.5 rounded-md font-mono">
                      S/. {trend.price}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-[#665140] text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {trend.collection}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-[#302117] line-clamp-1 group-hover:text-[#8D6B19] transition-colors">
                      {trend.title}
                    </h4>
                    <p className="text-[11px] text-[#715E4E] line-clamp-2 mt-1">
                      {trend.description}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#F2ECE2] flex items-center justify-between text-[11px]">
                    <span className="text-[#8B7461] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{trend.durationMinutes} min</span>
                    </span>
                    <span className="text-[#966E19] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Ver detalle
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Toolbar (Search + Category Tabs) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#3A2A1F] text-[#FAF7F2] shadow-xs'
                    : 'bg-[#F2ECE2] text-[#695647] hover:bg-[#E8DFD1] hover:text-[#2E2017]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px] max-w-sm">
            <Search className="w-4 h-4 text-[#947F6E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por estilo, técnica o flor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#DDD1BF] text-[#302117] placeholder:text-[#9F8C7C] focus:outline-none focus:ring-2 focus:ring-[#C29D38]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#887463] hover:text-[#38281F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Promotional Designs Grid */}
        {filteredDesigns.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-[#E6DCce]">
            <p className="text-sm font-medium text-[#655244]">No se encontraron diseños con ese filtro.</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('Todas');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold text-[#8C6D45] underline decoration-[#C29D38]"
            >
              Restablecer búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="rounded-2xl bg-white border border-[#E7DDCE] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#D4AF37]/50"
              >
                {/* Image Container with Fallback */}
                <div
                  className="relative h-56 bg-[#F3EDE3] overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPromoForDetails(design)}
                >
                  <img
                    src={design.image}
                    alt={design.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-medium flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>Ver de qué se trata y técnica</span>
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 bg-[#2D2017]/85 backdrop-blur-md text-[#FAF7F2] text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full">
                    {design.collection}
                  </div>

                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#886214] font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs font-mono">
                    S/. {design.price}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8C7664] mb-1">
                      <span>Nivel: Moderado</span>
                      <span aria-hidden="true">·</span>
                      <span>Hasta #3 incluido</span>
                    </div>

                    <h3
                      className="font-semibold text-sm text-[#2F2117] group-hover:text-[#8D6B19] transition-colors cursor-pointer"
                      onClick={() => setSelectedPromoForDetails(design)}
                    >
                      {design.title}
                    </h3>

                    <p className="text-xs text-[#6F5B4D] line-clamp-2 mt-1.5 leading-relaxed">
                      {design.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {design.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-[#7A6655] bg-[#F7F2EA] px-2 py-0.5 rounded-md border border-[#E9DFD0]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 mt-4 border-t border-[#F2ECE2] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPromoForDetails(design)}
                      className="text-xs font-medium text-[#7A6350] hover:text-[#2F2117] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Detalles</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openBooking('promotion', design.id)}
                      className="py-2 px-3.5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#E6C665]" />
                      <span>Agendar Promo</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal: "De qué se trata y cómo se hace" */}
      {selectedPromoForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E3D6C3] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E8DEC9] bg-[#F5EFE6] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-brand uppercase tracking-widest text-[#947D68]">
                  {selectedPromoForDetails.collection} · Nivel Moderado
                </span>
                <h3 className="text-xl font-display font-bold text-[#302117]">
                  {selectedPromoForDetails.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPromoForDetails(null)}
                className="p-2 text-[#7C6755] hover:text-[#2E2017] rounded-full hover:bg-[#EAE0D0] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#523F32]">
              {/* Photo Banner */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-[#E8DFC9] bg-[#EFE8DD]">
                <img
                  src={selectedPromoForDetails.image}
                  alt={selectedPromoForDetails.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-[#2D2017]/90 backdrop-blur-md text-[#FAF7F2] text-xs font-bold px-3 py-1 rounded-lg font-mono">
                  Tarifa Promo: S/. {selectedPromoForDetails.price}
                </div>
              </div>

              {/* De qué se trata */}
              <div className="p-4 rounded-xl bg-white border border-[#EAE1D2]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#35261C] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C29D38]" />
                  <span>¿De qué se trata este diseño?</span>
                </h4>
                <p className="text-[#645244] leading-relaxed text-xs">
                  {selectedPromoForDetails.description}
                </p>
              </div>

              {/* Cómo se hace */}
              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E4D8C5]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#35261C] mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#8F6E4C]" />
                  <span>¿Cómo se hace? (Paso a paso técnico)</span>
                </h4>
                <p className="text-[#645244] leading-relaxed text-xs whitespace-pre-line">
                  {selectedPromoForDetails.technique}
                </p>
              </div>

              {/* Service specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#E8DEC9]">
                  <span className="block text-[10px] text-[#887463]">Sistema Recomendado</span>
                  <span className="font-semibold text-xs text-[#302117]">
                    {selectedPromoForDetails.recommendedSystem}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E8DEC9]">
                  <span className="block text-[10px] text-[#887463]">Duración Estimada</span>
                  <span className="font-semibold text-xs text-[#302117]">
                    {selectedPromoForDetails.durationMinutes} minutos
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E8DEC9] col-span-2 sm:col-span-1">
                  <span className="block text-[10px] text-[#887463]">Adelanto Requerido</span>
                  <span className="font-semibold text-xs text-[#302117] font-mono">
                    S/. {settings.defaultDepositAmount} soles
                  </span>
                </div>
              </div>

              {/* Note on Terms */}
              <p className="text-[11px] text-[#867362] italic">
                * Recuerda que el largo incluido es hasta el #3. Formas disponibles: Almendra, Coffin, Cuadrada y Ovalada. (Stiletto y pedrería tienen costo adicional según términos).
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E8DEC9] bg-[#F7F2EA] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedPromoForDetails(null)}
                className="py-2.5 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#574334] hover:bg-[#EBE2D4] cursor-pointer"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => {
                  const id = selectedPromoForDetails.id;
                  setSelectedPromoForDetails(null);
                  openBooking('promotion', id);
                }}
                className="py-2.5 px-5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E6C665]" />
                <span>Agendar este Diseño (S/. {selectedPromoForDetails.price})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
