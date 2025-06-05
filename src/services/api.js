import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Analytics API calls
export const analyticsAPI = {
  getDashboardAnalytics: (params = {}) => api.get("/analytics/dashboard", { params }),

  getTotalDeliveryFees: (params = {}) => api.get("/analytics/delivery-fees", { params }),

  getTotalServiceFees: (params = {}) => api.get("/analytics/service-fees", { params }),

  getRevenueByBusiness: (params = {}) => api.get("/analytics/revenue-by-business", { params }),

  getDeliveryFeesByBusiness: (params = {}) => api.get("/analytics/delivery-fees-by-business", { params }),

  getServiceFeesByBusiness: (params = {}) => api.get("/analytics/service-fees-by-business", { params }),
}

// Orders API calls
export const ordersAPI = {
  getAllOrders: (params = {}) => api.get("/orders", { params }),

  getOrderById: (orderId) => api.get(`/orders/${orderId}`),

  updateOrderStatus: (orderId, data) => api.patch(`/orders/${orderId}/status`, data),

  getOrderAnalytics: (params = {}) => api.get("/orders/analytics", { params }),

  bulkOrderOperations: (data) => api.post("/orders/bulk", data),

  processRefund: (orderId, data) => api.post(`/orders/${orderId}/refund`, data),
}

export default api
