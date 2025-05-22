/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

/**
 * A custom hook to fetch a business description suggestion based on business type and optional business name.
 * @param {Object} params - Parameters for the suggestion
 * @param {string} params.businessType - The type of business (e.g., "Restaurant")
 * @param {string} [params.businessName] - The name of the business (optional)
 * @returns {Object} - The suggested description and loading state
 */
export function useDescriptionSuggestion({ businessType, businessName }) {
  const [suggestedDescription, setSuggestedDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3100";

  useEffect(() => {
    const fetchDescriptionSuggestion = async () => {
      if (!businessType) {
        setSuggestedDescription(null);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("businessType", businessType.toLowerCase());
        if (businessName) {
          params.append("businessName", businessName);
        }

        const response = await fetch(
          `${baseUrl}/api/description-suggestion?${params.toString()}`,
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
  }, [businessType, businessName]);

  return {
    suggestedDescription,
    isLoading,
  };
}
