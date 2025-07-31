'use client'
import { CountrySelector } from '@/components/CountrySelector';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { QuickActions } from '@/components/QuickActions';
import { RecentActivity } from '@/components/RecentActivity';
import { useSelectedCountry } from '@/components/SelectedCountryContext';
import { ServiceCards } from '@/components/ServiceCards';
import { Country } from '@/types/country';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Index = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const { selectedCountry, setSelectedCountry } = useSelectedCountry();

  // const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('/api/admin/country');
        setCountries(res.data.data || []); 
        if (!selectedCountry && res.data.data && res.data.data.length > 0) {
          setSelectedCountry(res.data.data[0]);
        }
      } catch (err) { 
        setCountries([]);
      }
    };
    fetchCountries();
  }, [])

  if (!selectedCountry) return <div>Loading...</div>;

  return (
    <div className="min-h-screen  bg-gray-50">
      <div className="pt-20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl text-gray-500">{selectedCountry?.flag}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {selectedCountry?.name} Dashboard
              </h1>
              <p className="text-gray-600">Manage travel services for {selectedCountry?.name}</p>
            </div>
          </div>

          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={(country: Country) => setSelectedCountry(country)}
            countries={countries}
          />
        </div>

        <div className="mb-8">
          <CurrencyConverter selectedCountry={selectedCountry} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Travel Services</h2>
          <ServiceCards selectedCountry={selectedCountry} />
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