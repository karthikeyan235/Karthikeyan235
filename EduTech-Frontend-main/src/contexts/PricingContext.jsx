import { createContext, useState } from 'react';

// Create a Context
export const PricingContext = createContext();

// Create a Provider component
export const PricingProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PricingContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </PricingContext.Provider>
  );
};
