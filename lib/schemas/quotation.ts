import { z } from 'zod';

// This schema matches the props expected by your QuotationPDF component
export const QuotationSchema = z.object({
  quotationNo: z.string().describe("Generate a unique quotation number e.g. Q-2024-001"),
  place: z.string().describe("Destination name (e.g., 'Ladakh', 'Dubai')"),
  totalNights: z.number().describe("Total duration in nights"),
  groupSize: z.number().describe("Number of travelers"),
  travelDate: z.string().describe("Travel date in YYYY-MM-DD format (use future date if not specified)"),
  
  mealPlan: z.string().describe("Meal plan details (e.g., 'Breakfast & Dinner', 'MAP', 'All Inclusive')"),
  
  accommodation: z.array(z.object({
    hotelName: z.string().describe("Name of the hotel. If not specified, hallucinate a premium hotel option."),
    roomType: z.string().describe("Type of room (e.g., 'Deluxe', 'Standard')"),
    nights: z.number(),
  })).describe("List of hotels for the stay"),

  transfers: z.array(z.object({
    type: z.string().describe("Transfer type (e.g., 'Airport Pickup', 'Sightseeing in Innova')"),
    vehicleName: z.string().optional().describe("Vehicle type if applicable"),
  })).describe("List of transfers included"),

  activities: z.array(z.object({
    name: z.string().describe("Name of the activity or tour"),
  })).describe("List of activities/tours included in the package"),

  itinerary: z.array(z.object({
    dayTitle: z.string().describe("Title for the day (e.g., 'Arrival in Leh - Acclimatization')"),
    description: z.string().describe("Detailed description of the day's activities, roughly 2-3 sentences."),
  })).describe("Day-by-day itinerary matching the total nights"),

  flights: z.array(z.object({
    type: z.string().describe("e.g., 'Inbound' or 'Outbound'"),
    route: z.string().describe("Flight route (e.g., 'DEL -> IXL')"),
    date: z.string().describe("Flight date"),
    imageUrl: z.string().optional().describe("URL for airline logo if known, else undefined"),
  })).optional(),

  flightCost: z.number().default(0).describe("Total flight cost per person (0 if not included)"),
  landCostPerHead: z.number().describe("Land package cost per person"),
  totalGroupCost: z.number().describe("Total cost for the entire group (land + flights)"),

  inclusions: z.array(z.string()).describe("List of included items (e.g. 'Welcome Drink', 'Inner Line Permit')"),
  exclusions: z.array(z.string()).describe("List of excluded items (e.g. 'Personal Expenses', 'Tips')"),
});

export type QuotationType = z.infer<typeof QuotationSchema>;