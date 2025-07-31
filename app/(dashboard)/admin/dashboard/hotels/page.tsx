'use client'
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Star, Edit2, Trash2, MapPin, DollarSign, X } from 'lucide-react';

// Types
interface Hotel {
  id: string;
  name: string;
  country: string;
  city: string;
  starRating: number;
  amenities: string[];
  hasMealPlan: boolean;
  mealPlan?: string;
  source?: string;
  price: number;
  currency: string;
}

interface HotelPayload {
  name: string;
  country: string;
  city: string;
  starRating: number;
  amenities: string[];
  hasMealPlan: boolean;
  mealPlan?: string;
  source?: string;
  price: number;
  currency: string;
}

// Mock Data
const countryCityData = [
  {
    country: 'United States',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas', 'San Francisco']
  },
  {
    country: 'United Kingdom',
    cities: ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Liverpool', 'Bristol']
  },
  {
    country: 'France',
    cities: ['Paris', 'Nice', 'Lyon', 'Marseille', 'Cannes', 'Bordeaux']
  },
  {
    country: 'Italy',
    cities: ['Rome', 'Milan', 'Venice', 'Florence', 'Naples', 'Turin']
  },
  {
    country: 'Spain',
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Granada', 'Bilbao']
  }
];

const amenitiesOptions = [
  'Wi-Fi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service',
  'Concierge', 'Valet Parking', 'Business Center', 'Pet Friendly',
  'Airport Shuttle', 'Beach Access', 'Golf Course', 'Conference Rooms'
];

const mealPlanOptions = [
  'Breakfast', 'Lunch', 'Dinner', 'Breakfast+Lunch', 'Breakfast+Dinner', 
  'Lunch+Dinner', 'All Meals', 'Continental Breakfast', 'American Breakfast'
];

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    country: 'United States',
    city: 'New York',
    starRating: 5,
    amenities: ['Wi-Fi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Concierge'],
    hasMealPlan: true,
    mealPlan: 'Breakfast+Dinner',
    source: 'Direct Booking',
    price: 350,
    currency: 'USD'
  },
  {
    id: '2',
    name: 'Boutique Milano',
    country: 'Italy',
    city: 'Milan',
    starRating: 4,
    amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Room Service'],
    hasMealPlan: true,
    mealPlan: 'Continental Breakfast',
    source: 'Travel Agency',
    price: 280,
    currency: 'EUR'
  },
  {
    id: '3',
    name: 'Tokyo Bay Resort',
    country: 'Japan',
    city: 'Tokyo',
    starRating: 5,
    amenities: ['Wi-Fi', 'Pool', 'Spa', 'Restaurant'],
    hasMealPlan: false,
    source: 'Hotel Chain',
    price: 420,
    currency: 'USD'
  },
  {
    id: '4',
    name: 'London Bridge Suites',
    country: 'United Kingdom',
    city: 'London',
    starRating: 4,
    amenities: ['Wi-Fi', 'Gym', 'Business Center', 'Room Service'],
    hasMealPlan: true,
    mealPlan: 'American Breakfast',
    price: 320,
    currency: 'GBP'
  },
  {
    id: '5',
    name: 'Barcelona Beach Hotel',
    country: 'Spain',
    city: 'Barcelona',
    starRating: 3,
    amenities: ['Wi-Fi', 'Pool', 'Beach Access', 'Restaurant', 'Bar'],
    hasMealPlan: true,
    mealPlan: 'All Meals',
    source: 'Online Platform',
    price: 180,
    currency: 'EUR'
  }
];

// Hotel Modal Component
const HotelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotel: HotelPayload) => void;
  hotel?: Hotel | null;
}> = ({ isOpen, onClose, onSave, hotel }) => {
  const [formData, setFormData] = useState<HotelPayload>({
    name: '',
    country: '',
    city: '',
    starRating: 1,
    amenities: [],
    hasMealPlan: false,
    mealPlan: undefined,
    source: '',
    price: 0,
    currency: 'USD'
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState('');

  React.useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        country: hotel.country,
        city: hotel.city,
        starRating: hotel.starRating,
        amenities: hotel.amenities,
        hasMealPlan: hotel.hasMealPlan,
        mealPlan: hotel.mealPlan,
        source: hotel.source || '',
        price: hotel.price,
        currency: hotel.currency
      });
    } else {
      setFormData({
        name: '',
        country: '',
        city: '',
        starRating: 1,
        amenities: [],
        hasMealPlan: false,
        mealPlan: undefined,
        source: '',
        price: 0,
        currency: 'USD'
      });
    }
  }, [hotel, isOpen]);

  React.useEffect(() => {
    if (formData.country) {
      const countryData = countryCityData.find(c => c.country === formData.country);
      setAvailableCities(countryData ? countryData.cities : []);
      if (!countryData?.cities.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: '' }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.country]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.country && formData.city && formData.price > 0) {
      onSave(formData);
      onClose();
    }
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
    setAmenityInput('');
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-gray-600 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-700">
            {hotel ? 'Edit Hotel' : 'Add New Hotel'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hotel Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hotel Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter hotel name"
              required
            />
          </div>

          {/* Country and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Country</option>
                {countryCityData.map(country => (
                  <option key={country.country} value={country.country}>
                    {country.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City/Destination *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={!formData.country}
                required
              >
                <option value="">Select City</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Star Rating *
            </label>
            <select
              value={formData.starRating}
              onChange={(e) => setFormData(prev => ({ ...prev, starRating: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>
                  {rating} Star{rating > 1 ? 's' : ''} {'★'.repeat(rating)}
                </option>
              ))}
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select amenity to add</option>
                {amenitiesOptions
                  .filter(amenity => !formData.amenities.includes(amenity))
                  .map(amenity => (
                    <option key={amenity} value={amenity}>
                      {amenity}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => addAmenity(amenityInput)}
                disabled={!amenityInput}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map(amenity => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Meal Plan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Meal Plan
            </label>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.hasMealPlan}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    hasMealPlan: e.target.checked,
                    mealPlan: e.target.checked ? prev.mealPlan : undefined
                  }))}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Does this hotel offer a meal plan?</span>
              </label>

              {formData.hasMealPlan && (
                <select
                  value={formData.mealPlan || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, mealPlan: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select meal plan</option>
                  {mealPlanOptions.map(plan => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Source and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Source
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Direct Booking, Travel Agency"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price per Night *
              </label>
              <div className="relative">
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="absolute left-0 top-0 h-full px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="INR">₹</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                  <option value="GBP">£</option>
                  <option value="JPY">¥</option>
                </select>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
 
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 cursor-pointer text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 cursor-pointer bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-700 hover:to-cyan-500 transition-all font-medium shadow-lg"
            >
              {hotel ? 'Update Hotel' : 'Add Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Hotel Table Component
const HotelTable: React.FC<{
  hotels: Hotel[];
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotelId: string) => void;
}> = ({ hotels, onEdit, onDelete }) => {
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">
          {rating}
        </span>
      </div>
    );
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥'
    };
    return symbols[currency] || currency;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Hotel Details
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Amenities
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Meal Plan
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hotels.map((hotel, index) => (
              <tr
                key={hotel.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {hotel.name}
                    </h3>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{hotel.city}</div>
                      <div className="text-sm text-gray-500">{hotel.country}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {renderStarRating(hotel.starRating)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {hotel.amenities.slice(0, 3).map(amenity => (
                      <span
                        key={amenity}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {hotel.hasMealPlan ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {hotel.mealPlan}
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                      Not Included
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700 text-sm">
                    {hotel.source || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    {getCurrencySymbol(hotel.currency)}{hotel.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      /night
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(hotel)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Hotel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(hotel.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Hotel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hotels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No hotels found</div>
          <p className="text-gray-500">Add your first hotel to get started</p>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
function App() {
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveHotel = (hotelData: HotelPayload) => {
    if (editingHotel) {
      // Update existing hotel
      setHotels(prev => prev.map(hotel => 
        hotel.id === editingHotel.id 
          ? { ...hotelData, id: editingHotel.id }
          : hotel
      ));
    } else {
      // Add new hotel
      const newHotel: Hotel = {
        ...hotelData,
        id: Date.now().toString()
      };
      setHotels(prev => [...prev, newHotel]);
    }
    
    setEditingHotel(null);
    setIsModalOpen(false);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setIsModalOpen(true);
  };

  const handleDeleteHotel = (hotelId: string) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      setHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
    }
  };

  const handleAddHotel = () => {
    setEditingHotel(null);
    setIsModalOpen(true);
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalHotels = hotels.length;
  const averageRating = hotels.length > 0 
    ? (hotels.reduce((sum, hotel) => sum + hotel.starRating, 0) / hotels.length).toFixed(1)
    : '0';
  const totalCountries = new Set(hotels.map(hotel => hotel.country)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hotels, cities, or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              
              <button className="flex items-center gap-2 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
              
                <button
                onClick={handleAddHotel}
                className="flex items-center gap-2 cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-700 hover:to-cyan-500 transition-all font-medium shadow-lg"
                >
                <Plus className="w-4 h-4" />
                Add Hotel
                </button>
            </div>
          </div>
        </div>

        {/* Hotels Table */}
        <HotelTable
          hotels={filteredHotels}
          onEdit={handleEditHotel}
          onDelete={handleDeleteHotel}
        />

        {/* Modal */}
        <HotelModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingHotel(null);
          }}
          onSave={handleSaveHotel}
          hotel={editingHotel}
        />
      </div>
    </div>
  );
}

export default App;