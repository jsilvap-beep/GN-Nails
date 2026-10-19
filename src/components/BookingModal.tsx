import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GabeeLogo } from './GabeeLogo';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  Send,
  Copy,
  Check,
  AlertCircle,
  CreditCard,
  QrCode,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM',
  '11:30 AM',
  '02:30 PM',
  '05:00 PM',
  '07:30 PM',
];

export const BookingModal: React.FC = () => {
  const {
    isBookingOpen,
    closeBooking,
    bookingServiceType,
    selectedPromoForBooking,
    customConfig,
    promoDesigns,
    settings,
    createAppointment,
    generateWhatsAppLink,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to tomorrow in Lima timezone
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('02:30 PM');
  const [locationType, setLocationType] = useState<'studio' | 'home'>('studio');
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientInstagram, setClientInstagram] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin'>('yape');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Confirmed Appointment reference
  const [confirmedApt, setConfirmedApt] = useState<any>(null);

  // Target Promo Design
  const activePromo = useMemo(() => {
    if (selectedPromoForBooking) return selectedPromoForBooking;
    return promoDesigns[0];
  }, [selectedPromoForBooking, promoDesigns]);

  // Total price calculation
  const totalPrice = useMemo(() => {
    if (bookingServiceType === 'promotion') {
      let price = activePromo ? activePromo.price : settings.defaultPromoPrice;
      if (locationType === 'home') price += settings.homeServiceExtraCost;
      return price;
    } else {
      let price = customConfig.calculatedPrice;
      if (locationType === 'home' && !customConfig.addons.homeService) {
        price += settings.homeServiceExtraCost;
      }
      return price;
    }
  }, [bookingServiceType, activePromo, settings, locationType, customConfig]);

  const depositRequired = settings.defaultDepositAmount; // S/. 20
  const remainingBalance = totalPrice - depositRequired;

  // Available days generator (next 21 days)
  const availableDates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 1; i <= 21; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('es-PE', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('es-PE', { month: 'short' });
      list.push({ iso, dayName, dayNum, monthName });
    }
    return list;
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleFinalSubmit = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor ingresa tu nombre y número de teléfono/WhatsApp.');
      return;
    }

    const newApt = createAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientInstagram: clientInstagram.trim() || undefined,
      serviceType: bookingServiceType,
      promoDesignId: bookingServiceType === 'promotion' ? activePromo?.id : undefined,
      promoDesignTitle: bookingServiceType === 'promotion' ? activePromo?.title : undefined,
      customDetails: bookingServiceType === 'custom' ? customConfig : undefined,
      date: selectedDate,
      timeSlot: selectedSlot,
      locationType,
      homeAddress: locationType === 'home' ? homeAddress.trim() : undefined,
      status: 'pending_deposit',
      totalPrice,
      depositRequired,
      depositPaid: false,
      paymentMethod,
      notes: notes.trim() || undefined,
    });

    setConfirmedApt(newApt);
    setStep(4);

    // Fire festive celebratory confetti
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#EAD6C9', '#38281F', '#F4A291'],
      });
    } catch {
      // ignore
    }
  };

  if (!isBookingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF7F2] border border-[#E3D6C3] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8DEC9] bg-[#F5EFE6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GabeeLogo size="sm" showSubtitle={false} />
            <div>
              <span className="text-[10px] font-brand uppercase tracking-widest text-[#947D68] block">
                Agendamiento · Tendencia 2026
              </span>
              <h3 className="text-lg font-display font-bold text-[#302117] leading-tight">
                {step === 1 && 'Paso 1: Selecciona Día y Hora (GMT -05)'}
                {step === 2 && 'Paso 2: Modalidad y Tus Datos'}
                {step === 3 && 'Paso 3: Adelanto S/. 20 por Yape / Plin'}
                {step === 4 && '¡Cita Registrada! Notificar por WhatsApp'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeBooking}
            className="p-2 text-[#7C6755] hover:text-[#2E2017] rounded-full hover:bg-[#EAE0D0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress */}
        <div className="bg-[#ECE4D8] h-1.5 w-full">
          <div
            className="bg-[#3C2D22] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#523F32] flex-1">
          {/* Service Banner Summary */}
          {step < 4 && (
            <div className="p-3.5 rounded-2xl bg-white border border-[#E6DDCD] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F2ECE2] shrink-0 border border-[#E0D4C3]">
                  {bookingServiceType === 'promotion' ? (
                    <img
                      src={activePromo?.image}
                      alt={activePromo?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">💅</div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-[#8E7966] uppercase tracking-wide block">
                    {bookingServiceType === 'promotion' ? 'Promoción Oficial (Moderado)' : 'Servicio Personalizado'}
                  </span>
                  <span className="font-semibold text-xs text-[#2F2016] block">
                    {bookingServiceType === 'promotion' ? activePromo?.title : `Set Personalizado (${customConfig.shape} - ${customConfig.level})`}
                  </span>
                  <span className="text-[10px] text-[#7C6856]">
                    Duración: ~90 - 120 min · Softgel / Polygel / Builder
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 pl-2">
                <span className="text-[10px] text-[#887463] block">Total</span>
                <span className="text-base font-bold font-mono text-[#8C6B1C]">
                  S/. {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* STEP 1: Date & Time in GMT-05 Lima */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Timezone Notice */}
              <div className="p-3 rounded-xl bg-[#F4EFE6] border border-[#DECDB8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#5A4535]">
                  <Clock className="w-4 h-4 text-[#C29D38] shrink-0" />
                  <span>Zona horaria: <strong>América/Lima (GMT -05:00)</strong></span>
                </div>
                <span className="text-[10px] font-mono text-[#8C7460] bg-white px-2 py-0.5 rounded border border-[#DFD1BF]">
                  Hora Perú
                </span>
              </div>

              {/* Date Selector (Horizontal Scrollable Strip) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35251B] mb-2.5">
                  1. Selecciona la Fecha
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {availableDates.map((item) => (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => setSelectedDate(item.iso)}
                      className={`min-w-[68px] p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedDate === item.iso
                          ? 'border-[#39291E] bg-[#39291E] text-[#FAF7F2] shadow-xs'
                          : 'border-[#E3D7C5] bg-white text-[#564335] hover:border-[#C5B39C]'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-semibold opacity-85">
                        {item.dayName}
                      </span>
                      <span className="block text-lg font-bold font-mono my-0.5">
                        {item.dayNum}
                      </span>
                      <span className="block text-[9px] uppercase tracking-wider">
                        {item.monthName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35251B] mb-2.5">
                  2. Selecciona la Hora de Atención
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'border-[#B89230] bg-[#FAF5EB] ring-2 ring-[#D4AF37]/40 font-bold text-[#2E2017]'
                          : 'border-[#E5DAC8] bg-white text-[#5C493B] hover:border-[#C5B39C]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location and Client Information */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Location Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35251B] mb-2">
                  Modalidad de Atención
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLocationType('studio')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      locationType === 'studio'
                        ? 'border-[#B89230] bg-[#FAF5EB] ring-1 ring-[#D4AF37]/50 font-bold text-[#2E2017]'
                        : 'border-[#E5DAC8] bg-white text-[#5C493B]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-[#8C6B1C]" />
                      <span className="text-xs font-semibold">En Estudio (Surco)</span>
                    </div>
                    <span className="text-[11px] text-[#7A6655] font-normal block">
                      Dirección exacta enviada por WhatsApp tras confirmar el adelanto por seguridad.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocationType('home')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      locationType === 'home'
                        ? 'border-[#B89230] bg-[#FAF5EB] ring-1 ring-[#D4AF37]/50 font-bold text-[#2E2017]'
                        : 'border-[#E5DAC8] bg-white text-[#5C493B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">A Domicilio</span>
                      <span className="text-[10px] font-mono text-[#8C6B1C] font-bold">
                        + S/. {settings.homeServiceExtraCost}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A6655] font-normal block">
                      Servicio directo en tu casa con equipo portátil esterilizado.
                    </span>
                  </button>
                </div>
              </div>

              {locationType === 'home' && (
                <div>
                  <label className="block text-xs font-medium text-[#4D3A2C] mb-1">
                    Dirección exacta y distrito en Lima
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Av. Benavides 2150 dpto 402, Miraflores, Lima"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs text-[#2E2017] focus:ring-2 focus:ring-[#C29D38] focus:outline-none"
                  />
                </div>
              )}

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[#4D3A2C] mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Valeria Mendoza"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs text-[#2E2017] focus:ring-2 focus:ring-[#C29D38] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4D3A2C] mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 984 552 110"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs text-[#2E2017] focus:ring-2 focus:ring-[#C29D38] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4D3A2C] mb-1">
                  Usuario de Instagram (Opcional, para etiquetarte)
                </label>
                <input
                  type="text"
                  placeholder="@tuusuario"
                  value={clientInstagram}
                  onChange={(e) => setClientInstagram(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD1BF] bg-white text-xs text-[#2E2017] focus:ring-2 focus:ring-[#C29D38] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4D3A2C] mb-1">
                  Notas adicionales (Alergias, uñas quebradizas o detalles)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles que debamos saber antes de iniciar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#DDD1BF] bg-white text-xs text-[#2E2017] focus:ring-2 focus:ring-[#C29D38] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Deposit Payment Instructions (Yape / Plin S/. 20) */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Terms reminder on deposit */}
              <div className="p-3.5 rounded-xl bg-[#F7F2E9] border border-[#DFCBB5] text-xs text-[#5E4B3D] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#8C6B1C] shrink-0 mt-0.5" />
                <p>
                  Para separar tu cupo en la agenda se requiere un adelanto de <strong>S/. {depositRequired}.00</strong> mediante Yape o Plin. Si requieres reprogramar, avísanos con al menos 1 día de anticipación.
                </p>
              </div>

              {/* Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DAC8] space-y-2 text-xs">
                <div className="flex justify-between text-[#685547]">
                  <span>Total del Servicio Estimado:</span>
                  <span className="font-mono font-medium">S/. {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2E2017] font-bold text-sm pt-2 border-t border-[#F2ECE2]">
                  <span>Adelanto Obligatorio para Separar:</span>
                  <span className="font-mono text-[#8C6B1C]">S/. {depositRequired.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#816E5E] text-[11px]">
                  <span>Saldo a pagar el día de la cita:</span>
                  <span className="font-mono">S/. {remainingBalance.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Switcher */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#35251B] mb-2">
                  Método para transferir el adelanto
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-semibold text-xs flex items-center justify-center gap-2 ${
                      paymentMethod === 'yape'
                        ? 'border-[#742384] bg-[#742384]/10 text-[#742384] ring-1 ring-[#742384]'
                        : 'border-[#E3D6C4] bg-white text-[#635142]'
                    }`}
                  >
                    <span className="text-base font-bold">🟣</span>
                    <span>Yape</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('plin')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-semibold text-xs flex items-center justify-center gap-2 ${
                      paymentMethod === 'plin'
                        ? 'border-[#009FE3] bg-[#009FE3]/10 text-[#009FE3] ring-1 ring-[#009FE3]'
                        : 'border-[#E3D6C4] bg-white text-[#635142]'
                    }`}
                  >
                    <span className="text-base font-bold">🔵</span>
                    <span>Plin</span>
                  </button>
                </div>

                {/* Yape & Plin Card details */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5DAC8] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B7461]">
                        {paymentMethod === 'yape' ? 'Cuenta Oficial Yape' : 'Cuenta Oficial Plin'}
                      </span>
                      <p className="text-base font-mono font-bold text-[#2D2017] tracking-wider mt-0.5">
                        {paymentMethod === 'yape' ? settings.yapeNumber : settings.plinNumber}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          paymentMethod === 'yape' ? settings.yapeNumber : settings.plinNumber
                        )
                      }
                      className="py-1.5 px-3 rounded-lg border border-[#D8C9B5] text-xs font-semibold text-[#5A4535] hover:bg-[#F2ECE2] flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] text-[#715E4F] pt-2 border-t border-[#F2ECE2]">
                    <span className="block font-medium">
                      Titular: <strong>{settings.yapeName}</strong>
                    </span>
                    <span className="text-[#887463]">
                      Monto a transferir: S/. {depositRequired}.00 soles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success & WhatsApp Dispatch */}
          {step === 4 && confirmedApt && (
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#98782E] font-brand">
                  ¡Reserva Registrada con Éxito!
                </span>
                <h3 className="text-2xl font-display font-bold text-[#302117] mt-1">
                  Código: #{confirmedApt.code}
                </h3>
                <p className="text-xs text-[#6F5B4D] max-w-md mx-auto mt-2 leading-relaxed">
                  Para confirmar tu turno en la agenda de Gabee Nail Art, envía el mensaje por WhatsApp junto con la captura de tu comprobante de adelanto de <strong>S/. {depositRequired}</strong>.
                </p>
              </div>

              {/* Appointment Ticket Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E3D6C3] max-w-md mx-auto text-left space-y-2 text-xs shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F2ECE2] pb-2.5">
                  <GabeeLogo size="sm" showSubtitle={false} />
                  <span className="text-[10px] uppercase font-bold text-[#98782E] tracking-wider">
                    Voucher de Reserva
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE2] pb-2">
                  <span className="text-[#816D5D]">Cliente:</span>
                  <span className="font-semibold text-[#2E2017]">{confirmedApt.clientName}</span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE2] pb-2">
                  <span className="text-[#816D5D]">Fecha y Hora:</span>
                  <span className="font-semibold text-[#2E2017]">
                    {confirmedApt.date} · {confirmedApt.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE2] pb-2">
                  <span className="text-[#816D5D]">Servicio:</span>
                  <span className="font-semibold text-[#2E2017]">
                    {confirmedApt.serviceType === 'promotion'
                      ? confirmedApt.promoDesignTitle
                      : 'Servicio Personalizado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#816D5D]">Adelanto a Enviar:</span>
                  <span className="font-bold text-[#8C6B1C] font-mono">
                    S/. {confirmedApt.depositRequired}.00 ({confirmedApt.paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* WhatsApp Launch CTA */}
              <div className="max-w-md mx-auto pt-2">
                <a
                  href={generateWhatsAppLink(confirmedApt)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Notificar y Enviar Voucher por WhatsApp</span>
                </a>
                <p className="text-[11px] text-[#8C7664] mt-2">
                  Se abrirá WhatsApp con el mensaje estructurado para Gabriela (Administradora).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-[#E8DEC9] bg-[#F7F2EA] flex items-center justify-between gap-3">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="py-2.5 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#574334] hover:bg-[#EBE2D4] cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={closeBooking}
              className="py-2.5 px-4 rounded-xl border border-[#D5C6B1] text-xs font-semibold text-[#574334] hover:bg-[#EBE2D4] cursor-pointer"
            >
              {step === 4 ? 'Finalizar' : 'Cancelar'}
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-2.5 px-5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Siguiente: Modalidad y Datos</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E6C665]" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={() => {
                if (!clientName.trim() || !clientPhone.trim()) {
                  alert('Por favor ingresa tu nombre y teléfono.');
                  return;
                }
                setStep(3);
              }}
              className="py-2.5 px-5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Siguiente: Adelanto S/. 20</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E6C665]" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="py-2.5 px-5 rounded-xl bg-[#39291E] hover:bg-[#251A13] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E6C665]" />
              <span>Confirmar y Notificar WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
