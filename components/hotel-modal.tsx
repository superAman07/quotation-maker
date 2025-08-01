"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Country, Destination, Hotel, HotelPayload } from "@/types/hotel"
import { CURRENCY_OPTIONS, MEAL_PLAN_OPTIONS } from "@/constants/hotel-options"


interface HotelModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (hotel: HotelPayload) => void
  hotel?: Hotel | null
}

export function HotelModal({ isOpen, onClose, onSave, hotel }: HotelModalProps) {
  const [formData, setFormData] = useState<HotelPayload>({
    name: "",
    country: "",
    city: "",
    starRating: 1,
    amenities: [],
    hasMealPlan: false,
    mealPlan: undefined,
    source: "",
    price: 0,
    currency: "USD",
  })

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [conversionRate, setConversionRate] = useState<number>(1);
  const [currencyCode, setCurrencyCode] = useState<string>("INR");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedCountry");
      setSelectedCountry(stored ? JSON.parse(stored) : null);
    }
  }, []);

  useEffect(() => {
    if (selectedCountry?.id) {
      const fetchConversionRate = async () => {
        try {
          const response = await axios.get(`/api/admin/country-currency?countryId=${selectedCountry.id}`);
          const currencyData = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
          setConversionRate(currencyData?.conversionRate || 1);
          setCurrencyCode(currencyData?.currencyCode || "INR");
        } catch (error) {
          setConversionRate(1);
          setCurrencyCode("INR");
          console.error("Error fetching conversion rate:", error);
        }
      };
      fetchConversionRate();
    } else {
      setConversionRate(1);
      setCurrencyCode("INR");
    }
  }, [selectedCountry]);


  useEffect(() => {
    if (selectedCountry?.id) {
      const fetchDestinations = async () => {
        try {
          const response = await axios.get(`/api/admin/destinations?countryId=${selectedCountry.id}`);
          setDestinations(response.data.destinations || []);
        } catch (error) {
          console.error("Error fetching destinations:", error);
        }
      };
      fetchDestinations();
    } else {
      setDestinations([]);
    }
  }, [selectedCountry]);
  // Reset city when country changes
  useEffect(() => {
    if (
      formData.country &&
      formData.city &&
      !destinations.some((dest) => dest.id.toString() === formData.city)
    ) {
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.country, destinations]);

  // Initialize form data when hotel prop changes
  useEffect(() => {
    if (hotel) {
      const amenitiesArray = Array.isArray(hotel.amenities)
        ? hotel.amenities
        : typeof hotel.amenities === "string"
          ? hotel.amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
          : []

      setFormData({
        name: hotel.name,
        country: hotel.country && typeof hotel.country === "object" && hotel.country.id
          ? hotel.country.id.toString()
          : hotel.country
            ? hotel.country.toString()
            : "",
        city: hotel.destination && hotel.destination.id
          ? hotel.destination.id.toString()
          : "",
        starRating: hotel.starRating,
        amenities: amenitiesArray,
        hasMealPlan: hotel.hasMealPlan,
        mealPlan: hotel.mealPlan,
        source: hotel.source || "",
        price: hotel.basePricePerNight,
        currency: hotel.currency,
      })
    } else {
      setFormData({
        name: "",
        country: selectedCountry?.id ? selectedCountry.id.toString() : "",
        city: "",
        starRating: 1,
        amenities: [],
        hasMealPlan: false,
        mealPlan: undefined,
        source: "",
        price: 0,
        currency: "USD",
      })
    }
  }, [hotel, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.country || !formData.city || formData.price <= 0) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      await onSave({
        ...formData,
        country: selectedCountry?.id ? selectedCountry.id.toString() : "",
      })
    } catch (error) {
      console.error("Error saving hotel:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof HotelPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 text-gray-600 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{hotel ? "Edit Hotel" : "Add New Hotel"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hotel Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Hotel Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="Enter hotel name"
              required
            />
          </div>

          {/* Country and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <div className="px-3 py-2 bg-gray-100 rounded text-gray-700 font-semibold flex items-center gap-2">
                <span>{selectedCountry?.flag}</span>
                <span>{selectedCountry?.name}</span>
                <span className="ml-2 text-xs text-gray-500">{selectedCountry?.currency}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City/Destination *</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => updateFormData("city", value)}
                disabled={!selectedCountry?.id}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent className="bg-white cursor-pointer text-gray-600">
                  {destinations.map((dest) => (
                    <SelectItem key={dest.id} value={dest.id.toString()} className="cursor-pointer">
                      {dest.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Star Rating *</Label>
            <Select
              value={formData.starRating.toString()}
              onValueChange={(value) => updateFormData("starRating", Number.parseInt(value))}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()} className="bg-white text-gray-600 cursor-pointer">
                    {rating} Star{rating > 1 ? "s" : ""} {"★".repeat(rating)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            <Input
              id="amenities"
              type="text"
              value={Array.isArray(formData.amenities) ? formData.amenities.join(", ") : formData.amenities || ""}
              onChange={e => updateFormData("amenities", e.target.value)}
              placeholder="e.g., Pool, Gym, Concierge"
            />
          </div>

          {/* Meal Plan */}
          <div className="space-y-3">
            <Label>Meal Plan</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasMealPlan"
                checked={formData.hasMealPlan}
                onCheckedChange={(checked) => updateFormData("hasMealPlan", checked)}
                className="cursor-pointer"
              />
              <Label className="cursor-pointer" htmlFor="hasMealPlan">Does this hotel offer a meal plan?</Label>
            </div>

            {formData.hasMealPlan && (
              <Select value={formData.mealPlan || ""} onValueChange={(value) => updateFormData("mealPlan", value)}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select meal plan" />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_PLAN_OPTIONS.map((plan) => (
                    <SelectItem key={plan} value={plan} className="cursor-pointer bg-white text-gray-600">
                      {plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Source and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                type="text"
                value={formData.source}
                onChange={(e) => updateFormData("source", e.target.value)}
                placeholder="e.g., Direct Booking, Travel Agency"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Night *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={e => updateFormData("price", Number.parseFloat(e.target.value) || 0)}
                placeholder="Enter price in INR"
                min="0"
                step="0.01"
                required
              />
              <div className="mt-1 text-sm text-gray-600">
                {currencyCode !== "INR" && (
                  <>≈ {currencyCode} {(formData.price * conversionRate).toFixed(2)}</>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="bg-white border cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-md hover:from-pink-600 hover:to-indigo-600 transition-colors duration-200 border-none px-6 py-2 rounded-lg">
              {loading ? "Saving..." : hotel ? "Update Hotel" : "Add Hotel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
