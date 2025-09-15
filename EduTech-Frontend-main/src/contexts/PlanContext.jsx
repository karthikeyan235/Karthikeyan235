import React, { createContext, useState } from "react";

const PlanContext = createContext();

const PlanProvider = ({ children }) => {
  const [plan, setPlan] = useState(null);
  const [iid, setIID] = useState(null);
  const [isDummy, setIsDummy] = useState(null);

  return (
    <PlanContext.Provider value={{ plan, setPlan, iid, setIID, isDummy, setIsDummy }}>
      {children}
    </PlanContext.Provider>
  );
};

export { PlanContext, PlanProvider };