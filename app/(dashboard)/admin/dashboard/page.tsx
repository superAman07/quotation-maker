'use client'
import { CountrySelector } from '@/components/CountrySelector';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { QuickActions } from '@/components/QuickActions';
import { RecentActivity } from '@/components/RecentActivity';
import { ServiceCards } from '@/components/ServiceCards';
import React, { useState } from 'react';     

const countries = [
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: 'THB' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: 'MYR' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: 'VND' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP' },
];

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  return (
    <div className="min-h-screen bg-gray-50"> 
      <div className="pt-20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl text-gray-500">{selectedCountry.flag}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {selectedCountry.name} Dashboard
              </h1>
              <p className="text-gray-600">Manage travel services for {selectedCountry.name}</p>
            </div>
          </div>
          
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
          />
        </div>

        <div className="mb-8">
          <CurrencyConverter selectedCountry={selectedCountry} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Travel Services</h2>
          <ServiceCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Index;