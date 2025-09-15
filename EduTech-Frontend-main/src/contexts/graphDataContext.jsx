import React, { createContext, useState, useEffect } from 'react';

export const GraphDataContext = createContext();

export const GraphDataProvider = ({ children }) => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const storedGraphData = sessionStorage.getItem("graphData");
    setGraphData(JSON.parse(storedGraphData));
  }, []);

  return (
    <GraphDataContext.Provider value={{ graphData, setGraphData }}>
      {children}
    </GraphDataContext.Provider>
  );
};
