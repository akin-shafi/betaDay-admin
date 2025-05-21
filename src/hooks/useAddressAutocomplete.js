/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useState, useEffect, useCallback } from "react";

const fetchAddressSuggestions = async (input) => {
  if (!input.trim()) {
    return { status: "OK", predictions: [] };
  }

  const response = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/api/autocomplete?input=${encodeURIComponent(input)}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to fetch address suggestions");
  }

  return response.json();
};

export const useAddressAutocomplete = () => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");

  const debouncedSetInput = useCallback(
    debounce((value) => {
      setDebouncedInput(value);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetInput(input);
    return () => {
      debouncedSetInput.cancel();
    };
  }, [input, debouncedSetInput]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["addressSuggestions", debouncedInput],
    queryFn: () => fetchAddressSuggestions(debouncedInput),
    enabled: debouncedInput.length > 2,
    retry: 1,
    staleTime: 30000,
  });

  return {
    input,
    setInput,
    suggestions: data?.predictions || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
