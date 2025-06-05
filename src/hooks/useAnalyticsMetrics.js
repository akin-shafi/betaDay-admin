"use client"

import { useState, useEffect } from "react"
import {
  getTotalDeliveryFees,
  getTotalServiceFees,
  getRevenueByBusiness,
  getDeliveryFeesByBusiness,
  getServiceFeesByBusiness,
} from "./useAnalytics"

// Hook for Total Delivery Fees
export function useTotalDeliveryFees(token, dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!token) {
      setLoading(false)
      setError("No authentication token provided")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await getTotalDeliveryFees(token, dateRange)
      setData(response.data)
    } catch (err) {
      setError(err.message || "Failed to fetch delivery fees")
      console.error("Error fetching delivery fees:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token, dateRange.startDate, dateRange.endDate])

  return { data, loading, error, refetch: fetchData }
}

// Hook for Total Service Fees
export function useTotalServiceFees(token, dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError("No authentication token provided")
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getTotalServiceFees(token, dateRange)
        setData(response.data)
      } catch (err) {
        setError(err.message || "Failed to fetch service fees")
        console.error("Error fetching service fees:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, JSON.stringify(dateRange)])

  return { data, loading, error, refetch: () => fetchData() }
}

// Hook for Revenue by Business
export function useRevenueByBusiness(token, dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!token) {
      setLoading(false)
      setError("No authentication token provided")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await getRevenueByBusiness(token, dateRange)
      setData(response.data)
    } catch (err) {
      setError(err.message || "Failed to fetch business revenue")
      console.error("Error fetching business revenue:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token, JSON.stringify(dateRange)])

  return { data, loading, error, refetch: () => fetchData() }
}

// Hook for Delivery Fees by Business
export function useDeliveryFeesByBusiness(token, dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!token) {
      setLoading(false)
      setError("No authentication token provided")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await getDeliveryFeesByBusiness(token, dateRange)
      setData(response.data)
    } catch (err) {
      setError(err.message || "Failed to fetch delivery fees by business")
      console.error("Error fetching delivery fees by business:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token, JSON.stringify(dateRange)])

  return { data, loading, error, refetch: () => fetchData() }
}

// Hook for Service Fees by Business
export function useServiceFeesByBusiness(token, dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (!token) {
      setLoading(false)
      setError("No authentication token provided")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await getServiceFeesByBusiness(token, dateRange)
      setData(response.data)
    } catch (err) {
      setError(err.message || "Failed to fetch service fees by business")
      console.error("Error fetching service fees by business:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token, JSON.stringify(dateRange)])

  return { data, loading, error, refetch: () => fetchData() }
}
