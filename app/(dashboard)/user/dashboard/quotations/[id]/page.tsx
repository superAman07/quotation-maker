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

export default function QuotationDetail() {
  const params = useParams();
  const quotationId = params.id;

  // Mock data - in real app, this would come from an API
  const quotation = {
    id: 'Q001',
    client: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001'
    },
    travel: {
      departureCity: 'New York',
      destination: 'Paris, France',
      departureDate: '2024-03-15',
      returnDate: '2024-03-25',
      travelers: 2
    },
    itinerary: [
      {
        day: 1,
        activity: 'Arrival & Hotel Check-in',
        date: '2024-03-15',
        cost: 200
      },
      {
        day: 2,
        activity: 'Eiffel Tower & Seine River Cruise',
        date: '2024-03-16',
        cost: 150
      },
      {
        day: 3,
        activity: 'Louvre Museum & Montmartre',
        date: '2024-03-17',
        cost: 180
      }
    ],
    services: [
      {
        type: 'Hotel',
        details: '4-star hotel in city center',
        cost: 1200
      },
      {
        type: 'Flight',
        details: 'Round-trip flights',
        cost: 800
      },
      {
        type: 'Insurance',
        details: 'Travel insurance coverage',
        cost: 120
      }
    ],
    pricing: {
      subtotal: 2650,
      taxRate: 10,
      taxAmount: 265,
      discount: 5,
      discountAmount: 132.5,
      grandTotal: 2782.5
    },
    status: 'Draft',
    notes: 'Client requested vegetarian meals and late checkout.',
    createdDate: '2024-01-15'
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a 
              href="/quotations"
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
                  Created on {new Date(quotation.createdDate).toLocaleDateString()}
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
                <p className="text-[#252426] font-medium">{quotation.client.name}</p>
                <p className="text-gray-600">{quotation.client.email}</p>
                <p className="text-gray-600">{quotation.client.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
              <p className="text-gray-600">{quotation.client.address}</p>
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
                <p className="font-medium text-[#252426]">{quotation.travel.departureCity}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#9DA65D]" />
              <div>
                <p className="text-sm text-gray-600">To</p>
                <p className="font-medium text-[#252426]">{quotation.travel.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#6C733D]" />
              <div>
                <p className="text-sm text-gray-600">Travelers</p>
                <p className="font-medium text-[#252426]">{quotation.travel.travelers}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#6C733D]" />
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-medium text-[#252426]">{new Date(quotation.travel.departureDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#9DA65D]" />
              <div>
                <p className="text-sm text-gray-600">Return</p>
                <p className="font-medium text-[#252426]">{new Date(quotation.travel.returnDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Itinerary</h2>
          <div className="space-y-4">
            {quotation.itinerary.map((item) => (
              <div key={item.day} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#6C733D] text-white px-3 py-1 rounded-full text-sm font-medium">
                      Day {item.day}
                    </span>
                    <span className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#6C733D] font-medium">
                    <DollarSign className="w-4 h-4" />
                    {item.cost}
                  </div>
                </div>
                <p className="text-[#252426] font-medium">{item.activity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Additional Services</h2>
          <div className="space-y-4">
            {quotation.services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-[#9DA65D] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {service.type}
                  </span>
                  <div className="flex items-center gap-1 text-[#6C733D] font-medium">
                    <DollarSign className="w-4 h-4" />
                    {service.cost}
                  </div>
                </div>
                <p className="text-[#252426] font-medium">{service.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Pricing Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${quotation.pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({quotation.pricing.taxRate}%):</span>
                <span className="font-medium">${quotation.pricing.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount ({quotation.pricing.discount}%):</span>
                <span className="font-medium text-red-600">-${quotation.pricing.discountAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-[#252426]">Grand Total:</span>
                  <span className="text-lg font-bold text-[#6C733D]">${quotation.pricing.grandTotal.toFixed(2)}</span>
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