import React, { createContext, useContext, useState } from "react";

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [comparisonList, setComparisonList] = useState([]);
  const MAX_COMPARISONS = 4;

  const addToCompare = (internship) => {
    if (comparisonList.length >= MAX_COMPARISONS) {
      return { success: false, message: "You can compare up to 4 internships." };
    }
    
    if (comparisonList.some(item => item.id === internship.id)) {
      return { success: false, message: "Already in comparison list." };
    }

    setComparisonList([...comparisonList, internship]);
    return { success: true };
  };

  const removeFromCompare = (internshipId) => {
    setComparisonList(comparisonList.filter(item => item.id !== internshipId));
  };

  const clearCompare = () => {
    setComparisonList([]);
  };

  const isInComparison = (internshipId) => {
    return comparisonList.some(item => item.id === internshipId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInComparison,
        maxComparisons: MAX_COMPARISONS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

