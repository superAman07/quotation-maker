"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import Layout from '@/components/Layout';
import axios from 'axios';

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
  vehicleUsed: string;
  localVehicleUsed: string;
  flightCostPerPerson: number;
  flightImageUrl: string;
}

interface Accommodation {
  id: string;
  location: string;
  hotelName: string;
  numberOfNights: number;
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
    vehicleUsed: '',
    localVehicleUsed: '',
    flightCostPerPerson: 0,
    flightImageUrl: ''
  });

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

  const handleFlightImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFlightImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFlightImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFlightImage = () => {
    setFlightImage(null);
    setFlightImagePreview('');
    setTravelSummary(prev => ({ ...prev, flightImageUrl: '' }));
  };

  // Auto-calculate costing
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
  const payload = {
    quotationNo: generateQuotationNo(),
    clientName: clientInfo.name,
    clientEmail: clientInfo.email,
    clientPhone: clientInfo.phone,
    clientAddress: clientInfo.address,
    travelDate: travelSummary.dateOfTravel,
    groupSize: travelSummary.groupSize,
    mealPlan: travelSummary.mealPlan,
    vehicleUsed: travelSummary.vehicleUsed,
    localVehicleUsed: travelSummary.localVehicleUsed,
    flightCost: travelSummary.flightCostPerPerson,
    flightImageUrl: travelSummary.flightImageUrl,
    landCostPerHead: costing.landCostPerPerson,
    totalPerHead: costing.totalCostPerPerson,
    totalGroupCost: costing.totalGroupCost,
    notes,
    status: "SENT",
    accommodation: accommodations.map(acc => ({
      location: acc.location,
      hotelName: acc.hotelName,
      nights: acc.numberOfNights,
    })),
    itinerary: itinerary.map(item => ({
      dayTitle: item.dayTitle,
      description: item.description,
    })),
    inclusions: inclusions.filter(Boolean).map(item => ({ item })),
    exclusions: exclusions.filter(Boolean).map(item => ({ item })),
  };

  const handleSubmitQuotation = async () => {
    try {
      const response = await axios.post('/api/user/new-quotation', payload);
      console.log(response.data);
      if (response.data.status === 201) {
        alert('Quotation created successfully!');
        // Optionally redirect or reset the form
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
                  <div>
                    <Label className="text-gray-700 font-medium">Local Vehicle Used</Label>
                    <Input
                      type="text"
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      value={travelSummary.localVehicleUsed}
                      onChange={e => setTravelSummary({ ...travelSummary, localVehicleUsed: e.target.value })}
                      placeholder="e.g. Innova, Tempo Traveller"
                    />
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
                    <Input
                      id="mealPlan"
                      value={travelSummary.mealPlan}
                      onChange={(e) => setTravelSummary(prev => ({ ...prev, mealPlan: e.target.value }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="e.g. MAP (Breakfast + Dinner)"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleUsed" className="text-gray-700 font-medium">Vehicle Used</Label>
                    <Input
                      id="vehicleUsed"
                      value={travelSummary.vehicleUsed}
                      onChange={(e) => setTravelSummary(prev => ({ ...prev, vehicleUsed: e.target.value }))}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                      placeholder="e.g. Air India Flight AI-123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flightCost" className="text-gray-700 font-medium">Flight Cost per Person</Label>
                    <Input
                      id="flightCost"
                      type="number"
                      min="0"
                      value={travelSummary.flightCostPerPerson}
                      onChange={(e) => setTravelSummary(prev => ({ ...prev, flightCostPerPerson: parseFloat(e.target.value) || 0 }))}
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
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => removeAccommodation(accommodation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-700 font-medium">Location</Label>
                        <Input
                          value={accommodation.location}
                          onChange={(e) => updateAccommodation(accommodation.id, 'location', e.target.value)}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Hotel Name or Similar</Label>
                        <Input
                          value={accommodation.hotelName}
                          onChange={(e) => updateAccommodation(accommodation.id, 'hotelName', e.target.value)}
                          className="mt-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        />
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
                  className="w-full border-dashed border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
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
              <Button variant="outline" className="border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700">
                Save as Draft
              </Button>
              <Button variant="ghost" className="border border-gray-300 hover:bg-gray-50 text-gray-700">
                Preview PDF
              </Button>
              <Button onClick={handleSubmitQuotation} className="bg-green-600 hover:bg-green-700 text-white">
                Send Quotation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}




// 'use client';

// import { useState } from 'react';
// import Layout from '@/components/Layout';
// import jsPDF from 'jspdf';
// import { Plus, Minus, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
// import axios from 'axios';

// interface ItineraryItem {
//   id: string;
//   day: number;
//   activity: string;
//   date: string;
//   cost: number;
// }

// interface AdditionalService {
//   id: string;
//   type: string;
//   details: string;
//   cost: number;
// }

// export default function NewQuotation() {
//   const [clientInfo, setClientInfo] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: ''
//   });

//   const [travelDetails, setTravelDetails] = useState({
//     departureCity: '',
//     destination: '',
//     departureDate: '',
//     returnDate: '',
//     travelers: 1
//   });

//   const [itinerary, setItinerary] = useState<ItineraryItem[]>([
//     { id: '1', day: 1, activity: '', date: '', cost: 0 }
//   ]);

//   const [services, setServices] = useState<AdditionalService[]>([
//     { id: '1', type: 'Hotel', details: '', cost: 0 }
//   ]);

//   const [pricing, setPricing] = useState({
//     taxRate: 10,
//     discount: 0,
//     notes: ''
//   });

//   const addItineraryItem = () => {
//     const newItem: ItineraryItem = {
//       id: Date.now().toString(),
//       day: itinerary.length + 1,
//       activity: '',
//       date: '',
//       cost: 0
//     };
//     setItinerary([...itinerary, newItem]);
//   };

//   const removeItineraryItem = (id: string) => {
//     setItinerary(itinerary.filter(item => item.id !== id));
//   };

//   function handlePreviewPDF() {
//     const doc = new jsPDF();

//     // Add Travomine logo (top right)
//     doc.addImage('/logo.png', 'PNG', 130, 15, 70, 20); // x, y, width, height

//     // Header
//     doc.setFontSize(22);
//     doc.setTextColor('#6C733D');
//     doc.text('Quotation', 20, 25);

//     doc.setFontSize(12);
//     doc.setTextColor('#252426');
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);

//     // Client Info
//     doc.setFontSize(14);
//     doc.setTextColor('#252426');
//     doc.text('Client Information', 20, 50);
//     doc.setFontSize(11);
//     doc.text(`Name: ${clientInfo.name}`, 20, 58);
//     doc.text(`Email: ${clientInfo.email}`, 20, 64);
//     doc.text(`Phone: ${clientInfo.phone}`, 20, 70);
//     doc.text(`Address: ${clientInfo.address}`, 20, 76);

//     // Travel Details
//     doc.setFontSize(14);
//     doc.text('Travel Details', 20, 90);
//     doc.setFontSize(11);
//     doc.text(`From: ${travelDetails.departureCity}`, 20, 98);
//     doc.text(`To: ${travelDetails.destination}`, 20, 104);
//     doc.text(`Departure: ${travelDetails.departureDate}`, 20, 110);
//     doc.text(`Return: ${travelDetails.returnDate || '-'}`, 20, 116);
//     doc.text(`Travelers: ${travelDetails.travelers}`, 20, 122);

//     // Itinerary Table
//     doc.setFontSize(14);
//     doc.text('Itinerary', 20, 136);
//     doc.setFontSize(11);
//     let y = 142;
//     itinerary.forEach((item, idx) => {
//       doc.text(`Day ${item.day}: ${item.activity} (${item.date}) - $${item.cost.toFixed(2)}`, 22, y);
//       y += 6;
//     });

//     // Additional Services
//     doc.setFontSize(14);
//     doc.text('Additional Services', 20, y + 8);
//     doc.setFontSize(11);
//     y += 14;
//     services.forEach(service => {
//       doc.text(`${service.type}: ${service.details} - $${service.cost.toFixed(2)}`, 22, y);
//       y += 6;
//     });

//     // Pricing Summary
//     y += 10;
//     doc.setFontSize(14);
//     doc.text('Pricing Summary', 20, y);
//     doc.setFontSize(11);
//     y += 8;
//     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 22, y);
//     y += 6;
//     doc.text(`Tax (${pricing.taxRate}%): $${taxAmount.toFixed(2)}`, 22, y);
//     y += 6;
//     doc.text(`Discount (${pricing.discount}%): -$${discountAmount.toFixed(2)}`, 22, y);
//     y += 6;
//     doc.setFontSize(13);
//     doc.setTextColor('#6C733D');
//     doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 22, y);

//     // Notes
//     y += 12;
//     doc.setFontSize(11);
//     doc.setTextColor('#252426');
//     doc.text('Notes & Terms:', 20, y);
//     y += 6;
//     doc.setFontSize(10);
//     doc.text(pricing.notes || '-', 22, y);

//     // Footer
//     doc.setFontSize(10);
//     doc.setTextColor('#888');
//     doc.text('Thank you for choosing Travomine!', 20, 280);

//     doc.save('quotation.pdf');
//   }
//   const addService = () => {
//     const newService: AdditionalService = {
//       id: Date.now().toString(),
//       type: 'Hotel',
//       details: '',
//       cost: 0
//     };
//     setServices([...services, newService]);
//   };

//   const removeService = (id: string) => {
//     setServices(services.filter(service => service.id !== id));
//   };

//   const calculateSubtotal = () => {
//     const itineraryTotal = itinerary.reduce((sum, item) => sum + item.cost, 0);
//     const servicesTotal = services.reduce((sum, service) => sum + service.cost, 0);
//     return itineraryTotal + servicesTotal;
//   };

//   const subtotal = calculateSubtotal();
//   const taxAmount = subtotal * (pricing.taxRate / 100);
//   const discountAmount = subtotal * (pricing.discount / 100);
//   const grandTotal = subtotal + taxAmount - discountAmount;

//   const payload = {
//     quotationNo: `Q${Date.now()}`,
//     clientName: clientInfo.name,
//     clientEmail: clientInfo.email,
//     clientAddress: clientInfo.address,
//     departureCity: travelDetails.departureCity,
//     destinationCity: travelDetails.destination,
//     departureDate: travelDetails.departureDate,
//     returnDate: travelDetails.returnDate || null,
//     travelersCount: travelDetails.travelers,
//     subtotal,
//     tax: taxAmount,
//     discount: discountAmount,
//     total: grandTotal,
//     itinerary: itinerary.map(item => ({
//       day: item.day,
//       activity: item.activity,
//       date: item.date,
//       cost: item.cost,
//     })),
//     services: services.map(service => ({
//       type: service.type,
//       details: service.details,
//       cost: service.cost,
//     })),
//     notes: pricing.notes,
//     status: "SENT",
//   };

//   const handleSubmitQuotation = async () => {
//     try {
//       const res = await axios.post('/api/user/new-quotation', payload)
//       if (res.status === 201) {
//         alert("Quotation sent successfully!");
//       } else {
//         alert(res.data.error || "Failed to send quotation");
//       }
//     } catch (err: any) {
//       console.error("SEND QUOTATION ERROR:", err);
//       alert(err.response?.data?.error || "Something went wrong");
//     } finally {}
//   }

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto space-y-8">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <h1 className="text-2xl font-bold text-[#252426] mb-6 border-b-2 border-[#9DA65D] pb-2">New Quotation</h1>

//           {/* Client Information */}
//           <section className="mb-8">
//             <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Client Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
//                 <input
//                   type="text"
//                   className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                   value={clientInfo.name}
//                   onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                 <input
//                   type="email"
//                   className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                   value={clientInfo.email}
//                   onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                 <input
//                   type="tel"
//                   className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                   value={clientInfo.phone}
//                   onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
//                 <textarea
//                   className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                   rows={3}
//                   value={clientInfo.address}
//                   onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Travel Details */}
//           <section className="mb-8">
//             <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Travel Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     className="w-full pl-10 text-gray-700 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                     value={travelDetails.departureCity}
//                     onChange={(e) => setTravelDetails({ ...travelDetails, departureCity: e.target.value })}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     className="w-full pl-10 pr-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                     value={travelDetails.destination}
//                     onChange={(e) => setTravelDetails({ ...travelDetails, destination: e.target.value })}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
//                 <div className="relative">
//                   <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="number"
//                     min="1"
//                     className="w-full pl-10 pr-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                     value={travelDetails.travelers}
//                     onChange={(e) => setTravelDetails({ ...travelDetails, travelers: parseInt(e.target.value) })}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="date"
//                     className="w-full pl-10 pr-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                     value={travelDetails.departureDate}
//                     onChange={(e) => setTravelDetails({ ...travelDetails, departureDate: e.target.value })}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Return Date (Optional)</label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="date"
//                     className="w-full pl-10 pr-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                     value={travelDetails.returnDate}
//                     onChange={(e) => setTravelDetails({ ...travelDetails, returnDate: e.target.value })}
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Itinerary */}
//           <section className="mb-8">
//             <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Itinerary</h2>
//             <div className="space-y-4">
//               {itinerary.map((item, index) => (
//                 <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       <span className="bg-[#6C733D] text-white px-3 py-1 rounded-full text-sm font-medium">
//                         Day {item.day}
//                       </span>
//                     </div>
//                     {itinerary.length > 1 && (
//                       <button
//                         onClick={() => removeItineraryItem(item.id)}
//                         className="text-red-500 hover:text-red-700 p-1"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Activity Description</label>
//                       <input
//                         type="text"
//                         className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                         value={item.activity}
//                         onChange={(e) => {
//                           const updated = itinerary.map(i =>
//                             i.id === item.id ? { ...i, activity: e.target.value } : i
//                           );
//                           setItinerary(updated);
//                         }}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                       <input
//                         type="date"
//                         className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                         value={item.date}
//                         onChange={(e) => {
//                           const updated = itinerary.map(i =>
//                             i.id === item.id ? { ...i, date: e.target.value } : i
//                           );
//                           setItinerary(updated);
//                         }}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
//                       <div className="relative">
//                         <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         <input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           className="w-full pl-10 pr-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                           value={item.cost}
//                           onChange={(e) => {
//                             const updated = itinerary.map(i =>
//                               i.id === item.id ? { ...i, cost: parseFloat(e.target.value) || 0 } : i
//                             );
//                             setItinerary(updated);
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <button
//                 onClick={addItineraryItem}
//                 className="w-full border-2 border-dashed border-[#9DA65D] text-[#6C733D] py-3 rounded-lg hover:bg-[#6C733D] hover:text-white transition-colors flex items-center justify-center gap-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Another Day
//               </button>
//             </div>
//           </section>

//           {/* Additional Services */}
//           <section className="mb-8">
//             <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Additional Services</h2>
//             <div className="space-y-4">
//               {services.map((service) => (
//                 <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-medium text-gray-700">Service</h3>
//                     {services.length > 1 && (
//                       <button
//                         onClick={() => removeService(service.id)}
//                         className="text-red-500 hover:text-red-700 p-1"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
//                       <select
//                         className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                         value={service.type}
//                         onChange={(e) => {
//                           const updated = services.map(s =>
//                             s.id === service.id ? { ...s, type: e.target.value } : s
//                           );
//                           setServices(updated);
//                         }}
//                       >
//                         <option value="Hotel">Hotel</option>
//                         <option value="Flight">Flight</option>
//                         <option value="Tour">Tour</option>
//                         <option value="Insurance">Insurance</option>
//                         <option value="Transport">Transport</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
//                       <input
//                         type="text"
//                         className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                         value={service.details}
//                         onChange={(e) => {
//                           const updated = services.map(s =>
//                             s.id === service.id ? { ...s, details: e.target.value } : s
//                           );
//                           setServices(updated);
//                         }}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
//                       <div className="relative">
//                         <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         <input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           className="w-full pl-10 pr-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                           value={service.cost}
//                           onChange={(e) => {
//                             const updated = services.map(s =>
//                               s.id === service.id ? { ...s, cost: parseFloat(e.target.value) || 0 } : s
//                             );
//                             setServices(updated);
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <button
//                 onClick={addService}
//                 className="w-full border-2 border-dashed border-[#9DA65D] text-[#6C733D] py-3 rounded-lg hover:bg-[#6C733D] hover:text-white transition-colors flex items-center justify-center gap-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Service
//               </button>
//             </div>
//           </section>

//           {/* Pricing Summary */}
//           <section className="mb-8">
//             <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Pricing Summary</h2>
//             <div className="bg-gray-50 p-6 rounded-lg">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       step="0.1"
//                       className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                       value={pricing.taxRate}
//                       onChange={(e) => setPricing({ ...pricing, taxRate: parseFloat(e.target.value) || 0 })}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       step="0.1"
//                       className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//                       value={pricing.discount}
//                       onChange={(e) => setPricing({ ...pricing, discount: parseFloat(e.target.value) || 0 })}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Subtotal:</span>
//                     <span className="font-medium text-gray-700">${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tax ({pricing.taxRate}%):</span>
//                     <span className="font-medium text-gray-700">${taxAmount.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Discount ({pricing.discount}%):</span>
//                     <span className="font-medium text-red-600 ">-${discountAmount.toFixed(2)}</span>
//                   </div>
//                   <div className="border-t pt-3">
//                     <div className="flex justify-between">
//                       <span className="text-lg font-bold text-[#252426]">Grand Total:</span>
//                       <span className="text-lg font-bold text-[#6C733D]">${grandTotal.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Notes & Terms */}
//           <section className="mb-8">
//             <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Notes & Terms</h2>
//             <textarea
//               className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
//               rows={4}
//               placeholder="Enter any special instructions, terms, or conditions..."
//               value={pricing.notes}
//               onChange={(e) => setPricing({ ...pricing, notes: e.target.value })}
//             />
//           </section>
//         </div>

//         {/* Sticky Actions */}
//         <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
//           <div className="flex flex-col sm:flex-row gap-3 justify-end">
//             <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
//               Save Draft
//             </button>
//             <button onClick={handlePreviewPDF} className="px-6 py-3 border border-[#6C733D] text-[#6C733D] rounded-lg hover:bg-[#6C733D] hover:text-white transition-colors">
//               Preview PDF
//             </button>
//             <button onClick={handleSubmitQuotation} className="px-6 py-3 bg-[#6C733D] text-white rounded-lg hover:bg-[#5a5f33] transition-colors">
//               Send Quotation
//             </button>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }