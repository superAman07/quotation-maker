export interface Hotel {
  id: string
  name: string
  country: { id: number; name: string } | string
  destination: { id: number; name: string } | null
  starRating: number
  amenities: string[] | string
  hasMealPlan: boolean
  mealPlan?: string
  source?: string
  basePricePerNight: number
  currency: string
}

export interface HotelPayload {
  name: string
  country: string
  city: string
  starRating: number
  amenities: string[] | string
  hasMealPlan: boolean
  mealPlan?: string
  source?: string
  price: number
  currency: string
}

export interface Country {
  id: number
  name: string
}

export interface Destination {
  id: number
  name: string
  countryId: number
}
