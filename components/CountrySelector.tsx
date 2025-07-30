'use client'

import React, { useState, useRef , useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Country } from '@/types/country';

interface CountrySelectorProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  countries: Country[];
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
  countries
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white px-4 w-full cursor-pointer py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
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
        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-200 min-w-[220px] z-50">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                onCountryChange(country);
                setIsOpen(false);
              }}
              className="w-full flex items-center cursor-pointer gap-3 px-4 py-3 hover:bg-blue-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <span className="text-md text-gray-500 text-center">{country.flag}</span>
              <div className="flex-[1_1_auto]">
                <p className="text-md text-gray-800">{country.name}</p>
                <p className="text-sm text-gray-600">{country.currency}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};