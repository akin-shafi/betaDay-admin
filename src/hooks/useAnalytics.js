"use client"

import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_BASE_URL

// Analytics API functions
export const getDashboardAnalytics = async (token, params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.startDate) {
    queryParams.append("startDate", params.startDate.toISOString())
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate.toISOString())
  }
  if (params.businessId) {
    queryParams.append("businessId", params.businessId)
  }

  const url = `${API_URL}/analytics/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch dashboard analytics")
  }

  return response.json()
}

export const getTotalDeliveryFees = async (token, params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.startDate) {
    queryParams.append("startDate", params.startDate.toISOString())
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate.toISOString())
  }

  const url = `${API_URL}/analytics/delivery-fees${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch delivery fees")
  }

  return response.json()
}

export const getTotalServiceFees = async (token, params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.startDate) {
    queryParams.append("startDate", params.startDate.toISOString())
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate.toISOString())
  }

  const url = `${API_URL}/analytics/service-fees${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch service fees")
  }

  return response.json()
}

export const getRevenueByBusiness = async (token, params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.startDate) {
    queryParams.append("startDate", params.startDate.toISOString())
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate.toISOString())
  }

  const url = `${API_URL}/analytics/revenue-by-business${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch business revenue")
  }

  return response.json()
}

export const getDeliveryFeesByBusiness = async (token, params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.startDate) {
    queryParams.append("startDate", params.startDate.toISOString())
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate.toISOString())
  }

  const url = `${API_URL}/analytics/delivery-fees-by-business${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch delivery fees by business")
  }

  return response.json()
}

export const getServiceFeesByBusiness = async (token, params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.startDate) {
    queryParams.append("startDate", params.startDate.toISOString())
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate.toISOString())
  }

  const url = `${API_URL}/analytics/service-fees-by-business${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch service fees by business")
  }

  return response.json()
}

// Hook for dashboard analytics
export function useAnalytics(token, dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError("No authentication token provided")
      return
    }

    fetchAnalytics()
  }, [token, dateRange.startDate, dateRange.endDate])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getDashboardAnalytics(token, dateRange)
      setData(response.data)
    } catch (err) {
      setError(err.message || "Failed to fetch analytics")
      console.error("Analytics fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchAnalytics }
}
