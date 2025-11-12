import { City } from '@/src/types/city';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Default city (Thyna, Tunisia)
const defaultCity: City = {
  id: "1",
  name: "Thyna",
  apiName: "Thyna",
  country: "TN",
};

interface SelectedCityContextType {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
}

const SelectedCityContext = createContext<SelectedCityContextType | undefined>(undefined);

interface SelectedCityProviderProps {
  children: ReactNode;
}

export function SelectedCityProvider({ children }: SelectedCityProviderProps) {
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);

  return (
    <SelectedCityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </SelectedCityContext.Provider>
  );
}

export function useSelectedCity() {
  const context = useContext(SelectedCityContext);
  if (context === undefined) {
    throw new Error('useSelectedCity must be used within a SelectedCityProvider');
  }
  return context;
}
