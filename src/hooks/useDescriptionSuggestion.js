/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

export function useDescriptionSuggestion(businessType) {
  const [suggestedDescription, setSuggestedDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8500";

  useEffect(() => {
    const fetchDescriptionSuggestion = async () => {
      if (!businessType) {
        setSuggestedDescription(null);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/api/description-suggestion?businessType=${encodeURIComponent(
            businessType
          )}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch description suggestion");
        }

        const data = await response.json();
        setSuggestedDescription(data.description);
      } catch (error) {
        console.error("Error fetching description suggestion:", error);
        setSuggestedDescription(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDescriptionSuggestion();
  }, [businessType]);

  return {
    suggestedDescription,
    isLoading,
  };
}

// const UseDescriptionSuggestion = () => {
//   return <div></div>;
// };

// export default UseDescriptionSuggestion;
