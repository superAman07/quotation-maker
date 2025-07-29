"use client"

import type React from "react"
import { useState } from "react"
import { Calculator, ArrowRight } from "lucide-react"

interface CurrencyConverterProps {
  selectedCountry: {
    name: string
    currency: string
    flag: string
  }
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ selectedCountry }) => {
  const [rate, setRate] = useState("2.80")
  const [amount, setAmount] = useState("1000")

  const convertedAmount = (Number.parseFloat(amount) * Number.parseFloat(rate)).toFixed(2)

  return (
    <div className="bg-white rounded-xl p-4 card-shadow border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <Calculator className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Currency Converter</h3>
          <p className="text-xs text-gray-500">INR to {selectedCountry.currency}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-3 items-center"> 
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">Amount (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg focus:outline-green-400 focus:ring-2 focus:ring-green-500"
              placeholder="1000"
            />
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Rate (1 INR = {selectedCountry.currency})
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg focus:outline-green-400 focus:ring-2 focus:ring-green-500"
              placeholder="1.50"
              step="0.01"
            />
          </div>
        </div>
 
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg mt-4.5 px-3 py-2 min-w-fit">
          <div className="flex items-center gap-1">
            <span className="text-lg text-gray-500">🇮🇳</span>
            <span className="text-sm font-medium text-gray-800">₹{amount}</span>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400" />

          <div className="flex items-center gap-1">
            <span className="text-lg text-gray-500">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-800">
              {selectedCountry.currency} {convertedAmount}
            </span>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-4 mt-4.5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
          Update
        </button>
      </div>
    </div>
  )
}
