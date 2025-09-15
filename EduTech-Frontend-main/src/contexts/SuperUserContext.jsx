import { createContext, useEffect, useState } from 'react';

// Create a Context
export const SuperUserContext = createContext();

// Create a Provider component
export const SuperUserProvider = ({ children }) => {
  const [superUser, setSuperUser] = useState(null);  
  const [supertoken, setSupertoken] = useState(null);
  const [isDummy, setIsDummy] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = sessionStorage.getItem("supertoken");
    const superUserId = sessionStorage.getItem("sup-id");
    setSupertoken(storedToken);
    setSuperUser(superUserId);
    setLoading(false); 
  }, []);

  return (
    <SuperUserContext.Provider value={{ superUser, setSuperUser, supertoken, setSupertoken, loading, isDummy, setIsDummy }}>
      {children}
    </SuperUserContext.Provider>
  );
};
