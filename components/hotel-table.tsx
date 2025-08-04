"use client"
import { Edit2, Trash2, MapPin, DollarSign, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Hotel } from "@/types/hotel"
import { CURRENCY_OPTIONS } from "@/constants/hotel-options"

interface HotelTableProps {
  hotels: Hotel[]
  onEdit: (hotel: Hotel) => void
  onDelete: (hotelId: string) => void
  loading?: boolean
  conversionRate?: number
  currencyCode?: string
}

export function HotelTable({ hotels, onEdit, onDelete, loading, conversionRate, currencyCode }: HotelTableProps) {
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">{rating}</span>
      </div>
    )
  }

  const getCurrencySymbol = (currency: string) => {
    const currencyOption = CURRENCY_OPTIONS.find((option) => option.code === currency)
    return currencyOption?.symbol || currency
  }

  const parseAmenities = (amenities: string[] | string): string[] => {
    if (Array.isArray(amenities)) return amenities
    if (typeof amenities === "string") {
      return amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
    }
    return []
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl w-full flex justify-center shadow-sm p-8 text-center text-gray-600">
        <div className="mini-loader"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full">
            <thead
            className="border-b border-gray-200 sticky top-0 z-10"
            style={{
              background: "linear-gradient(90deg, #f9fafb 0%, #e0e7ff 50%, #fce7f3 100%)"
            }}
            >
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hotel Details</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amenities</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Meal Plan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Source</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
            </tr>
            </thead>
          <tbody className="divide-y divide-gray-200">
            {hotels.map((hotel, index) => {
              const amenitiesArray = parseAmenities(hotel.amenities)

              return (
                <tr
                  key={hotel.id}
                  className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                >
                  <td className="px-6 py-4">
                    <h3 className="text-md font-semibold text-gray-600">{hotel.name}</h3>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{hotel.destination?.name || "N/A"}</div>
                        <div className="text-sm text-gray-500">
                          {typeof hotel.country === "object" ? hotel.country.name : hotel.country || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">{renderStarRating(hotel.starRating)}</td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {amenitiesArray.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {amenitiesArray.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{amenitiesArray.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {hotel.mealPlan && hotel.mealPlan !== "No" ? (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {hotel.mealPlan}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                        Not Included
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-gray-700 text-sm">{hotel.source || "N/A"}</span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-600">
                      <span className="font-semibold">{currencyCode}</span>
                      {hotel.basePricePerNight != null && !isNaN(Number(hotel.basePricePerNight))
                        ? (Number(hotel.basePricePerNight) * (conversionRate ?? 1)).toLocaleString(undefined, { maximumFractionDigits: 2 })
                        : "0"}
                      <span className="text-sm font-normal text-gray-500 ml-1">/night</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(hotel)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4 cursor-pointer" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(hotel.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 cursor-pointer" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {hotels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No hotels found</div>
          <p className="text-gray-500">Add your first hotel to get started</p>
        </div>
      )}
    </div>
  )
}
