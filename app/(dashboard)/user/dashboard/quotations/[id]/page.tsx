'use client';

import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import {
  ArrowLeft,
  Download,
  Send,
  MapPin,
  Calendar,
  Users, 
  Car,
  Hotel,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Home,
  User,
  FileText,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@react-pdf/renderer';
import { QuotationPDF } from '@/components/Quotation-pdf';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
};

const createPdfPayloadFromQuotation = (quote: any) => {
  if (!quote) return null;

  const landCostPerHead = quote.landCostPerHead || 0;
  const totalPerHead = quote.totalCostPerPerson || 0;
  const totalGroupCost = quote.totalGroupCost || 0;
  
  const totalAccommodationCost = quote.accommodations?.reduce((sum: number, acc: any) => sum + (acc.price * acc.nights), 0) || 0;
  const totalTransferCost = quote.transfers?.reduce((sum: number, t: any) => sum + t.price, 0) || 0;
  const accommodationAndTransferCostPerPerson = quote.groupSize > 0 ? (totalAccommodationCost + totalTransferCost) / quote.groupSize : 0;
  const mealPlanCost = quote.mealPlan?.ratePerPerson || 0;
  const totalActivitiesCost = quote.activities?.reduce((sum: number, act: any) => sum + act.totalPrice, 0) || 0;
  const activitiesCostPerPerson = quote.groupSize > 0 ? totalActivitiesCost / quote.groupSize : 0;

  return {
    quotationNo: quote.quotationNo,
    clientName: quote.clientName,
    clientEmail: quote.clientEmail,
    clientPhone: quote.clientPhone,
    clientAddress: quote.clientAddress,
    travelDate: quote.travelDate,
    groupSize: quote.groupSize,
    totalNights: quote.totalNights,
    place: quote.place,
    mealPlan: quote.mealPlan?.name || 'Not Included',
    flightCost: quote.flightCostPerPerson || 0,
    flightImageUrl: quote.flightImageUrl,
    accommodation: quote.accommodations || [],
    transfers: quote.transfers || [],
    itinerary: quote.itinerary || [],
    inclusions: quote.inclusions || [],
    exclusions: quote.exclusions || [],
    activities: quote.activities || [],
    mealPlanCost: mealPlanCost,
    activitiesCost: activitiesCostPerPerson,
    accommodationAndTransferCost: accommodationAndTransferCostPerPerson,
    landCostPerHead: landCostPerHead,
    totalPerHead: totalPerHead,
    totalGroupCost: totalGroupCost,
    logoUrl: '/logo.png'
  };
};

export default function QuotationDetail() {
  const params = useParams();
  const quotationId = params.id as string;

  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [pdfPayload, setPdfPayload] = useState<any>(null);

  useEffect(() => {
    if (quotationId) {
      axios.get(`/api/user/quotations/${quotationId}`)
        .then(res => {
          const quoteData = res.data;
          setQuotation(quoteData);
        })
        .catch(err => console.error("Failed to fetch quotation", err))
        .finally(() => setLoading(false));
    }
  }, [quotationId]);

  const handleDownloadClick = () => {
    if (!quotation) return;
    const payload = createPdfPayloadFromQuotation(quotation);
    setPdfPayload(payload);
    setShowPdfPreview(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendQuotation = async () => {
    setIsActionLoading(true);
    try {
      await axios.patch(`/api/user/quotations/${quotationId}`, { status: 'Sent' });
      setQuotation((prev: any) => ({ ...prev, status: 'Sent' }));
      toast({ title: "Success", description: "Quotation has been marked as Sent." });
    } catch (error) {
      toast({ title: "Error", description: "Could not update quotation status.", variant: "destructive" });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quotation details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!quotation) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-800 mb-2">Quotation not found</p>
            <p className="text-gray-600">The requested quotation could not be found or you don't have access to it.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Layout>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <Link href={'/user/dashboard/quotations'} className="flex items-center cursor-pointer gap-2 text-[#767d43] hover:text-[#5a5f33] transition-colors font-medium">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {quotation.quotationNo}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(quotation.status)}`}>
                      {quotation.status}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {formatDate(quotation.createdAt)}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      by {quotation.createdBy.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleDownloadClick} className="px-4 py-2 bg-[#767d43] cursor-pointer text-white rounded-lg hover:bg-[#5a5f33] transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-8">
              {/* Client Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#767d43]" />
                  Client Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Client Name</p>
                        <p className="text-lg font-semibold text-gray-900 capitalize">{quotation.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{quotation.clientEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-lg font-semibold text-gray-900">{quotation.clientPhone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-lg font-semibold text-gray-900">{quotation.clientAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#767d43]" />
                  Travel Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Destination</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{quotation.place}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Travel Date</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(quotation.travelDate)}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Group Size</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{quotation.groupSize} People</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Duration</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{quotation.totalNights} Nights</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-xl col-span-1 md:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-teal-800">Vehicles</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {quotation.transfers?.length > 0
                        ? quotation.transfers.map((t: any) => t.vehicleName || t.type).join(', ')
                        : 'Not Specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Itinerary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#767d43]" />
                  Detailed Itinerary
                </h2>
                <div className="space-y-4">
                  {quotation.itinerary && quotation.itinerary?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Itinerary</h3>
                      <div className="space-y-6">
                        {quotation.itinerary.map((day: any, index: number) => (
                          <div key={day.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                              <div className="flex-1 w-px bg-gray-200 my-2"></div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{day.dayTitle}</h4>
                              <p className="text-gray-600 mt-1">{day.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Accommodation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-[#767d43]" />
                  Accommodation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quotation.accommodations && quotation.accommodations?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Accommodation</h3>
                      <div className="space-y-4">
                        {quotation.accommodations.map((acc: any) => (
                          <div key={acc.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Hotel className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 mb-1 capitalize">{acc.hotelName}</h4>
                              <p className="text-gray-700 font-medium capitalize">{acc.location}</p>
                              <p className="text-sm text-gray-500 mt-2">{acc.nights} nights stay in a {acc.roomType}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transfers */}
              {quotation.transfers && quotation.transfers?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Transfers</h3>
                  <div className="space-y-4">
                    {quotation.transfers.map((transfer: any) => (
                      <div key={transfer.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                          <Car className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{transfer.type}</h4>
                          <p className="text-sm text-gray-600">{transfer.vehicleName || 'Vehicle not specified'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {quotation.inclusions?.length > 0 && <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5" /> Inclusions</h3>
                  <ul className="space-y-2 list-inside">
                    {quotation.inclusions.map((item: any) => <li key={item.id} className="text-gray-600">{item.item}</li>)}
                  </ul>
                </div>}
                {quotation.exclusions?.length > 0 && <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><XCircle className="text-red-500 w-5 h-5" /> Exclusions</h3>
                  <ul className="space-y-2 list-inside">
                    {quotation.exclusions.map((item: any) => <li key={item.id} className="text-gray-600">{item.item}</li>)}
                  </ul>
                </div>}
              </div>

              {/* Notes */}
              {quotation.notes && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-500" /> Notes</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{quotation.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Pricing Summary */}
            <div className="space-y-8">
              <div className="xl:sticky top-24 self-start">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Flight Cost (per person)</span>
                      <span className="font-semibold">{formatCurrency(quotation.flightCostPerPerson)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Land Package (per person)</span>
                      <span className="font-semibold">{formatCurrency(quotation.landCostPerPerson)}</span>
                    </div>
                    <div className="border-t my-2"></div>
                    <div className="flex justify-between items-center text-gray-900 font-bold">
                      <span>Total (per person)</span>
                      <span>{formatCurrency(quotation.totalCostPerPerson)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="bg-gray-900 text-white p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">Grand Total</span>
                        <span className="text-2xl font-bold">{formatCurrency(quotation.totalGroupCost)}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">For {quotation.groupSize} people</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {quotation.status === 'Draft' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
                    <button onClick={handleSendQuotation} disabled={isActionLoading} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400">
                      {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send to Client
                    </button> 
                  </div>
                </div>
              )}
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
            {loading ? (
              <div className="flex-1 flex items-center justify-center">Loading PDF...</div>
            ) : (
              <PDFViewer width="100%" height="100%">
                <QuotationPDF payload={pdfPayload} />
              </PDFViewer>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}