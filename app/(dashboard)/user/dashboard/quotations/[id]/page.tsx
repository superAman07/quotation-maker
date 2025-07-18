'use client';

import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import {
  ArrowLeft,
  Edit,
  Download,
  Send,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Car,
  Hotel,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Home,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';


interface ServiceItem {
  type: string;
  details: string;
  cost: number;
}


export default function QuotationDetail() {
  const params = useParams();
  const quotationId = params.id as string;

  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/quotations/${quotationId}`)
      .then(res => res.json())
      .then(data => {
        setQuotation(data);
        setLoading(false);
      });
  }, [quotationId]);

  interface ItineraryItem {
    day: number;
    activity: string;
    date: string;
    cost: number;
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <Link href={'/user/dashboard/quotations'} className="flex items-center cursor-pointer gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium">
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
                {/* <Link href={`/user/dashboard/quotations/${quotation.id}/edit`} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Link> */}
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
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
                  <User className="w-5 h-5 text-blue-600" />
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
                  <MapPin className="w-5 h-5 text-blue-600" />
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
                  <div className="bg-red-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Plane className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Transport</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{quotation.vehicleUsed}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-medium text-teal-800">Local Vehicle</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{quotation.localVehicleUsed}</p>
                  </div>
                </div>
              </div>

              {/* Itinerary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Detailed Itinerary
                </h2>
                <div className="space-y-4">
                  {quotation.itinerary.map((item: any, index: number) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">{item.dayTitle}</h3>
                          <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-blue-600" />
                  Accommodation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quotation.accommodation.map((acc: any) => (
                    <div key={acc.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Hotel className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 capitalize">{acc.location}</h3>
                          <p className="text-gray-700 font-medium capitalize">{acc.hotelName}</p>
                          <p className="text-sm text-gray-500 mt-2">{acc.nights} nights stay</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Inclusions
                  </h2>
                  <div className="space-y-3">
                    {quotation.inclusions.map((inclusion: any) => (
                      <div key={inclusion.id} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 capitalize">{inclusion.item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Exclusions
                  </h2>
                  <div className="space-y-3">
                    {quotation.exclusions.map((exclusion: any) => (
                      <div key={exclusion.id} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 capitalize">{exclusion.item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {quotation.notes && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-blue-600" />
                    Notes & Terms
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-700 leading-relaxed">{quotation.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Pricing Summary */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Pricing Summary
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">Flight Cost</span>
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(quotation.flightCost)}</span>
                    </div>
                    <p className="text-xs text-blue-600">Per person</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Land Cost</span>
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(quotation.landCostPerHead)}</span>
                    </div>
                    <p className="text-xs text-green-600">Per person</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-800">Total Per Person</span>
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(quotation.totalPerHead)}</span>
                    </div>
                    <p className="text-xs text-purple-600">Including all costs</p>
                  </div>
                  <div className="border-t pt-4">
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
              {quotation.status === 'DRAFT' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send to Client
                    </button>
                    <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Quotation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}