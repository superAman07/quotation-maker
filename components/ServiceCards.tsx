'use client'
import React from 'react';
import { MapPin, Car, Compass, Hotel, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const services = [
  {
    title: 'Add City',
    icon: MapPin,
    description: 'Manage destinations and cities',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-400',
    color: '#667eea'
  },
  {
    title: 'Transfer',
    icon: Car,
    description: 'Transportation services',
    gradient: 'bg-gradient-to-r from-green-400 to-green-600',
    color: '#56ab2f'
  },
  {
    title: 'Activities',
    icon: Compass,
    description: 'Tours and experiences',
    gradient: 'bg-gradient-to-r from-orange-400 to-pink-500',
    color: '#f093fb'
  },
  {
    title: 'Accommodation',
    icon: Hotel,
    description: 'Hotels and lodging',
    gradient: 'bg-gradient-to-r from-purple-400 to-blue-500',
    color: '#4facfe'
  },
  {
    title: 'Add-ons',
    icon: Plus,
    description: 'Extra services and amenities',
    gradient: 'bg-gradient-to-r from-pink-400 to-yellow-300',
    color: '#ffecd2'
  },
];

export const ServiceCards = ({selectedCountry}:any) => {
  const router = useRouter();

  const serviceRoutes = {
    'Add City': '/admin/dashboard/destinations',
    'Transfer': '/admin/dashboard/vehicles',
    'Activities': '/admin/dashboard/activities',
    'Accommodation': '/admin/dashboard/hotels',
    'Add-ons': '/admin/dashboard/add-ons',
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 card-shadow hover-lift cursor-pointer group"
          >
            <div className={`w-16 h-16 ${service.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            
            <button 
              className="w-full py-3 cursor-pointer group-hover:scale-101 rounded-xl font-semibold transition-all duration-300 text-white"
              style={{ backgroundColor: service.color }}
              onClick={() => {
                const route = serviceRoutes[service.title as keyof typeof serviceRoutes];
                if (route && selectedCountry?.id) {
                  router.push(`${route}?countryId=${selectedCountry.id}`);
                }
              }}
            >
              Manage
            </button>
          </div>
        );
      })}
    </div>
  );
};