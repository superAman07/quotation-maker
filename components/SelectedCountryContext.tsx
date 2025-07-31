'use client'
import React, { createContext, useContext, useState, useEffect } from "react";

import type { Country } from "@/types/country";

type SelectedCountryContextType = {
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
};

const SelectedCountryContext = createContext<SelectedCountryContextType | undefined>(undefined);

export const SelectedCountryProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCountry, setSelectedCountryState] = useState<Country | null>(null);
 
  useEffect(() => {
    const stored = localStorage.getItem("selectedCountry");
    if (stored) setSelectedCountryState(JSON.parse(stored));
  }, []);

  const setSelectedCountry = (country: Country | null) => {
    setSelectedCountryState(country);
    if (country) localStorage.setItem("selectedCountry", JSON.stringify(country));
    else localStorage.removeItem("selectedCountry");
  };

  return (
    <SelectedCountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </SelectedCountryContext.Provider>
  );
};

export const useSelectedCountry = () => {
  const context = useContext(SelectedCountryContext);
  if (!context) {
    throw new Error("useSelectedCountry must be used within a SelectedCountryProvider");
  }
  return context;
};