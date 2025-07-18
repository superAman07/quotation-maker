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
  DollarSign
} from 'lucide-react';
import { useEffect, useState } from 'react';


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
        <div className="max-w-4xl mx-auto py-20 text-center text-gray-500">Loading...</div>
      </Layout>
    );
  }

  if (!quotation || quotation.error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-20 text-center text-red-500">Quotation not found or access denied.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/user/dashboard/quotations"
              className="flex items-center gap-2 text-[#6C733D] hover:text-[#5a5f33] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to List
            </a>
            <div>
              <h1 className="text-2xl font-bold text-[#252426]">Quotation {quotation.id}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                  {quotation.status}
                </span>
                <span className="text-sm text-gray-600">
                  Created on {new Date(quotation.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#6C733D] text-[#6C733D] rounded-lg hover:bg-[#6C733D] hover:text-white transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="px-4 py-2 bg-[#6C733D] text-white rounded-lg hover:bg-[#5a5f33] transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Details</h3>
              <div className="space-y-2">
                <p className="text-[#252426] font-medium">{quotation.clientName}</p>
                <p className="text-gray-600">{quotation.clientEmail}</p>
                <p className="text-gray-600">{quotation.clientPhone}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
              <p className="text-gray-600">{quotation.clientAddress}</p>
            </div>
          </div>
        </div>

        {/* Travel Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Travel Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#6C733D]" />
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-medium text-[#252426]">{quotation.place ?? "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#9DA65D]" />
              <div>
                <p className="text-sm text-gray-600">To</p>
                <p className="font-medium text-[#252426]">{quotation.place ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#6C733D]" />
              <div>
                <p className="text-sm text-gray-600">Travelers</p>
                <p className="font-medium text-[#252426]">{quotation.groupSize}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Itinerary</h2>
          <div className="space-y-4">
            {quotation.itinerary.map((item: any) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#6C733D] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {item.dayTitle}
                  </span>
                </div>
                <p className="text-[#252426] font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Additional Services</h2>
          <div className="space-y-4">

            {quotation.accommodation.map((acc: any) => (
              <div key={acc.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-600">{acc.location} ({acc.nights} Nights)</span>
                  <span className="text-gray-600">{acc.hotelName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Pricing Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-[#252426]">Grand Total:</span>
                  <span className="text-lg font-bold text-[#6C733D]">₹{quotation.totalGroupCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {quotation.notes && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Notes & Terms</h2>
            <p className="text-gray-700 leading-relaxed">{quotation.notes}</p>
          </div>
        )}

        {/* Actions */}
        {quotation.status === 'Draft' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-[#6C733D] text-white rounded-lg hover:bg-[#5a5f33] transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send to Client
              </button>
              <button className="px-6 py-3 border border-[#6C733D] text-[#6C733D] rounded-lg hover:bg-[#6C733D] hover:text-white transition-colors flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Quotation
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}