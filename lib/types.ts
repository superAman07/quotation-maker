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
  id: number
  name: string
  starRating?: number
  amenities?: string
  imageUrl?: string
  destinationId?: string
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
