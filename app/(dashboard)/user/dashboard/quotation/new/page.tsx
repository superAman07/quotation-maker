"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { QuotationPDF } from '@/components/Quotation-pdf';
import { PDFViewer } from '@react-pdf/renderer';
import { Combobox } from '@headlessui/react';

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface TravelSummary {
  dateOfTravel: string;
  groupSize: number;
  mealPlan: string;
  place: string;
  placeCustom?: string;
  vehicleUsedType?: string;
  vehicleUsed: string;
  localVehicleUsed: string;
  vehicleUsedCustom?: string;
  localVehicleUsedCustom?: string;
  flightCostPerPerson: number;
  flightImageUrl: string;
  mealPlanCustom: string;
}

interface Accommodation {
  id: string;
  location: string;
  locationCustom?: string;
  hotelName: string;
  numberOfNights: number;
  hotelNameCustom?: string;
}

interface ItineraryItem {
  id: string;
  dayTitle: string;
  description: string;
}

interface Costing {
  landCostPerPerson: number;
  flightCostPerPerson: number;
  totalCostPerPerson: number;
  totalGroupCost: number;
}

export default function QuotationForm() {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [travelSummary, setTravelSummary] = useState<TravelSummary>({
    dateOfTravel: '',
    groupSize: 1,
    mealPlan: '',
    place: '',
    placeCustom: '',
    vehicleUsedType: '',
    vehicleUsed: '',
    vehicleUsedCustom: '',
    localVehicleUsed: '',
    localVehicleUsedCustom: '',
    flightCostPerPerson: 0,
    flightImageUrl: '',
    mealPlanCustom: "",
  });
  const [mealPlans, setMealPlans] = useState<{ id: number; code: string; description: string }[]>([]);
  const [loadingMealPlans, setLoadingMealPlans] = useState(true);

  const [vehicles, setVehicles] = useState<{ id: number; name: string; type?: string }[]>([]);
  const [flightRoutes, setFlightRoutes] = useState<{
    id: number;
    origin: string;
    destination: string;
    baseFare: number;
    airline: string;
    imageUrl: string;
  }[]>([]);
  const [hotels, setHotels] = useState<{
    id: number;
    name: string;
    starRating?: number;
    amenities?: string;
    imageUrl?: string;
    venueId?: number;
    venue?: {
      id: number;
      name: string;
      address: string;
      coordinates?: string;
      description?: string;
      imageUrl?: string;
      destinationId?: number;
    };
  }[]>([]);

  const [destinations, setDestinations] = useState<{
    id: number;
    name: string;
    state?: string;
    country?: string;
    description?: string;
    imageUrl?: string;
  }[]>([]);

  const [query, setQuery] = useState('');
  const filteredDestinations = query === ''
    ? destinations
    : destinations.filter(dest =>
      dest.name.toLowerCase().includes(query.toLowerCase())
    );

  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const [accommodations, setAccommodations] = useState<Accommodation[]>([
    { id: '1', location: '', hotelName: '', numberOfNights: 1 }
  ]);

  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { id: '1', dayTitle: '', description: '' }
  ]);

  const [inclusions, setInclusions] = useState<string[]>(['']);
  const [exclusions, setExclusions] = useState<string[]>(['']);

  const [costing, setCosting] = useState<Costing>({
    landCostPerPerson: 0,
    flightCostPerPerson: 0,
    totalCostPerPerson: 0,
    totalGroupCost: 0
  });

  const [notes, setNotes] = useState('');
  const [flightImage, setFlightImage] = useState<File | null>(null);
  const [flightImagePreview, setFlightImagePreview] = useState<string>('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Handler functions
  const addAccommodation = () => {
    setAccommodations([...accommodations, {
      id: Date.now().toString(),
      location: '',
      hotelName: '',
      numberOfNights: 1
    }]);
  };

  const removeAccommodation = (id: string) => {
    setAccommodations(accommodations.filter(acc => acc.id !== id));
  };

  const updateAccommodation = (id: string, field: keyof Accommodation, value: string | number) => {
    setAccommodations(accommodations.map(acc =>
      acc.id === id ? { ...acc, [field]: value } : acc
    ));
  };

  const addItineraryItem = () => {
    setItinerary([...itinerary, {
      id: Date.now().toString(),
      dayTitle: '',
      description: ''
    }]);
  };

  const removeItineraryItem = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const updateItineraryItem = (id: string, field: keyof ItineraryItem, value: string) => {
    setItinerary(itinerary.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addInclusion = () => {
    setInclusions([...inclusions, '']);
  };

  const removeInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const updateInclusion = (index: number, value: string) => {
    const updated = [...inclusions];
    updated[index] = value;
    setInclusions(updated);
  };

  const addExclusion = () => {
    setExclusions([...exclusions, '']);
  };

  const removeExclusion = (index: number) => {
    setExclusions(exclusions.filter((_, i) => i !== index));
  };

  const updateExclusion = (index: number, value: string) => {
    const updated = [...exclusions];
    updated[index] = value;
    setExclusions(updated);
  };

  const handleFlightImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setFlightImagePreview(data.url);
    }
  };

  const removeFlightImage = () => {
    setFlightImage(null);
    setFlightImagePreview('');
    setTravelSummary(prev => ({ ...prev, flightImageUrl: '' }));
  };

  useEffect(() => {
    async function fetchMealPlans() {
      try {
        const res = await axios.get('/api/admin/meal-plans');
        setMealPlans(res.data);
      } catch {
        setMealPlans([]);
      } finally {
        setLoadingMealPlans(false);
      }
    }
    fetchMealPlans();
  }, []);

  useEffect(() => {
    async function fetchVehicles() {
      const res = await axios.get('/api/admin/vehicle-types');
      setVehicles(res.data);
    }
    async function fetchFlights() {
      const res = await axios.get('/api/admin/flight-routes');
      setFlightRoutes(res.data.routes);
    }
    fetchVehicles();
    fetchFlights();
  }, []);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await axios.get('/api/admin/hotels');
        setHotels(res.data.hotels);
      } catch {
        setHotels([]);
      }
    }
    fetchHotels();
  }, []);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await axios.get('/api/admin/destinations');
        setDestinations(res.data.destinations);
      } catch {
        setDestinations([]);
      }
    }
    fetchDestinations();
  }, []);

  React.useEffect(() => {
    const totalPerPerson = costing.landCostPerPerson + travelSummary.flightCostPerPerson;
    const totalGroup = totalPerPerson * travelSummary.groupSize;

    setCosting(prev => ({
      ...prev,
      flightCostPerPerson: travelSummary.flightCostPerPerson,
      totalCostPerPerson: totalPerPerson,
      totalGroupCost: totalGroup
    }));
  }, [costing.landCostPerPerson, travelSummary.flightCostPerPerson, travelSummary.groupSize]);

  function generateQuotationNo() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `QTN-${date}-${rand}`;
  }

  const totalNights = accommodations.reduce(
    (sum, acc) => sum + (acc.numberOfNights || 0),
    0
  );

  const mealPlanToSend = travelSummary.mealPlan === "__custom" ? travelSummary.mealPlanCustom : travelSummary.mealPlan;

  const vehicleUsedToSend = travelSummary.vehicleUsed === "__custom" ? travelSummary.vehicleUsedCustom : travelSummary.vehicleUsed;
  const localVehicleUsedToSend = travelSummary.localVehicleUsed === "__custom" ? travelSummary.localVehicleUsedCustom : travelSummary.localVehicleUsed;
  const payload = {
    quotationNo: generateQuotationNo(),
    logoUrl: "/logo.png",
    clientName: clientInfo.name,
    clientEmail: clientInfo.email,
    clientPhone: clientInfo.phone,
    clientAddress: clientInfo.address,
    travelDate: travelSummary.dateOfTravel,
    groupSize: travelSummary.groupSize,
    // mealPlan: travelSummary.mealPlan,
    mealPlan: mealPlanToSend,
    place: travelSummary.place,
    // vehicleUsed: travelSummary.vehicleUsed,
    vehicleUsed: vehicleUsedToSend,
    localVehicleUsed: localVehicleUsedToSend,
    // localVehicleUsed: travelSummary.localVehicleUsed,
    flightCost: travelSummary.flightCostPerPerson,
    flightImageUrl: flightImagePreview,
    landCostPerHead: costing.landCostPerPerson,
    totalPerHead: costing.totalCostPerPerson,
    totalGroupCost: costing.totalGroupCost,
    notes,
    status: "SENT",
    // accommodation: accommodations.map(acc => ({
    //   location: acc.location,
    //   hotelName: acc.hotelName,
    //   nights: acc.numberOfNights,
    // })),
    accommodation: accommodations.map(acc => ({
      location:
        acc.location === "__custom"
          ? acc.locationCustom || ""
          : acc.location,
      hotelName:
        acc.hotelName === "__custom"
          ? acc.hotelNameCustom || ""
          : acc.hotelName,
      nights: acc.numberOfNights,
    })),
    totalNights,
    itinerary: itinerary.map(item => ({
      dayTitle: item.dayTitle,
      description: item.description,
    })),
    inclusions: inclusions.filter(Boolean).map(item => ({ item })),
    exclusions: exclusions.filter(Boolean).map(item => ({ item })),
  };

  console.log("Accommodation Payload: ", payload.accommodation);
  const handleSubmitQuotation = async () => {
    try {
      const response = await axios.post('/api/user/new-quotation', payload);
      console.log(response.data);
      if (response.data.status === 201) {
        alert('Quotation created successfully!');
      } else {
        alert('Failed to create quotation. Please try again.');
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('An error occurred while creating the quotation. Please try again.');
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-green-500 pb-2 mb-0">
              New Quotation
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
          <div className="space-y-8">
            {/* Client Details */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Client Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName" className="text-gray-700 font-medium">Client Name</Label>
                    <Input
                      id="clientName"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="e.g. Joe Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="e.g. aman@email.com"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
                    <Textarea
                      id="address"
                      rows={3}
                      value={clientInfo.address}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="e.g. 123, Main Street, Lucknow"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Travel Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dateOfTravel" className="text-gray-700 font-medium">Date of Travel</Label>
                    <Input
                      id="dateOfTravel"
                      type="date"
                      value={travelSummary.dateOfTravel}
                      onChange={(e) => setTravelSummary(prev => ({ ...prev, dateOfTravel: e.target.value }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    />
                  </div>
                  <div className='text-gray-700 font-medium'>
                    <Label className="text-gray-700 font-medium">Local Vehicle Used</Label>
                    <select
                      id="localVehicleUsed"
                      value={travelSummary.localVehicleUsed}
                      onChange={e => setTravelSummary(prev => ({ ...prev, localVehicleUsed: e.target.value }))}
                      className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
                    >
                      <option value="">Select local vehicle...</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.name}>
                          {vehicle.name} {vehicle.type ? `${vehicle.type}` : ""}
                        </option>
                      ))}
                      <option value="__custom">Other (Add new)</option>
                    </select>
                    {travelSummary.localVehicleUsed === "__custom" && (
                      <Input
                        value={travelSummary.localVehicleUsedCustom || ""}
                        onChange={e => setTravelSummary(prev => ({ ...prev, localVehicleUsedCustom: e.target.value }))}
                        placeholder="Enter custom local vehicle"
                        className="mt-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="groupSize" className="text-gray-700 font-medium">Group Size (Pax)</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min="1"
                      value={travelSummary.groupSize}
                      onChange={(e) => setTravelSummary(prev => ({ ...prev, groupSize: parseInt(e.target.value) || 1 }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mealPlan" className="text-gray-700 font-medium">Meal Plan</Label>
                    <select
                      id="mealPlan"
                      value={travelSummary.mealPlan}
                      onChange={e => setTravelSummary(prev => ({ ...prev, mealPlan: e.target.value }))}
                      className="mt-1 block w-full h-10 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
                    >
                      <option value="">Select meal plan...</option>
                      {mealPlans.map(plan => (
                        <option key={plan.id} value={plan.code}>
                          {plan.code} {plan.description ? `- ${plan.description}` : ""}
                        </option>
                      ))}
                      <option value="__custom">Other (Add new)</option>
                    </select>
                    {travelSummary.mealPlan === "__custom" && (
                      <Input
                        value={travelSummary.mealPlanCustom || ""}
                        onChange={e => setTravelSummary(prev => ({ ...prev, mealPlanCustom: e.target.value }))}
                        placeholder="Enter custom meal plan"
                        className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="place" className="text-gray-700 font-medium">Place</Label>
                    <Combobox
                      value={travelSummary.place}
                      onChange={value => setTravelSummary(prev => ({ ...prev, place: value ?? "" }))}
                    >
                      <div className="relative">
                        <Combobox.Input
                          className="mt-1 block w-full h-10 rounded-md pl-1 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                          displayValue={value => String(value)}
                          onChange={e => setQuery(e.target.value)}
                          placeholder="Start typing destination..."
                        />
                        <Combobox.Options className="absolute z-10 mt-1 pl-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:ring-green-500 focus:border-green-500 text-gray-900">
                          {filteredDestinations.length === 0 && query !== '' ? (
                            <Combobox.Option value={query} className="cursor-pointer px-4 py-2">
                              Add "{query}"
                            </Combobox.Option>
                          ) : (
                            filteredDestinations.map(dest => (
                              <Combobox.Option key={dest.id} value={dest.name} className="cursor-pointer px-4 py-2">
                                {dest.name} {dest.state ? `(${dest.state})` : ''}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </div>
                    </Combobox>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className='text-gray-700 font-medium'>
                    <div>
                      <Label htmlFor="airline" className="text-gray-700 font-medium">Airline</Label>
                      <select
                        id="airline"
                        value={travelSummary.vehicleUsed}
                        onChange={e => {
                          const selectedId = Number(e.target.value);
                          const selectedRoute = flightRoutes.find(route => route.id === selectedId);
                          setTravelSummary(prev => ({
                            ...prev,
                            vehicleUsed: e.target.value,
                            flightCostPerPerson: selectedRoute ? selectedRoute.baseFare : 0,
                          }));
                        }}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
                      >
                        <option value="">Select airline...</option>
                        {flightRoutes.map(route => (
                          <option key={route.id} value={route.id}>
                            {route.airline} ({route.origin} → {route.destination})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="flightCostPerPerson" className="text-gray-700 font-medium">Flight Cost per Person</Label>
                    <Input
                      id="flightCostPerPerson"
                      type="number"
                      min="0"
                      value={travelSummary.flightCostPerPerson}
                      onChange={e =>
                        setTravelSummary(prev => ({
                          ...prev,
                          flightCostPerPerson: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="e.g. 12000"
                    />
                  </div>
                </div>

                {/* Flight Image Upload */}
                <div>
                  <Label className="text-gray-700 font-medium">Upload Flight Image</Label>
                  {!flightImagePreview ? (
                    <div className="mt-1 border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-green-500" />
                      <div className="mt-2">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleFlightImageUpload}
                          className="hidden"
                          id="flightImage"
                        />
                        <label
                          htmlFor="flightImage"
                          className="cursor-pointer text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          Click to upload flight image
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  ) : (
                    <div className="mt-1 relative">
                      <img
                        src={flightImagePreview}
                        alt="Flight preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeFlightImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Accommodation Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Accommodation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {accommodations.map((accommodation, index) => (
                  <div key={accommodation.id} className="bg-gray-50 p-4 rounded-xl relative">
                    {accommodations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute cursor-pointer top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => removeAccommodation(accommodation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-700 font-medium">Location</Label>
                        {/* <select
                          value={accommodation.hotelName}
                          onChange={e => {
                            const selectedHotel = hotels.find(h => h.name === e.target.value);
                            updateAccommodation(accommodation.id, 'hotelName', e.target.value);
                            if (selectedHotel && selectedHotel.venue) {
                              updateAccommodation(accommodation.id, 'location', selectedHotel.venue.address || '');
                            }
                          }}
                          className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
                        >
                          <option value="">Select Location...</option>
                          {hotels.map(hotel => (
                            <option key={hotel.id} value={hotel.name}>
                              {hotel.venue?.address ? ` ${hotel.venue.address}` : ""}
                            </option>
                          ))}
                          <option value="__custom">Other (Add new)</option>
                        </select> */}

                        {/* {accommodation.hotelName === '__custom' && ( */}
                        <Input
                          placeholder='e.g. Leh, Ladakh'
                          value={accommodation.location}
                          onChange={(e) => updateAccommodation(accommodation.id, 'location', e.target.value)}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        />
                        {/* )} */}
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Hotel Name or Similar</Label>
                        <select
                          value={accommodation.hotelName}
                          onChange={e => {
                            const selectedHotel = hotels.find(h => h.name === e.target.value);
                            if (e.target.value !== "__custom" && selectedHotel?.venue?.address) { 
                              setAccommodations(accommodations.map(acc =>
                                acc.id === accommodation.id
                                  ? { ...acc, hotelName: e.target.value, location: selectedHotel.venue?.address || "" }
                                  : acc
                              ));
                            } else if (e.target.value === "__custom") { 
                              setAccommodations(accommodations.map(acc =>
                                acc.id === accommodation.id
                                  ? { ...acc, hotelName: e.target.value, location: '' }
                                  : acc
                              ));
                            } else { 
                              updateAccommodation(accommodation.id, 'hotelName', e.target.value);
                            } 
                          }}
                          className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
                        >
                          <option value="">Select hotel...</option>
                          {hotels.map(hotel => (
                            <option key={hotel.id} value={hotel.name}>
                              {hotel.name}
                              {/* {hotel.venue?.name} */}
                            </option>
                          ))}
                          <option value="__custom">Other (Add new)</option>
                        </select>
                        {accommodation.hotelName === "__custom" && (
                          <Input
                            value={accommodation.hotelNameCustom || ""}
                            onChange={e => {
                              updateAccommodation(accommodation.id, 'hotelNameCustom', e.target.value)
                            }}
                            placeholder="Enter custom hotel name"
                            className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900" />
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Number of Nights</Label>
                        <Input
                          type="number"
                          min="1"
                          value={accommodation.numberOfNights}
                          onChange={(e) => updateAccommodation(accommodation.id, 'numberOfNights', parseInt(e.target.value) || 1)}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer border-dashed border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={addAccommodation}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Accommodation
                </Button>
              </CardContent>
            </Card>

            {/* Day-by-Day Itinerary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Day-by-Day Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {itinerary.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-xl relative">
                    {itinerary.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => removeItineraryItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-700 font-medium">Day Title</Label>
                        <Input
                          placeholder="e.g., Day 1: Arrival in Leh"
                          value={item.dayTitle}
                          onChange={(e) => updateItineraryItem(item.id, 'dayTitle', e.target.value)}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Description</Label>
                        <Textarea
                          rows={3}
                          value={item.description}
                          onChange={(e) => updateItineraryItem(item.id, 'description', e.target.value)}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={addItineraryItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Day
                </Button>
              </CardContent>
            </Card>

            {/* Inclusions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Inclusions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inclusions.map((inclusion, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={inclusion}
                      onChange={(e) => updateInclusion(index, e.target.value)}
                      placeholder="Enter inclusion item"
                      className="focus:ring-green-500 focus:border-green-500 text-gray-900"
                    />
                    {inclusions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeInclusion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={addInclusion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Inclusion
                </Button>
              </CardContent>
            </Card>

            {/* Exclusions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Exclusions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exclusions.map((exclusion, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={exclusion}
                      onChange={(e) => updateExclusion(index, e.target.value)}
                      placeholder="Enter exclusion item"
                      className="focus:ring-green-500 focus:border-green-500 text-gray-900"
                    />
                    {exclusions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeExclusion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={addExclusion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exclusion
                </Button>
              </CardContent>
            </Card>

            {/* Costing Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Costing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landCost" className="text-gray-700 font-medium">Land Cost Per Person</Label>
                    <Input
                      id="landCost"
                      type="number"
                      min="0"
                      value={costing.landCostPerPerson}
                      onChange={(e) => setCosting(prev => ({ ...prev, landCostPerPerson: parseFloat(e.target.value) || 0 }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Flight Cost Per Person</Label>
                    <Input
                      value={costing.flightCostPerPerson}
                      disabled
                      className="mt-1 bg-gray-100 text-gray-700"
                    />
                  </div>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium">Total Cost Per Person</Label>
                    <Input
                      value={costing.totalCostPerPerson}
                      disabled
                      className="mt-1 bg-gray-100 font-semibold text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Total Group Cost</Label>
                    <Input
                      value={costing.totalGroupCost}
                      disabled
                      className="mt-1 bg-gray-100 font-semibold text-gray-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes & Terms */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions, cancellation policy, payment terms..."
                  className="focus:ring-green-500 focus:border-green-500 text-gray-900"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-end gap-3">
              {/* <Button variant="outline" className="border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700">
                Save as Draft
              </Button> */}
              <Button onClick={() => setShowPdfPreview(true)} variant="ghost" className="border border-gray-300 hover:bg-gray-50 text-gray-700">
                Preview PDF
              </Button>
              <Button onClick={handleSubmitQuotation} className="bg-green-600 hover:bg-green-700 text-white">
                Send Quotation
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showPdfPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full h-[80vh] flex flex-col">
            <Button
              className="self-end cursor-pointer mb-2 text-red-500"
              variant="ghost"
              onClick={() => setShowPdfPreview(false)}
            >
              Close
            </Button>
            <PDFViewer width="100%" height="100%">
              <QuotationPDF payload={payload} />
            </PDFViewer>
          </div>
        </div>
      )}
    </Layout>
  );
}