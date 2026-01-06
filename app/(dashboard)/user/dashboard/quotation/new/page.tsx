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

interface FlightLeg {
  id: string;
  type: 'ONWARD' | 'RETURN' | 'INTERCITY';
  route: string;
  date: string;
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
  // const [flightDetails, setFlightDetails] = useState<FlightDetails>({ costPerPerson: 0, imageUrl: '' });
  const [flightCost, setFlightCost] = useState<number>(0);
  const [flightLegs, setFlightLegs] = useState<FlightLeg[]>([]);
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

  const addFlightLeg = () => {
    setFlightLegs(prev => [...prev, { 
      id: Date.now().toString(), 
      type: 'ONWARD', 
      route: '', 
      date: travelDetails.travelDate, 
      imageUrl: '' 
    }]);
  };

  const duplicateFlightLeg = (id: string) => {
    const legToDuplicate = flightLegs.find(leg => leg.id === id);
    if (legToDuplicate) {
      const newLeg = {
        ...legToDuplicate,
        id: Date.now().toString(),
        type: legToDuplicate.type === 'ONWARD' ? 'RETURN' : 'ONWARD' as 'ONWARD' | 'RETURN' | 'INTERCITY',
        imageUrl: ''
      };
      setFlightLegs(prev => [...prev, newLeg]);
      toast({ title: "Success", description: "Flight leg duplicated" });
    }
  };

  const getFlightTypeColor = (type: string) => {
    switch (type) {
      case 'ONWARD': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'RETURN': return 'bg-green-100 text-green-700 border-green-300';
      case 'INTERCITY': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleFlightImageDrop = async (id: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadFlightImage(id, file);
    } else {
      toast({ title: "Error", description: "Please drop an image file", variant: "destructive" });
    }
  };

  const uploadFlightImage = async (id: string, file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateFlightLeg(id, 'imageUrl', response.data.url);
      toast({ title: "Success", description: "Flight image uploaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const updateFlightLeg = (id: string, field: keyof FlightLeg, value: any) => {
    setFlightLegs(prev => prev.map(leg => leg.id === id ? { ...leg, [field]: value } : leg));
  };

  const removeFlightLeg = (id: string) => {
    setFlightLegs(prev => prev.filter(leg => leg.id !== id));
  };

  const handleFlightLegImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateFlightLeg(id, 'imageUrl', response.data.url);
      toast({ title: "Success", description: "Flight image uploaded." });
    } catch (error) {
      toast({ title: "Error", description: "Upload failed.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

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

    const totalPerHead = landCostPerHead + flightCost;
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
      flightCost: flightCost,
      flights: flightLegs,

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

    const totalPerHead = landCostPerHead + flightCost;
    const totalGroupCost = totalPerHead * travelDetails.groupSize;

    const selectedCountry = allCountries.find(c => c.id === travelDetails.countryId);
    const place = selectedCountry ? selectedCountry.name : 'N/A';

    const pdfData = {
      quotationNo: "DRAFT",
      clientName: clientInfo.name || 'Client Name',
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      clientAddress: clientInfo.address,

      travelDate: travelDetails.travelDate,
      groupSize: travelDetails.groupSize,
      totalNights: totalNights,
      place: place,
      mealPlan: selectedMealPlan,

      flightCost: flightCost,
      flights: flightLegs,

      accommodation: accommodations.map(({ id, ...rest }) => rest),
      transfers: transfers.map(({ id, ...rest }) => rest),
      mealPlanCost: mealPlanCost,
      itinerary: itinerary.map(({ id, ...rest }) => rest),
      inclusions: inclusions,
      exclusions: exclusions,
      activities: activities.map(({ id, ...rest }) => rest),
      activitiesCost: activitiesCostPerPerson,
      accommodationAndTransferCost: accommodationAndTransferCostPerPerson,

      landCostPerHead: landCostPerHead,
      totalPerHead: totalPerHead,
      totalGroupCost: totalGroupCost,

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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 pb-32">
        {/* Header */}
        <div className="bg-white shadow-md border-b sticky top-0 z-20 backdrop-blur-sm ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Create New Quotation
                </h1>
                <p className="text-sm text-gray-500 mt-1">Build a detailed quotation using admin-managed services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-linear-to-r from-indigo-50 to-blue-50 border-b-2 border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className='text-gray-800 text-xl'>Client Information</CardTitle>
                    <p className="text-xs text-gray-600 mt-1">Enter your client's contact details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-2 group">
                  <Label htmlFor="name" className='text-gray-700 font-semibold text-sm flex items-center gap-2'>
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Full Name *
                  </Label>
                  <Input 
                    id="name" 
                    name="name" 
                    className='text-gray-700 border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg' 
                    value={clientInfo.name} 
                    onChange={handleClientInfoChange} 
                    placeholder="e.g., John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className='text-gray-700 font-semibold text-sm flex items-center gap-2'>
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    name="email" 
                    className='text-gray-700 border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg' 
                    type="email" 
                    value={clientInfo.email} 
                    onChange={handleClientInfoChange} 
                    placeholder="e.g., john.doe@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className='text-gray-700 font-semibold text-sm flex items-center gap-2'>
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Phone Number *
                  </Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    className='text-gray-700 border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg' 
                    value={clientInfo.phone} 
                    onChange={handleClientInfoChange} 
                    placeholder="e.g., +91 12345 67890" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className='text-gray-700 font-semibold text-sm flex items-center gap-2'>
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Address
                  </Label>
                  <Textarea 
                    id="address" 
                    name="address" 
                    className='text-gray-700 border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all rounded-lg min-h-20' 
                    value={clientInfo.address} 
                    onChange={handleClientInfoChange} 
                    placeholder="Client's full address" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Travel & Flight Details */}
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-linear-to-r from-green-50 to-teal-50 border-b-2 border-green-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className='text-gray-800 text-xl'>Travel & Flight Details</CardTitle>
                    <p className="text-xs text-gray-600 mt-1">Configure destination and flight information</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="countryId" className='text-gray-700 font-semibold text-sm flex items-center gap-2'>
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                      Country *
                    </Label>
                    <select
                      id="countryId"
                      name="countryId"
                      value={travelDetails.countryId}
                      onChange={handleTravelDetailsChange}
                      className="w-full cursor-pointer h-11 border-2 border-gray-300 rounded-lg text-gray-700 font-medium shadow-sm focus:ring-2 focus:ring-green-200 focus:border-green-500 transition-all"
                    >
                      <option value="">Select a country</option>
                      {allCountries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="airportId" className='text-gray-700 font-semibold text-sm flex items-center gap-2'>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Arrival Airport
                    </Label>
                    <select
                      id="airportId"
                      name="airportId"
                      value={travelDetails.airportId}
                      onChange={handleTravelDetailsChange}
                      disabled={!travelDetails.countryId}
                      className="w-full cursor-pointer h-11 border-2 border-gray-300 rounded-lg text-gray-700 font-medium shadow-sm focus:ring-2 focus:ring-green-200 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
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
                    <Label htmlFor="travelDate" className='text-gray-700 font-semibold text-sm flex items-center gap-2'>
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Travel Date *
                    </Label>
                    <Input 
                      id="travelDate" 
                      name="travelDate" 
                      type="date" 
                      className='text-gray-700 border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 cursor-pointer transition-all rounded-lg h-11' 
                      value={travelDetails.travelDate} 
                      onChange={handleTravelDetailsChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="groupSize" className='text-gray-700 font-semibold text-sm flex items-center gap-2'>
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Group Size *
                    </Label>
                    <Input 
                      id="groupSize" 
                      name="groupSize" 
                      type="number" 
                      className='text-gray-700 border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all rounded-lg h-11' 
                      min="1" 
                      value={travelDetails.groupSize} 
                      onChange={handleTravelDetailsChange} 
                      placeholder="e.g., 4" 
                    />
                  </div>
                </div>
                <Separator />

                {/* ✅ NEW FLIGHT UI */}
                {/* ✅ REDESIGNED FLIGHT ITINERARY SECTION */}
                <div className="space-y-6">
                  {/* Header with Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Flight Itinerary
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">Add flight details with screenshots for accurate quotation</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addFlightLeg} 
                      className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 font-medium transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Flight Leg
                    </Button>
                  </div>

                  {/* Total Cost Input */}
                  <div className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                    <Label htmlFor="flightCost" className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      Flight Cost per Person (₹)
                    </Label>
                    <Input 
                      id="flightCost" 
                      type="number" 
                      className="text-gray-700 font-semibold text-lg bg-white border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500" 
                      value={flightCost} 
                      onChange={(e) => setFlightCost(parseFloat(e.target.value) || 0)} 
                      placeholder="e.g., 15000" 
                    />
                    {flightCost > 0 && travelDetails.groupSize > 1 && (
                      <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Total for {travelDetails.groupSize} travelers: ₹{(flightCost * travelDetails.groupSize).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  {/* Flight Legs List */}
                  <div className="space-y-4">
                    {flightLegs.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <p className="text-gray-500 font-medium">No flights added yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click "Add Flight Leg" to get started</p>
                      </div>
                    ) : (
                      flightLegs.map((leg, index) => (
                        <div 
                          key={leg.id} 
                          className="relative bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-md group"
                        >
                          {/* Flight Number Badge */}
                          <div className="absolute -top-3 left-4 px-3 py-1 bg-linear-to-r from-gray-700 to-gray-900 text-white text-xs font-bold rounded-full shadow-md">
                            Flight #{index + 1}
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => duplicateFlightLeg(leg.id)}
                              className="h-8 w-8 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
                              title="Duplicate"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFlightLeg(leg.id)}
                              className="h-8 w-8 cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-4 mt-4">
                            {/* Flight Type, Route, Date Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Flight Type */}
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</Label>
                                <select
                                  className={`flex h-10 w-full rounded-lg border-2 px-3 py-2 text-sm font-semibold cursor-pointer transition-all focus:ring-2 focus:ring-offset-1 ${getFlightTypeColor(leg.type)}`}
                                  value={leg.type}
                                  onChange={(e) => updateFlightLeg(leg.id, 'type', e.target.value)}
                                >
                                  <option value="ONWARD">✈️ Onward</option>
                                  <option value="RETURN">🔄 Return</option>
                                  <option value="INTERCITY">🔀 Intercity</option>
                                </select>
                              </div>

                              {/* Route */}
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Route</Label>
                                <Input
                                  className="text-gray-700 border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                                  placeholder="e.g., Delhi → Phuket"
                                  value={leg.route}
                                  onChange={(e) => updateFlightLeg(leg.id, 'route', e.target.value)}
                                />
                              </div>

                              {/* Date */}
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</Label>
                                <Input
                                  type="date"
                                  className="text-gray-700 cursor-pointer border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                                  value={leg.date}
                                  onChange={(e) => updateFlightLeg(leg.id, 'date', e.target.value)}
                                />
                              </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Flight Screenshot
                              </Label>
                              
                              {leg.imageUrl ? (
                                <div className="relative group/img">
                                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                                    <img 
                                      src={leg.imageUrl} 
                                      alt="Flight Ticket" 
                                      className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform" 
                                      onClick={() => window.open(leg.imageUrl, '_blank')}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/img:bg-opacity-30 transition-all flex items-center justify-center">
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity"
                                        onClick={() => updateFlightLeg(leg.id, 'imageUrl', '')}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-6 text-center cursor-pointer transition-all bg-gray-50 hover:bg-blue-50"
                                  onDrop={(e) => handleFlightImageDrop(leg.id, e)}
                                  onDragOver={(e) => e.preventDefault()}
                                  onClick={() => document.getElementById(`flight-upload-${leg.id}`)?.click()}
                                >
                                  {isUploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                      <p className="text-sm text-gray-600">Uploading...</p>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-2">
                                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                      <div>
                                        <p className="text-sm font-medium text-gray-700">Drop image here or click to upload</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                      </div>
                                    </div>
                                  )}
                                  <Input 
                                    id={`flight-upload-${leg.id}`}
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) uploadFlightImage(leg.id, file);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Helper Tips */}
                  {flightLegs.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">💡 Pro Tips:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                          <li>Upload flight booking confirmation screenshots for clarity</li>
                          <li>Use "Duplicate" to quickly add return flights</li>
                          <li>Drag & drop images directly onto the upload area</li>
                        </ul>
                      </div>
                    </div>
                  )}
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
                          className="grow text-gray-600"
                        />
                      </div>
                      <Textarea
                        placeholder="Describe the activities for the day..."
                        value={item.description}
                        onChange={(e) => updateItineraryDay(item.id, 'description', e.target.value)}
                        className="min-h-25 text-gray-600"
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
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/95 backdrop-blur-md border-t-2 border-gray-200 shadow-2xl z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p className="font-semibold">Quotation Summary</p>
                <p className="text-xs text-gray-500">
                  {travelDetails.groupSize} travelers • {accommodations.length} hotels • {transfers.length} transfers
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className='border-2 border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-100 font-semibold transition-all'
                  disabled={isSubmitting}
                  onClick={() => handleSubmit('DRAFT')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save as Draft
                </Button>
                <Button
                  variant="secondary"
                  className='bg-orange-100 cursor-pointer hover:bg-orange-200 text-orange-700 border-2 border-orange-300 font-semibold transition-all'
                  disabled={isSubmitting || !clientInfo.name || !travelDetails.travelDate}
                  onClick={handlePdfPreview}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview PDF
                </Button>
                <Button 
                  disabled={isSubmitting || !clientInfo.name || !travelDetails.travelDate} 
                  className='bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 cursor-pointer font-semibold shadow-lg hover:shadow-xl transition-all px-6' 
                  onClick={() => handleSubmit('SENT')}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Create & Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* PDF Preview Modal */}
      {showPdfPreview && previewData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col transform scale-100 animate-in zoom-in-95 duration-200 border-2 border-white/20">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">PDF Preview</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                onClick={() => setShowPdfPreview(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 bg-gray-50 p-4 overflow-hidden rounded-b-2xl">
              {!previewData ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  <p className="text-sm font-medium animate-pulse">Generating PDF...</p>
                </div>
              ) : (
                <PDFViewer width="100%" height="100%" className="rounded-lg shadow-inner border border-gray-200">
                  <QuotationPDF payload={previewData} />
                </PDFViewer>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}