'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Hotel } from '@/types/hotel'
import { HotelPayload } from '@/types/hotel'
import { SearchAndActions } from '@/components/search-and-actions'
import { HotelTable } from '@/components/hotel-table'
import { HotelModal } from '@/components/hotel-modal'
import { toast } from "@/hooks/use-toast"

export default function HotelDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const countryId = searchParams.get("countryId")

  // Fetch hotels when countryId changes
  useEffect(() => {
    if (!countryId) return

    const fetchHotels = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/admin/hotels?countryId=${countryId}`)
        setHotels(response.data.hotels || [])
      } catch (error) {
        toast({
          title: "Error!",
          description: "Failed to load hotels",
          variant: "destructive",
        })
        console.error('Error fetching hotels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [countryId])

  const handleSaveHotel = async (hotelData: HotelPayload) => {
    try {
      const payload = {
        name: hotelData.name,
        starRating: hotelData.starRating,
        amenities: Array.isArray(hotelData.amenities)
          ? hotelData.amenities.join(",")
          : hotelData.amenities,
        countryId: countryId,
        destinationId: Number(hotelData.city),
        mealPlan: hotelData.hasMealPlan ? hotelData.mealPlan : "No",
        source: hotelData.source,
        basePricePerNight: hotelData.price,
        currency: hotelData.currency,
      }

      if (editingHotel) {
        await axios.put(`/api/admin/hotels/${editingHotel.id}`, payload);
        const response = await axios.get(`/api/admin/hotels?countryId=${countryId}`);
        setHotels(response.data.hotels || []);
        toast({
          title: "Success!",
          description: "Hotel updated successfully.",
          variant: "success",
        });
      } else {
        await axios.post("/api/admin/hotels", payload);
        const response = await axios.get(`/api/admin/hotels?countryId=${countryId}`);
        setHotels(response.data.hotels || []);
        toast({
          title: "Success!",
          description: "Hotel added successfully.",
          variant: "success",
        });
      }

      handleCloseModal()
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to save hotel.",
        variant: "destructive",
      })
      console.error('Error saving hotel:', error)
    }
  }

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setIsModalOpen(true)
  }

  const handleDeleteHotel = async (hotelId: string) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) {
      return
    }

    try {
      await axios.delete(`/api/admin/hotels/${hotelId}`)
      setHotels(prev => prev.filter(hotel => String(hotel.id) !== String(hotelId)))
      toast({
        title: "Success!",
        description: "Hotel deleted successfully.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to delete hotel.",
        variant: "destructive",
      })
      console.error('Error deleting hotel:', error)
    }
  }

  const handleAddHotel = () => {
    setEditingHotel(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingHotel(null)
  }

  const filteredHotels = hotels.filter(hotel => {
    if (!hotel || typeof hotel !== "object") return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (hotel.name || "").toLowerCase().includes(searchLower) ||
      (hotel.destination && hotel.destination.name
        ? hotel.destination.name.toLowerCase().includes(searchLower)
        : false) ||
      (hotel.country && typeof hotel.country === "object" && hotel.country.name
        ? hotel.country.name.toLowerCase().includes(searchLower)
        : typeof hotel.country === "string"
          ? hotel.country.toLowerCase().includes(searchLower)
          : false)
    );
  });

  if (!countryId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Country Selected</h2>
          <p className="text-gray-600">Please select a country to manage hotels.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Management</h1>
          <p className="text-gray-600">Manage your hotel inventory and details</p>
        </div>

        <SearchAndActions
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddHotel={handleAddHotel}
        />

        <HotelTable
          hotels={filteredHotels}
          onEdit={handleEditHotel}
          onDelete={handleDeleteHotel}
          loading={loading}
        />

        <HotelModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveHotel}
          hotel={editingHotel}
        />
      </div>
    </div>
  )
}