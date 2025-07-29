'use client'
import React, { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

interface CurrencyConverterProps {
  selectedCountry: {
    name: string;
    currency: string;
    flag: string;
  };
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ selectedCountry }) => {
  const [rate, setRate] = useState('35.50');
  const [amount, setAmount] = useState('1000');

  const convertedAmount = (parseFloat(amount) * parseFloat(rate)).toFixed(2);

  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Currency Conversion</h3>
          <p className="text-gray-500">Set exchange rates for {selectedCountry.name}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exchange Rate (INR to {selectedCountry.currency})
            </label>
            <div className="relative">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter rate"
              />
              <TrendingUp className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-700 mb-3">Conversion Example:</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇳</span>
              <div>
                <p className="font-semibold text-gray-800">₹ {amount}</p>
                <p className="text-sm text-gray-500">Indian Rupees</p>
              </div>
            </div>
            
            <div className="text-gray-400">=</div>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCountry.flag}</span>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{selectedCountry.currency} {convertedAmount}</p>
                <p className="text-sm text-gray-500">{selectedCountry.name}</p>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Update Exchange Rate
        </button>
      </div>
    </div>
  );
};