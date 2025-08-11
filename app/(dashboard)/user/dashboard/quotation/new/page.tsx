"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { QuotationPDF } from '@/components/Quotation-pdf';
import { PDFViewer } from '@react-pdf/renderer';
import { useToast } from '@/hooks/use-toast';

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}
interface TravelDetails {
  countryId: number | '';
  airportId: number | '';
  travelDate: string;
  groupSize: number;
  totalNights: number;
}

interface FlightDetails {
  costPerPerson: number;
  imageUrl: string;
}

interface AccommodationItem {
  id: string;
  location: string;
  hotelName: string;
  roomType: string;
  nights: number;
  price: number;
}

interface TransferItem {
  id: string;
  type: string;
  vehicleName: string;
  price: number;
}

interface ItineraryItem {
  id: string;
  dayTitle: string;
  description: string;
}

interface HotelBlueprint {
  id: number;
  name: string;
  destination: { name: string; state: string | null };
  rateCards: { roomType: string; rate: number }[];
  basePricePerNight: number;
}

interface TransferBlueprint {
  id: number;
  type: string;
  priceInINR: number;
  countryId: number;
}

interface MealPlanBlueprint {
  id: number;
  name: string;
  ratePerPerson: number;
  countryId: number;
}

interface DestinationBlueprint {
  id: number;
  name: string;
  state: string | null;
  countryId: number;
  description: string | null;
  imageUrl: string | null;
}

interface InclusionTemplateBlueprint {
  id: number;
  name: string;
  description: string;
}

interface ExclusionTemplateBlueprint {
  id: number;
  name: string;
  description: string;
}

interface CountryCurrencyBlueprint {
  countryId: number;
  currencyCode: string;
  conversionRate: number;
}

interface CountryBlueprint {
  id: number;
  name: string;
}

interface AirportBlueprint {
  id: number;
  name: string;
  code: string;
  countryId: number;
}

interface ActivityItem {
  id: string;
  name: string;
  transfer: string | null;
  adultPrice: number;
  childPrice: number | null;
  quantity: number;
  totalPrice: number;
}

export default function NewQuotationPage() {
  const { toast } = useToast();

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [travelDetails, setTravelDetails] = useState<TravelDetails>({ countryId: '', airportId: '', travelDate: '', groupSize: 1, totalNights: 0 });
  const [flightDetails, setFlightDetails] = useState<FlightDetails>({ costPerPerson: 0, imageUrl: '' });
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>([]);
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [allActivities, setAllActivities] = useState<any[]>([]);

  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  // --- Fetched Admin Data State ---
  const [allHotels, setAllHotels] = useState<HotelBlueprint[]>([]);
  const [allTransfers, setAllTransfers] = useState<TransferBlueprint[]>([]);
  const [allMealPlans, setAllMealPlans] = useState<MealPlanBlueprint[]>([]);
  const [allDestinations, setAllDestinations] = useState<DestinationBlueprint[]>([]);
  const [allInclusionTemplates, setAllInclusionTemplates] = useState<InclusionTemplateBlueprint[]>([]);
  const [allExclusionTemplates, setAllExclusionTemplates] = useState<ExclusionTemplateBlueprint[]>([]);
  const [allCountryCurrencies, setAllCountryCurrencies] = useState<CountryCurrencyBlueprint[]>([]);

  const [allCountries, setAllCountries] = useState<CountryBlueprint[]>([]);
  const [allAirports, setAllAirports] = useState<AirportBlueprint[]>([]);

  // --- UI & Loading State ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    async function fetchAllBlueprints() {
      try {
        const [
          countriesRes,
          airportsRes,
          destinationsRes,
          hotelsRes,
          transfersRes,
          mealPlansRes,
          currenciesRes,
          activitiesRes,
        ] = await Promise.all([
          axios.get('/api/user/countries'),
          axios.get('/api/user/airports'),
          axios.get('/api/user/destinations'),
          axios.get('/api/admin/hotels'),
          axios.get('/api/admin/transfer'),
          axios.get('/api/user/meal-plans'),
          axios.get('/api/user/country-currencies'),
          axios.get('/api/user/activities'),

        ]);

        console.log("Destinations from API:", destinationsRes.data.destinations);

        setAllCountries(countriesRes.data || []);
        setAllAirports(airportsRes.data || []);
        setAllDestinations(destinationsRes.data.destinations || []);
        setAllHotels(hotelsRes.data.hotels || []);
        setAllTransfers(transfersRes.data || []);
        setAllMealPlans(mealPlansRes.data || []);
        setAllCountryCurrencies(currenciesRes.data || []);
        setAllActivities(activitiesRes.data || []);

      } catch (error) {
        console.error("Failed to fetch initial data", error);
        toast({
          title: "Error",
          description: "Could not load required data from admin panel. Please check if all services are configured.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllBlueprints();
  }, [toast]);

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setClientInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTravelDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const parsedValue = ['groupSize', 'totalNights', 'countryId', 'airportId'].includes(name)
      ? parseInt(value, 10) || ''
      : value;

    setTravelDetails(prev => {
      const newDetails = { ...prev, [name]: parsedValue };
      if (name === 'countryId') {
        newDetails.airportId = '';
        setAccommodations([]);
      }
      return newDetails;
    });
  };

  const handleFlightDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFlightDetails(prev => ({
      ...prev,
      [name]: name === 'costPerPerson' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFlightImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFlightDetails(prev => ({ ...prev, imageUrl: response.data.url }));
      toast({
        title: "Success",
        description: "Flight image uploaded successfully.",
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addAccommodation = () => {
    setAccommodations(prev => [...prev, { id: Date.now().toString(), location: '', hotelName: '', roomType: '', nights: 1, price: 0 }]);
  };

  const updateAccommodation = (id: string, field: keyof AccommodationItem, value: any) => {
    setAccommodations(prev => prev.map(acc => acc.id === id ? { ...acc, [field]: value } : acc));
  };

  const removeAccommodation = (id: string) => {
    setAccommodations(prev => prev.filter(acc => acc.id !== id));
  };

  // --- Transfer Handlers ---
  const addTransfer = () => {
    setTransfers(prev => [...prev, { id: Date.now().toString(), type: 'Intercity', vehicleName: '', price: 0 }]);
  };

  const updateTransfer = (id: string, field: keyof TransferItem, value: any) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTransfer = (id: string) => {
    setTransfers(prev => prev.filter(t => t.id !== id));
  };

  const [selectedMealPlan, setSelectedMealPlan] = useState('');

  const addItineraryDay = () => {
    setItinerary(prev => [...prev, { id: Date.now().toString(), dayTitle: '', description: '' }]);
  };

  const updateItineraryDay = (id: string, field: keyof ItineraryItem, value: string) => {
    setItinerary(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItineraryDay = (id: string) => {
    setItinerary(prev => prev.filter(item => item.id !== id));
  };

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions(prev => [...prev, newInclusion.trim()]);
      setNewInclusion('');
    }
  };

  const removeInclusion = (index: number) => {
    setInclusions(prev => prev.filter((_, i) => i !== index));
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setExclusions(prev => [...prev, newExclusion.trim()]);
      setNewExclusion('');
    }
  };

  const removeExclusion = (index: number) => {
    setExclusions(prev => prev.filter((_, i) => i !== index));
  };

  const addActivity = () => {
    setActivities(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      transfer: null,
      adultPrice: 0,
      childPrice: 0,
      quantity: 1,
      totalPrice: 0
    }]);
  };

  const updateActivity = (id: string, field: keyof ActivityItem, value: any) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === id) {
        const updated = { ...activity, [field]: value };

        // if (field === 'quantity' || field === 'adultPrice' || field === 'childPrice') {
        //   updated.totalPrice = ((updated.adultPrice ?? 0) + (updated.childPrice ?? 0)) * updated.quantity;
        // }
        if (field === 'adultPrice' || field === 'childPrice') {
          updated.totalPrice = (updated.adultPrice ?? 0) + (updated.childPrice ?? 0);
        }
        if (field === 'quantity') { 
           updated.totalPrice = ((updated.adultPrice ?? 0) + (updated.childPrice ?? 0)) * updated.quantity;
        }

        return updated;
      }
      return activity;
    }));
  };

  const removeActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const handleSubmit = async (status: 'DRAFT' | 'SENT') => {
    if (!clientInfo.name) {
      toast({ title: "Error", description: "Client name is required" });
      return;
    }

    if (!travelDetails.travelDate) {
      toast({ title: "Error", description: "Travel date is required" });
      return;
    }
    setIsSubmitting(true);

    const totalNights = accommodations.reduce((sum, acc) => sum + acc.nights, 0);
    const totalAccommodationCost = accommodations.reduce((sum, acc) => sum + (acc.price * acc.nights), 0);
    const totalTransferCost = transfers.reduce((sum, t) => sum + t.price, 0);
    const selectedMealPlanObject = allMealPlans.find(p => p.name === selectedMealPlan);
    const mealPlanCost = selectedMealPlanObject ? selectedMealPlanObject.ratePerPerson : 0;

    const totalActivitiesCost = activities.reduce((sum, act) => sum + act.totalPrice, 0);

    const activitiesCostPerPerson = travelDetails.groupSize > 0 ? totalActivitiesCost / travelDetails.groupSize : 0;
    const accommodationAndTransferCostPerPerson = travelDetails.groupSize > 0
      ? (totalAccommodationCost + totalTransferCost) / travelDetails.groupSize
      : 0;
    const landCostPerHead = mealPlanCost + accommodationAndTransferCostPerPerson + activitiesCostPerPerson;
    // const landCostPerHead = mealPlanCost + (totalAccommodationCost / travelDetails.groupSize) + (totalTransferCost / travelDetails.groupSize) + activitiesCostPerPerson;

    const totalPerHead = landCostPerHead + flightDetails.costPerPerson;
    const totalGroupCost = totalPerHead * travelDetails.groupSize;

    const selectedCountry = allCountries.find(c => c.id === travelDetails.countryId);
    const place = selectedCountry ? selectedCountry.name : 'N/A';

    const payload = {
      // Client Info
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      clientAddress: clientInfo.address,

      // Travel Details
      travelDate: travelDetails.travelDate,
      groupSize: travelDetails.groupSize,
      totalNights: totalNights,
      place: place,

      // Flight Details
      flightCost: flightDetails.costPerPerson,
      flightImageUrl: flightDetails.imageUrl,

      // Services
      accommodations: accommodations.map(({ id, ...rest }) => rest),
      transfers: transfers.map(({ id, ...rest }) => rest),
      mealPlan: selectedMealPlan,
      itinerary: itinerary.map(({ id, ...rest }) => rest),
      inclusions: inclusions.map(item => ({ item })),
      exclusions: exclusions.map(item => ({ item })),
      activities: activities.map(({ id, ...rest }) => rest),

      // Costing
      landCostPerHead: landCostPerHead,
      totalPerHead: totalPerHead,
      totalGroupCost: totalGroupCost,

      // Meta
      notes: notes,
      status: status,
    };

    console.log("SUBMITTING PAYLOAD:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post('/api/user/new-quotation', payload);
      toast({ title: "Success", description: `Quotation saved as ${status.toLowerCase()}.` });
      // window.location.href = '/user/dashboard/quotations';
      console.log("Quotation created successfully:", response.data);

      toast({ title: "Payload Assembled!", description: "Check the browser console to see the payload." });
    } catch (error) {
      console.error("Failed to create quotation:", error);
      toast({ title: "Error", description: "Could not save the quotation.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePdfPreview = () => {
    // Calculate derived values (same as in handleSubmit)
    const totalNights = accommodations.reduce((sum, acc) => sum + acc.nights, 0);
    const totalAccommodationCost = accommodations.reduce((sum, acc) => sum + (acc.price * acc.nights), 0);
    const totalTransferCost = transfers.reduce((sum, t) => sum + t.price, 0);
    const selectedMealPlanObject = allMealPlans.find(p => p.name === selectedMealPlan);
    const mealPlanCost = selectedMealPlanObject ? selectedMealPlanObject.ratePerPerson : 0;

    const totalActivitiesCost = activities.reduce((sum, act) => sum + act.totalPrice, 0);

    // const activitiesCostPerPerson = totalActivitiesCost;
    const activitiesCostPerPerson = travelDetails.groupSize > 0
      ? totalActivitiesCost / travelDetails.groupSize
      : 0;

    const accommodationAndTransferCostPerPerson = travelDetails.groupSize > 0 ? (totalAccommodationCost + totalTransferCost) / travelDetails.groupSize : 0;

    const landCostPerHead = mealPlanCost + accommodationAndTransferCostPerPerson + activitiesCostPerPerson;

    const totalPerHead = landCostPerHead + flightDetails.costPerPerson;
    const totalGroupCost = totalPerHead * travelDetails.groupSize;

    // Find the country name
    const selectedCountry = allCountries.find(c => c.id === travelDetails.countryId);
    const place = selectedCountry ? selectedCountry.name : 'N/A';

    // Format the data for PDF
    const pdfData = {
      // Client info
      clientName: clientInfo.name || 'Client Name',
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      clientAddress: clientInfo.address,

      // Travel details
      travelDate: travelDetails.travelDate,
      groupSize: travelDetails.groupSize,
      totalNights: totalNights,
      place: place,
      mealPlan: selectedMealPlan,

      // Flight details
      flightCost: flightDetails.costPerPerson,
      flightImageUrl: flightDetails.imageUrl,

      // Services
      accommodation: accommodations.map(({ id, ...rest }) => rest),
      transfers: transfers.map(({ id, ...rest }) => rest),
      mealPlanCost: mealPlanCost,
      itinerary: itinerary.map(({ id, ...rest }) => rest),
      inclusions: inclusions,
      exclusions: exclusions,
      activities: activities.map(({ id, ...rest }) => rest),
      activitiesCost: activitiesCostPerPerson,
      accommodationAndTransferCost: accommodationAndTransferCostPerPerson,

      // Costs
      landCostPerHead: landCostPerHead,
      totalPerHead: totalPerHead,
      totalGroupCost: totalGroupCost,

      // Others
      logoUrl: '/logo.png'
    };

    setPreviewData(pdfData);
    setShowPdfPreview(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center text-gray-600 justify-center min-h-[calc(100vh-8rem)]">
          <div className="mini-loader"></div>
        </div>
      </Layout>
    );
  }

  console.log("ALL HOTELS:", JSON.stringify(allHotels, null, 2));

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pb-32">
        {/* Header */}
        <div className="bg-white shadow-sm border-b top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-600">
              Create New Quotation
            </h1>
            <p className="text-sm text-gray-600">Build a detailed quotation using admin-managed services.</p>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className='text-gray-600'>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className='text-gray-600'>Full Name</Label>
                  <Input id="name" name="name" className='text-gray-600' value={clientInfo.name} onChange={handleClientInfoChange} placeholder="e.g., John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className='text-gray-600'>Email Address</Label>
                  <Input id="email" name="email" className='text-gray-600' type="email" value={clientInfo.email} onChange={handleClientInfoChange} placeholder="e.g., john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className='text-gray-600'>Phone Number</Label>
                  <Input id="phone" name="phone" className='text-gray-600' value={clientInfo.phone} onChange={handleClientInfoChange} placeholder="e.g., +91 12345 67890" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className='text-gray-600'>Address</Label>
                  <Textarea id="address" name="address" className='text-gray-600' value={clientInfo.address} onChange={handleClientInfoChange} placeholder="Client's full address" />
                </div>
              </CardContent>
            </Card>

            {/* Travel & Flight Details */}
            <Card>
              <CardHeader>
                <CardTitle className='text-gray-600'>Travel & Flight Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="countryId" className='text-gray-600'>Country</Label>
                    <select
                      id="countryId"
                      name="countryId"
                      value={travelDetails.countryId}
                      onChange={handleTravelDetailsChange}
                      className="w-full cursor-pointer h-10 border-gray-300 rounded-md text-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option className='cursor-pointer' value="">Select a country</option>
                      {allCountries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="airportId" className='text-gray-600'>Arrival Airport</Label>
                    <select
                      id="airportId"
                      name="airportId"
                      value={travelDetails.airportId}
                      onChange={handleTravelDetailsChange}
                      disabled={!travelDetails.countryId}
                      className="w-full cursor-pointer h-10 border-gray-300 rounded-md text-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    >
                      <option value="">
                        {travelDetails.countryId ? 'Select an airport' : 'Select country first'}
                      </option>
                      {allAirports
                        .filter(airport => airport.countryId === travelDetails.countryId)
                        .map(airport => (
                          <option key={airport.id} value={airport.id}>{airport.name} ({airport.code})</option>
                        ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelDate" className='text-gray-600'>Travel Date</Label>
                    <Input id="travelDate" name="travelDate" type="date" className='text-gray-600 cursor-pointer' value={travelDetails.travelDate} onChange={handleTravelDetailsChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupSize" className='text-gray-600'>Group Size</Label>
                    <Input id="groupSize" name="groupSize" type="number" className='text-gray-600' min="1" value={travelDetails.groupSize} onChange={handleTravelDetailsChange} placeholder="e.g., 4" />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="costPerPerson" className='text-gray-600'>Flight Cost per Person (₹)</Label>
                    <Input id="costPerPerson" name="costPerPerson" className='text-gray-600' type="number" value={flightDetails.costPerPerson} onChange={handleFlightDetailsChange} placeholder="e.g., 15000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className='text-gray-600'>Flight Ticket Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-full">
                        <label htmlFor="flight-image-upload" className="flex text-gray-600 items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition">
                          {isUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                          ) : flightDetails.imageUrl ? (
                            <img src={flightDetails.imageUrl} alt="Flight ticket" className="h-full w-auto object-contain p-2" />
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <Upload className="w-8 h-8 text-gray-400" />
                              <p className="text-sm text-gray-500">Click to upload image</p>
                            </div>
                          )}
                        </label>
                        <Input id="flight-image-upload" type="file" className="hidden" onChange={handleFlightImageUpload} accept="image/*" disabled={isUploading} />
                      </div>
                      {flightDetails.imageUrl && (
                        <Button variant="ghost" size="icon" onClick={() => setFlightDetails(prev => ({ ...prev, imageUrl: '' }))}>
                          <X className="h-5 w-5 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className='text-gray-600'>Services</CardTitle>
                <p className="text-sm text-gray-500">Select accommodation, transport, and meal plans for this quotation.</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Accommodation</h3>
                  <div className="space-y-4">
                    {accommodations.map((acc) => {
                      const selectedDestination = allDestinations.find(d => d.name === acc.location);
                      const currencyInfo = selectedDestination
                        ? allCountryCurrencies.find(c => c.countryId === selectedDestination.countryId)
                        : null;

                      const conversionRate = currencyInfo?.conversionRate || 1;
                      const currencyCode = currencyInfo?.currencyCode || 'INR';
                      const filteredHotels = acc.location
                        ? allHotels.filter(h => h.destination?.state === acc.location)
                        : [];

                      console.log("LOCATION:", acc.location);
                      console.log("FILTERED HOTELS:", JSON.stringify(filteredHotels, null, 2));
                      return (
                        <div key={acc.id} className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className='space-y-2'>
                              <Label htmlFor={`acc-location-${acc.id}`} className="text-sm font-medium text-gray-500">Location</Label>
                              <select
                                className="w-full h-10 cursor-pointer border-gray-300 text-gray-600 rounded-md shadow-sm"
                                value={acc.location}
                                onChange={e => {
                                  updateAccommodation(acc.id, 'location', e.target.value);
                                  updateAccommodation(acc.id, 'hotelName', '');
                                  updateAccommodation(acc.id, 'roomType', '');
                                  updateAccommodation(acc.id, 'price', 0);
                                }}
                              >
                                <option value="">Select Location</option>
                                {(() => {
                                  const selectedCountryId = travelDetails.countryId;
                                  const relevantLocations = selectedCountryId
                                    ? allDestinations.filter(d => d.countryId === selectedCountryId)
                                    : allDestinations;

                                  return relevantLocations.map(dest => (
                                    <option key={dest.id} value={dest.state ?? ''}>{dest.state ?? 'Unknown'}</option>
                                  ));
                                })()}
                              </select>
                            </div>

                            {/* Hotel Dropdown */}
                            <div>
                              <Label htmlFor={`acc-hotel-${acc.id}`} className="text-sm font-medium text-gray-500">Hotel</Label>
                              <select
                                id={`acc-hotel-${acc.id}`}
                                className="w-full h-10 cursor-pointer border-gray-300 text-gray-600 rounded-md shadow-sm"
                                value={acc.hotelName}
                                disabled={!acc.location}
                                onChange={e => {
                                  const hotelName = e.target.value;
                                  const hotel = filteredHotels.find(h => h.name === hotelName);

                                  console.log("Selected hotel:", hotel);
                                  updateAccommodation(acc.id, 'hotelName', hotelName);

                                  if (hotel) {
                                    if (hotel.rateCards && hotel.rateCards.length > 0) {
                                      updateAccommodation(acc.id, 'roomType', hotel.rateCards[0].roomType);
                                      updateAccommodation(acc.id, 'price', hotel.rateCards[0].rate);
                                      console.log("Using rate card price:", hotel.rateCards[0].rate);
                                    }
                                    else if (hotel.basePricePerNight) {
                                      updateAccommodation(acc.id, 'roomType', 'Standard');
                                      updateAccommodation(acc.id, 'price', hotel.basePricePerNight);
                                      console.log("Using base price:", hotel.basePricePerNight);
                                    }
                                    else {
                                      updateAccommodation(acc.id, 'roomType', '');
                                      updateAccommodation(acc.id, 'price', 0);
                                      console.log("No pricing data found for hotel");
                                    }
                                  } else {
                                    updateAccommodation(acc.id, 'roomType', '');
                                    updateAccommodation(acc.id, 'price', 0);
                                  }
                                }}
                              >
                                <option value="">
                                  {acc.location
                                    ? (filteredHotels.length > 0 ? 'Select Hotel' : 'No hotels in location')
                                    : 'Select Location First'}
                                </option>
                                {filteredHotels.map(hotel => (
                                  <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor={`acc-room-${acc.id}`} className="text-sm font-medium text-gray-500">Room Type</Label>
                              <Input id={`acc-room-${acc.id}`} placeholder="Room Type" className='text-gray-600' value={acc.roomType} onChange={e => updateAccommodation(acc.id, 'roomType', e.target.value)} />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor={`acc-nights-${acc.id}`} className="text-sm font-medium text-gray-500">Nights</Label>
                              <Input id={`acc-nights-${acc.id}`} type="number" placeholder="Nights" className='text-gray-600' value={acc.nights} onChange={e => updateAccommodation(acc.id, 'nights', parseInt(e.target.value))} />
                            </div>
                            <div className="space-y-2 relative">
                              <Label htmlFor={`acc-price-${acc.id}`} className="text-sm font-medium text-gray-500">Price/Night (₹)</Label>
                              <Input id={`acc-price-${acc.id}`} type="number" placeholder="Price/Night (INR)" className='text-gray-600' value={acc.price * (acc.nights || 1)} onChange={e => updateAccommodation(acc.id, 'price', parseFloat(e.target.value))} />
                              {currencyInfo && acc.price > 0 && (
                                <div className="absolute right-3 top-1/2  text-xs text-gray-500 pointer-events-none">
                                  {currencyCode} {(acc.price * conversionRate * (acc.nights || 1)).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 cursor-pointer absolute top-1 right-1" onClick={() => removeAccommodation(acc.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 text-gray-600 cursor-pointer" onClick={addAccommodation}>
                    <Plus className="w-4 h-4 mr-2 text-gray-600" /> Add Accommodation
                  </Button>
                </div>

                <Separator />

                {/* Transfers Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Transfers</h3>
                  <div className="space-y-4">
                    {transfers.map((t) => {
                      const availableTransfers = travelDetails.countryId
                        ? allTransfers.filter(at => at.countryId === travelDetails.countryId)
                        : [];

                      const currencyInfo = travelDetails.countryId
                        ? allCountryCurrencies.find(c => c.countryId === travelDetails.countryId)
                        : null;
                      const conversionRate = currencyInfo?.conversionRate || 1;
                      const currencyCode = currencyInfo?.currencyCode || 'INR';

                      return (
                        <div key={t.id} className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative">
                          <div className="grid grid-cols-1 md:grid-cols-3 text-gray-600 gap-4">
                            <div className='space-y-2'>
                              <Label htmlFor={`t-type-${t.id}`} className="text-sm font-medium text-gray-500">Transfer Type</Label>
                              <select
                                id={`t-type-${t.id}`}
                                value={t.type}
                                disabled={!travelDetails.countryId}
                                onChange={e => {
                                  const selectedType = e.target.value;
                                  const selectedTransfer = availableTransfers.find(at => at.type === selectedType);

                                  updateTransfer(t.id, 'type', selectedType);
                                  if (selectedTransfer) {
                                    updateTransfer(t.id, 'price', selectedTransfer.priceInINR);
                                  } else {
                                    updateTransfer(t.id, 'price', 0);
                                  }
                                }}
                                className="w-full cursor-pointer h-10 border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                              >
                                <option value="">
                                  {travelDetails.countryId ? 'Select Transfer Type' : 'Select Country First'}
                                </option>
                                {availableTransfers.map(transferType => (
                                  <option key={transferType.id} value={transferType.type}>
                                    {transferType.type}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor={`t-vehicle-${t.id}`} className="text-sm font-medium text-gray-500">Vehicle Name (Optional)</Label>
                              <Input id={`t-vehicle-${t.id}`} placeholder="Vehicle Name (Optional)" value={t.vehicleName} onChange={e => updateTransfer(t.id, 'vehicleName', e.target.value)} />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor={`t-price-${t.id}`} className="text-sm font-medium text-gray-500">Price</Label>
                              <div className="relative">
                                <Input id={`t-price-${t.id}`} type="number" placeholder="Price" value={t.price} onChange={e => updateTransfer(t.id, 'price', parseFloat(e.target.value))} />
                                {currencyInfo && t.price > 0 && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                                    {currencyCode} {(t.price * conversionRate).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 cursor-pointer absolute top-1 right-1" onClick={() => removeTransfer(t.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 text-gray-600 cursor-pointer" onClick={addTransfer}>
                    <Plus className="w-4 h-4 mr-2" /> Add Transfer
                  </Button>
                </div>

                {/* Activities Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Activities</h3>
                  <div className="space-y-4">
                    {activities.map((activity) => {
                      const availableActivities = travelDetails.countryId
                        ? allActivities.filter(act => act.countryId === travelDetails.countryId)
                        : [];

                      const currencyInfo = travelDetails.countryId
                        ? allCountryCurrencies.find(c => c.countryId === travelDetails.countryId)
                        : null;
                      const conversionRate = currencyInfo?.conversionRate || 1;
                      const currencyCode = currencyInfo?.currencyCode || 'INR';

                      return (
                        <div key={activity.id} className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative">
                          <div className="grid grid-cols-1 md:grid-cols-4 text-gray-600 gap-4">
                            <div className='space-y-2'>
                              <Label htmlFor={`act-name-${activity.id}`} className="text-sm font-medium text-gray-500">Activity</Label>
                              <select
                                id={`act-name-${activity.id}`}
                                value={activity.name}
                                disabled={!travelDetails.countryId}
                                onChange={e => {
                                  const selectedActivity = availableActivities.find(a => a.name === e.target.value);
                                  if (selectedActivity) {
                                    if (travelDetails.groupSize === 1 && (selectedActivity.ticketPriceChild ?? 0) > 0) {
                                      toast({
                                        title: "Group Size Mismatch",
                                        description: "This activity includes a child price, but the group size is only 1. Please increase the group size or choose another activity.",
                                        variant: "default",
                                        className: "bg-orange-100 border-orange-300"
                                      });
                                    }
                                    updateActivity(activity.id, 'name', selectedActivity.name);
                                    updateActivity(activity.id, 'transfer', selectedActivity.transfer);
                                    updateActivity(activity.id, 'adultPrice', selectedActivity.ticketPriceAdult);
                                    updateActivity(activity.id, 'childPrice', selectedActivity.ticketPriceChild || 0);
                                  }
                                }}
                                className="w-full cursor-pointer h-10 border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                              >
                                <option value="">
                                  {travelDetails.countryId ? 'Select Activity' : 'Select Country First'}
                                </option>
                                {availableActivities.map(act => (
                                  <option key={act.id} value={act.name}>
                                    {act.name} {act.transfer ? `(${act.transfer})` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor={`act-qty-${activity.id}`} className="text-sm font-medium text-gray-500">Quantity</Label>
                              <Input
                                type="number"
                                placeholder="Quantity"
                                className='text-gray-600'
                                value={activity.quantity}
                                onChange={e => updateActivity(activity.id, 'quantity', parseInt(e.target.value))}
                              />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor={`act-adult-${activity.id}`} className="text-sm font-medium text-gray-500">Adult Price</Label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="Adult Price"
                                  className='text-gray-600'
                                  value={activity.adultPrice || 0}
                                  onChange={e => updateActivity(activity.id, 'adultPrice', parseFloat(e.target.value))}
                                />
                                {currencyInfo && activity.adultPrice > 0 && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                                    {currencyCode} {(activity.adultPrice * conversionRate).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className='space-x-2'>
                              <Label htmlFor={`act-child-${activity.id}`} className="text-sm font-medium text-gray-500">Child Price</Label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="Child Price"
                                  className='text-gray-600'
                                  value={activity.childPrice || 0}
                                  onChange={e => updateActivity(activity.id, 'childPrice', parseFloat(e.target.value))}
                                />
                                {currencyInfo && (activity.childPrice ?? 0) > 0 && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                                    {currencyCode} {((activity.childPrice ?? 0) * conversionRate).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor={`act-total-${activity.id}`} className="text-sm font-medium text-gray-500">Total Price</Label>

                              <div className="relative">
                                <Input
                                  disabled
                                  type="number"
                                  placeholder="Total Price"
                                  className='text-gray-600 bg-gray-50'
                                  value={activity.totalPrice || 0}
                                />
                                {currencyInfo && activity.totalPrice > 0 && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                                    {currencyCode} {(activity.totalPrice * conversionRate).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 cursor-pointer absolute top-1 right-1"
                            onClick={() => removeActivity(activity.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 text-gray-600 cursor-pointer" onClick={addActivity}>
                    <Plus className="w-4 h-4 mr-2" /> Add Activity
                  </Button>
                </div>

                <Separator />

                <Separator />

                {/* Meal Plan Section */}
                <div>
                  <Label htmlFor="mealPlan" className="text-lg font-medium text-gray-800">Meal Plan</Label>
                  <select
                    id="mealPlan"
                    value={selectedMealPlan}
                    onChange={e => setSelectedMealPlan(e.target.value)}
                    disabled={!travelDetails.countryId}
                    className="mt-2 block w-full md:w-1/3 h-10 border-gray-300 cursor-pointer text-gray-600 rounded-md shadow-sm disabled:bg-gray-100"
                  >
                    <option value="">
                      {travelDetails.countryId ? 'Select Meal Plan' : 'Select Country First'}
                    </option>
                    {allMealPlans
                      .filter(plan => plan.countryId === travelDetails.countryId)
                      .map(plan => (
                        <option key={plan.id} value={plan.name}>{plan.name} (₹{plan.ratePerPerson}/person)</option>
                      ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Itinerary Section */}
            <Card>
              <CardHeader>
                <CardTitle className='text-gray-600'>Itinerary</CardTitle>
                <p className="text-sm text-gray-500">Create a detailed day-by-day plan for the trip.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {itinerary.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-gray-50/50 relative">
                      <div className="flex items-center mb-3">
                        <span className="font-bold text-gray-700 mr-4">Day {index + 1}</span>
                        <Input
                          placeholder="e.g., Arrival in Leh & Acclimatization"
                          value={item.dayTitle}
                          onChange={(e) => updateItineraryDay(item.id, 'dayTitle', e.target.value)}
                          className="flex-grow text-gray-600"
                        />
                      </div>
                      <Textarea
                        placeholder="Describe the activities for the day..."
                        value={item.description}
                        onChange={(e) => updateItineraryDay(item.id, 'description', e.target.value)}
                        className="min-h-[100px] text-gray-600"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 cursor-pointer"
                        onClick={() => removeItineraryDay(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-6 text-gray-600 cursor-pointer" onClick={addItineraryDay}>
                  <Plus className="w-4 h-4 mr-2" /> Add Day
                </Button>
              </CardContent>
            </Card>

            {/* Inclusions & Exclusions Section */}
            <Card>
              <CardHeader>
                <CardTitle className='text-gray-600'>Inclusions & Exclusions</CardTitle>
                <p className="text-sm text-gray-500">Manually add inclusion and exclusion items for this quotation.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Inclusions</h4>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Add an inclusion item..."
                        value={newInclusion}
                        onChange={(e) => setNewInclusion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addInclusion()}
                        className="text-gray-600"
                      />
                      <Button onClick={addInclusion} className="cursor-pointer bg-amber-800">Add</Button>
                    </div>
                    <ul className="space-y-2 list-disc list-inside text-gray-600">
                      {inclusions.map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{item}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeInclusion(index)}>
                            <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions Column */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Exclusions</h4>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Add an exclusion item..."
                        value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addExclusion()}
                        className="text-gray-600"
                      />
                      <Button onClick={addExclusion} className="cursor-pointer bg-amber-800">Add</Button>
                    </div>
                    <ul className="space-y-2 list-disc list-inside text-gray-600">
                      {exclusions.map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{item}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeExclusion(index)}>
                            <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Sticky Footer for Actions */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-sm border-t shadow-lg z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-end items-center gap-3">
              <Button
                variant="outline"
                className='border-gray-300 cursor-pointer text-gray-600 hover:bg-gray-100'
                disabled={isSubmitting}
                onClick={() => handleSubmit('DRAFT')}
              >
                Save as Draft
              </Button>
              <Button
                variant="secondary"
                className='bg-orange-100 cursor-pointer hover:bg-orange-200 text-gray-600'
                disabled={isSubmitting || !clientInfo.name || !travelDetails.travelDate}
                onClick={handlePdfPreview}
              >
                Preview PDF
              </Button>
              <Button disabled={isSubmitting || !clientInfo.name || !travelDetails.travelDate} className='bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' onClick={() => handleSubmit('SENT')}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create & Send Quotation
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* PDF Preview Modal */}
      {showPdfPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">PDF Preview</h2>
              <Button
                className="self-end cursor-pointer text-red-500"
                variant="ghost"
                onClick={() => setShowPdfPreview(false)}
              >
                Close
              </Button>
            </div>
            <div className="flex-1">
              <PDFViewer width="100%" height="100%" className="border rounded">
                <QuotationPDF payload={previewData} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}