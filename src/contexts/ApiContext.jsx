/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
"use client";

import { createContext, useContext } from "react";
import axios from "axios";
import { useSession } from "@/hooks/useSession";

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const { session, logout, updateActivity } = useSession();
  const token = session?.token;

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add auth token to requests and update activity
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Update last activity timestamp on API requests
      updateActivity();
    }
    return config;
  });

  // Handle token expiration
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle token expiration
        logout();
        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }
      return Promise.reject(error);
    }
  );

  // Analytics API calls
  const analyticsAPI = {
    getDashboardAnalytics: (params = {}) =>
      api.get("/api/analytics/dashboard", { params }),
    getTotalDeliveryFees: (params = {}) =>
      api.get("/api/analytics/delivery-fees", { params }),
    getTotalServiceFees: (params = {}) =>
      api.get("/api/analytics/service-fees", { params }),
    getRevenueByBusiness: (params = {}) =>
      api.get("/api/analytics/revenue-by-business", { params }),
    getDeliveryFeesByBusiness: (params = {}) =>
      api.get("/api/analytics/delivery-fees-by-business", { params }),
    getServiceFeesByBusiness: (params = {}) =>
      api.get("/api/analytics/service-fees-by-business", { params }),
  };

  // Orders API calls
  const ordersAPI = {
    getAllOrders: (params = {}) => api.get("/orders", { params }),
    getOrderById: (orderId) => api.get(`/orders/${orderId}`),
    updateOrderStatus: (orderId, data) =>
      api.patch(`/orders/${orderId}/status`, data),
    getOrderAnalytics: (params = {}) =>
      api.get("/orders/analytics", { params }),
    bulkOrderOperations: (data) => api.post("/orders/bulk", data),
    processRefund: (orderId, data) =>
      api.post(`/orders/${orderId}/refund`, data),
  };

  return (
    <ApiContext.Provider value={{ api, analyticsAPI, ordersAPI }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
