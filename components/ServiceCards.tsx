'use client'
import React from 'react';
import { MapPin, Car, Compass, Hotel, Plus, Package, Package2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const services = [
  {
    title: 'Add City',
    icon: MapPin,
    description: 'Manage destinations and cities',
    gradient: 'bg-gradient-to-r from-blue-600 to-blue-500',
    color: '#3b5bdb'
  },
  {
    title: 'Accommodation',
    icon: Hotel,
    description: 'Hotels and lodging',
    gradient: 'bg-gradient-to-r from-purple-500 to-blue-600',
    color: '#3182ce'
  },
  {
    title: 'Transfer',
    icon: Car,
    description: 'Transportation services',
    gradient: 'bg-gradient-to-r from-green-500 to-green-700',
    color: '#2f855a'
  },
  {
    title: 'Activities',
    icon: Compass,
    description: 'Tours and experiences',
    gradient: 'bg-gradient-to-r from-orange-500 to-pink-600',
    color: '#d53f8c'
  },
  {
    title: 'Meal Plans',
    icon: Plus,  
    description: 'Meal plans and food options',
    gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    color: '#dd6b20'
  },
  {
    title: 'Add-ons',
    icon: Plus,
    description: 'Extra services and amenities',
    gradient: 'bg-gradient-to-r from-pink-500 to-yellow-400',
    color: '#d69e2e'
  },
  {
    title: 'Packages',
    icon: Package,
    description: 'Pre-built travel packages',
    gradient: 'bg-gradient-to-r from-blue-500 to-green-500',
    color: '#38a169'
  },
  // {
  //   title: 'Custom Packages',
  //   icon: Package2,
  //   description: 'Fully customized packages',
  //   gradient: 'bg-gradient-to-r from-purple-400 to-pink-400',
  //   color: '#fa709a'
  // }
];

export const ServiceCards = ({ selectedCountry }: any) => {
  const router = useRouter();

  const serviceRoutes = {
    'Add City': '/admin/dashboard/destinations',
    'Transfer': '/admin/dashboard/transfer',
    'Packages': '/admin/dashboard/packages',
    'Meal Plans': '/admin/dashboard/meal-plans',
    'Activities': '/admin/dashboard/activities',
    'Custom Packages': '/admin/dashboard/fully-packed-packages',
    'Accommodation': '/admin/dashboard/hotels',
    'Inclusion': '/admin/dashboard/inclusion-templates',
    'Exclusion': '/admin/dashboard/exclusion-templates',
    'Add-ons': '/admin/dashboard/add-ons',
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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