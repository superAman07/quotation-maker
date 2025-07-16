'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Plus, Minus, Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface ItineraryItem {
  id: string;
  day: number;
  activity: string;
  date: string;
  cost: number;
}

interface AdditionalService {
  id: string;
  type: string;
  details: string;
  cost: number;
}

export default function NewQuotation() {
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [travelDetails, setTravelDetails] = useState({
    departureCity: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    travelers: 1
  });

  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { id: '1', day: 1, activity: '', date: '', cost: 0 }
  ]);

  const [services, setServices] = useState<AdditionalService[]>([
    { id: '1', type: 'Hotel', details: '', cost: 0 }
  ]);

  const [pricing, setPricing] = useState({
    taxRate: 10,
    discount: 0,
    notes: ''
  });

  const addItineraryItem = () => {
    const newItem: ItineraryItem = {
      id: Date.now().toString(),
      day: itinerary.length + 1,
      activity: '',
      date: '',
      cost: 0
    };
    setItinerary([...itinerary, newItem]);
  };

  const removeItineraryItem = (id: string) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const addService = () => {
    const newService: AdditionalService = {
      id: Date.now().toString(),
      type: 'Hotel',
      details: '',
      cost: 0
    };
    setServices([...services, newService]);
  };

  const removeService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const calculateSubtotal = () => {
    const itineraryTotal = itinerary.reduce((sum, item) => sum + item.cost, 0);
    const servicesTotal = services.reduce((sum, service) => sum + service.cost, 0);
    return itineraryTotal + servicesTotal;
  };

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * (pricing.taxRate / 100);
  const discountAmount = subtotal * (pricing.discount / 100);
  const grandTotal = subtotal + taxAmount - discountAmount;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-[#252426] mb-6 border-b-2 border-[#9DA65D] pb-2">New Quotation</h1>

          {/* Client Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                  rows={3}
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Travel Details */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Travel Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                    value={travelDetails.departureCity}
                    onChange={(e) => setTravelDetails({...travelDetails, departureCity: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                    value={travelDetails.destination}
                    onChange={(e) => setTravelDetails({...travelDetails, destination: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                    value={travelDetails.travelers}
                    onChange={(e) => setTravelDetails({...travelDetails, travelers: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                    value={travelDetails.departureDate}
                    onChange={(e) => setTravelDetails({...travelDetails, departureDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                    value={travelDetails.returnDate}
                    onChange={(e) => setTravelDetails({...travelDetails, returnDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Itinerary */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Itinerary</h2>
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#6C733D] text-white px-3 py-1 rounded-full text-sm font-medium">
                        Day {item.day}
                      </span>
                    </div>
                    {itinerary.length > 1 && (
                      <button
                        onClick={() => removeItineraryItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Activity Description</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                        value={item.activity}
                        onChange={(e) => {
                          const updated = itinerary.map(i => 
                            i.id === item.id ? {...i, activity: e.target.value} : i
                          );
                          setItinerary(updated);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                        value={item.date}
                        onChange={(e) => {
                          const updated = itinerary.map(i => 
                            i.id === item.id ? {...i, date: e.target.value} : i
                          );
                          setItinerary(updated);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                          value={item.cost}
                          onChange={(e) => {
                            const updated = itinerary.map(i => 
                              i.id === item.id ? {...i, cost: parseFloat(e.target.value) || 0} : i
                            );
                            setItinerary(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addItineraryItem}
                className="w-full border-2 border-dashed border-[#9DA65D] text-[#6C733D] py-3 rounded-lg hover:bg-[#6C733D] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Day
              </button>
            </div>
          </section>

          {/* Additional Services */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Additional Services</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-700">Service</h3>
                    {services.length > 1 && (
                      <button
                        onClick={() => removeService(service.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                        value={service.type}
                        onChange={(e) => {
                          const updated = services.map(s => 
                            s.id === service.id ? {...s, type: e.target.value} : s
                          );
                          setServices(updated);
                        }}
                      >
                        <option value="Hotel">Hotel</option>
                        <option value="Flight">Flight</option>
                        <option value="Tour">Tour</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Transport">Transport</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                        value={service.details}
                        onChange={(e) => {
                          const updated = services.map(s => 
                            s.id === service.id ? {...s, details: e.target.value} : s
                          );
                          setServices(updated);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                          value={service.cost}
                          onChange={(e) => {
                            const updated = services.map(s => 
                              s.id === service.id ? {...s, cost: parseFloat(e.target.value) || 0} : s
                            );
                            setServices(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addService}
                className="w-full border-2 border-dashed border-[#9DA65D] text-[#6C733D] py-3 rounded-lg hover:bg-[#6C733D] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>
          </section>

          {/* Pricing Summary */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Pricing Summary</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                      value={pricing.taxRate}
                      onChange={(e) => setPricing({...pricing, taxRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
                      value={pricing.discount}
                      onChange={(e) => setPricing({...pricing, discount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({pricing.taxRate}%):</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount ({pricing.discount}%):</span>
                    <span className="font-medium text-red-600">-${discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-[#252426]">Grand Total:</span>
                      <span className="text-lg font-bold text-[#6C733D]">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notes & Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#252426] mb-4 border-b-2 border-[#9DA65D] pb-2">Notes & Terms</h2>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C733D] focus:border-transparent"
              rows={4}
              placeholder="Enter any special instructions, terms, or conditions..."
              value={pricing.notes}
              onChange={(e) => setPricing({...pricing, notes: e.target.value})}
            />
          </section>
        </div>

        {/* Sticky Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
            <button className="px-6 py-3 border border-[#6C733D] text-[#6C733D] rounded-lg hover:bg-[#6C733D] hover:text-white transition-colors">
              Preview PDF
            </button>
            <button className="px-6 py-3 bg-[#6C733D] text-white rounded-lg hover:bg-[#5a5f33] transition-colors">
              Send Quotation
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}