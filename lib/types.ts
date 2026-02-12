// Type definitions based on your Prisma schema
export interface Destination {
  id: number
  name: string
  state?: string
  country?: string
  description?: string
  imageUrl?: string
}

export interface Venue {
  id: number
  name: string
  address?: string
  coordinates?: string
  description?: string
  imageUrl?: string
  destinationId: number
  destination?: Destination
}

export interface Hotel {
  id: number;
  name: string;
  starRating: number;
  amenities: string | string[];
  mealPlan: string;
  source?: string;
  countryId: number;
  destinationId: number;
  basePricePerNight: number;
  country: {
    id: number;
    name: string;
    code?: string;
    flag?: string;
    currency?: string;
  };
  destination: {
    id: number;
    name: string;
    state?: string;
    countryId?: number;
    description?: string;
    imageUrl?: string;
  };
}

export interface HotelRateCard {
  id: number
  hotelId: number
  roomType: string
  season: string
  rate: number
  hotel?: Hotel
}

export interface FlightRoute {
  id: number
  origin: string
  destination: string
  baseFare: number
  airline?: string
  imageUrl?: string
}

export enum VehicleCategory {
  INTERCITY = "INTERCITY",
  LOCAL = "LOCAL",
}

export interface VehicleType {
  id: number
  type: string
  category: VehicleCategory
  ratePerDay?: number
  ratePerKm?: number
}

export interface MealPlan {
  id: number
  code: string
  description?: string
  ratePerPerson: number
}

export interface Package {
  id: number
  name: string
  description?: string
  durationDays: number
  basePricePerPerson: number
  totalNights: number
}

export interface PackageItinerary {
  id: number
  packageId: number
  dayNumber: number
  title: string
  description: string
  package?: Package
}

export interface InclusionTemplate {
  id: number
  name: string
  description?: string
}

export interface ExclusionTemplate {
  id: number
  name: string
  description?: string
}

export enum AppStatus {
  IDLE = 'IDLE',
  READING = 'Reading your request...',
  THINKING = 'Thinking through options...',
  QUESTIONING = 'Quick question...',
  DRAFTING = 'Drafting quotation...'
}

export interface Traveler {
  type: 'adult' | 'child' | 'infant';
  age?: number;
}

export interface Hotel {
  name: string;
  nights: number;
  city: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  bullets: string[];
  overnight: string;
}

export interface Pricing {
  accommodation_total: number;
  vehicle_total: number;
  permits_total: number;
  meals_total: number;
  taxes: number;
  service_fee: number;
  grand_total: number;
  currency: string;
  package_land_only?: number;
  flight_cost?: number;
}

export interface Contact {
  company: string;
  phone: string;
  email: string;
  website: string;
}

export interface TravelQuotation {
  quote_id: string;
  trip_name: string;
  pax_total: number;
  travelers: Traveler[];
  dates: {
    start: string;
    end: string;
    nights: number;
  };
  origin_city: string;
  destinations: string[];
  accommodation_level: '3' | '4' | '5';
  hotels: Hotel[];
  transport: {
    type: string;
    vehicle_detail: string;
    days: number;
  };
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  pricing: Pricing;
  contact: Contact;
  pdf_template_html: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}