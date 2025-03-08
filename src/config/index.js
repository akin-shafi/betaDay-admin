// Environment variables
export const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8500";

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Users
  USERS: "/users",
  USER_DETAILS: (id) => `/users/${id}`,

  // Vendors/Businesses
  BUSINESSES: "/businesses",
  BUSINESS_DETAILS: (id) => `/businesses/${id}`,
  BUSINESS_STATUS: (id) => `/businesses/${id}/status`,

  // Orders
  ORDERS: "/orders",
  ORDER_DETAILS: (id) => `/orders/${id}`,
  ORDER_STATUS: (id) => `/orders/${id}/status`,
  ORDER_EXPORT: "/orders/export",

  // Riders
  RIDERS: "/riders",
  RIDER_DETAILS: (id) => `/riders/${id}`,

  // Reports
  REPORTS: "/reports",

  // Analytics
  ANALYTICS: "/analytics",

  // Settings
  SETTINGS: "/settings",
};

// Frontend Routes (for internal navigation)
export const ROUTES = {
  // Auth
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Main routes
  DASHBOARD: "/dashboard",
  VENDORS: "/vendors",
  VENDOR_DETAILS: (id) => `/vendors/${id}`,
  ORDERS: "/orders",
  ORDER_DETAILS: (id) => `/orders/${id}`,
  RIDERS: "/riders",
  RIDER_DETAILS: (id) => `/riders/${id}`,
  REPORTS: "/reports",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
};

// App Constants
export const APP_CONFIG = {
  PAGE_SIZE: 10,
  DATE_FORMAT: "YYYY-MM-DD",
  DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
  CURRENCY: "₦",
  STATUS_COLORS: {
    active: "green",
    inactive: "red",
    pending: "yellow",
    processing: "blue",
    completed: "green",
    cancelled: "red",
    failed: "red",
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  DEFAULT: "Something went wrong. Please try again later.",
  NETWORK: "Network error. Please check your internet connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATE: "Created successfully.",
  UPDATE: "Updated successfully.",
  DELETE: "Deleted successfully.",
  STATUS_UPDATE: "Status updated successfully.",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  THEME: "theme",
  LANGUAGE: "language",
};
