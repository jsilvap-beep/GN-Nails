export type ServiceType = 'promotion' | 'custom';

export type DesignLevel = 'sencillo' | 'moderado' | 'complejo';

export interface PromoDesign {
  id: string;
  title: string;
  collection: string;
  description: string;
  technique: string;
  level: DesignLevel;
  durationMinutes: number;
  price: number;
  image: string;
  tags: string[];
  featured?: boolean;
  active: boolean;
  recommendedSystem: string;
}

export interface NailShape {
  id: string;
  name: string;
  description: string;
  extraCost: number;
  popular?: boolean;
}

export interface NailLength {
  id: string;
  label: string;
  range: string;
  code: string;
  extraCost: number;
  description: string;
}

export interface NailSystem {
  id: string;
  name: string;
  description: string;
  extraCost: number;
  inPromo: boolean;
}

export interface CustomServiceConfig {
  level: DesignLevel;
  system: string;
  shape: string;
  lengthId: string;
  addons: {
    rhinestones: boolean;
    previousRemoval: boolean;
    stilettoShape: boolean;
    homeService: boolean;
  };
  referenceImage?: string;
  customNotes?: string;
  calculatedPrice: number;
}

export type AppointmentStatus = 'pending_deposit' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  code: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientInstagram?: string;
  serviceType: ServiceType;
  promoDesignId?: string;
  promoDesignTitle?: string;
  customDetails?: CustomServiceConfig;
  date: string;
  timeSlot: string;
  locationType: 'studio' | 'home';
  homeAddress?: string;
  status: AppointmentStatus;
  totalPrice: number;
  depositRequired: number;
  depositPaid: boolean;
  paymentMethod: 'yape' | 'plin';
  notes?: string;
}

export interface StudioSettings {
  studioName: string;
  slogan: string;
  instagram: string;
  whatsappNumber: string;
  yapeNumber: string;
  yapeName: string;
  plinNumber: string;
  plinName: string;
  defaultPromoPrice: number;
  defaultDepositAmount: number;
  levelBasicPrice: number;
  levelModeratePrice: number;
  levelComplexPrice: number;
  stilettoExtraCost: number;
  longNailExtraCost: number;
  removalExtraCost: number;
  rhinestoneExtraCost: number;
  homeServiceExtraCost: number;
  studioAddress: string;
  studioCity: string;
  timezone: string;
  adminPin: string;
}
