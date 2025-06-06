"use client";

import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Orders API functions
export const getAllOrders = async (token, params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.status) queryParams.append("status", params.status);
  if (params.startDate)
    queryParams.append("startDate", params.startDate.toISOString());
  if (params.endDate)
    queryParams.append("endDate", params.endDate.toISOString());

  const url = `${API_URL}/api/orders${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  return response.json();
};

export const getOrderById = async (token, orderId) => {
  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch order");
  }

  return response.json();
};

export const updateOrderStatus = async (token, orderId, data) => {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update order status");
  }

  return response.json();
};

export const getOrderAnalytics = async (token, params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.startDate)
    queryParams.append("startDate", params.startDate.toISOString());
  if (params.endDate)
    queryParams.append("endDate", params.endDate.toISOString());
  if (params.businessId) queryParams.append("businessId", params.businessId);

  const url = `${API_URL}/api/orders/analytics${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch order analytics");
  }

  return response.json();
};

export const bulkOrderOperations = async (token, data) => {
  const response = await fetch(`${API_URL}/api/orders/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to perform bulk operations");
  }

  return response.json();
};

export const processRefund = async (token, orderId, data) => {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/refund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to process refund");
  }

  return response.json();
};

// Hook for orders
export function useOrders(token, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No authentication token provided");
      return;
    }

    fetchOrders();
  }, [
    token,
    params.page,
    params.limit,
    params.status,
    params.startDate,
    params.endDate,
  ]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllOrders(token, params);
      setData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchOrders };
}
