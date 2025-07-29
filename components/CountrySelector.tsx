'use client'

import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

const countries = [
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: 'THB' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: 'MYR' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: 'VND' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP' },
];

interface CountrySelectorProps {
  selectedCountry: typeof countries[0];
  onCountryChange: (country: typeof countries[0]) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white px-4 cursor-pointer py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
      >
        <Globe className="w-5 h-5 text-blue-600" />
        <span className="text-2xl text-gray-500">{selectedCountry.flag}</span>
        <div className="text-left">
          <p className="font-semibold text-gray-800">{selectedCountry.name}</p>
          <p className="text-sm text-gray-600">{selectedCountry.currency}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-200 min-w-[200px] z-50">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                onCountryChange(country);
                setIsOpen(false);
              }}
              className="w-full flex items-center cursor-pointer gap-3 px-4 py-3 hover:bg-blue-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <span className="text-2xl text-gray-500">{country.flag}</span>
              <div className="text-left">
                <p className="font-medium text-gray-800">{country.name}</p>
                <p className="text-sm text-gray-600">{country.currency}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};