"use client"

import { useState, useEffect } from "react"
import { analyticsAPI } from "../services/api"

// Hook for Total Delivery Fees
export function useTotalDeliveryFees(dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await analyticsAPI.getTotalDeliveryFees(dateRange)
      setData(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch delivery fees")
      console.error("Error fetching delivery fees:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [dateRange.startDate, dateRange.endDate])

  return { data, loading, error, refetch: () => fetchData() }
}

// Hook for Total Service Fees
export function useTotalServiceFees(dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await analyticsAPI.getTotalServiceFees(dateRange)
        setData(response.data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch service fees")
        console.error("Error fetching service fees:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [JSON.stringify(dateRange)])

  return { data, loading, error, refetch: () => fetchData() }
}

// Hook for Revenue by Business
export function useRevenueByBusiness(dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await analyticsAPI.getRevenueByBusiness(dateRange)
        setData(response.data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch business revenue")
        console.error("Error fetching business revenue:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [JSON.stringify(dateRange)])

  return { data, loading, error, refetch: () => fetchData() }
}

// Hook for Delivery Fees by Business
export function useDeliveryFeesByBusiness(dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await analyticsAPI.getDeliveryFeesByBusiness(dateRange)
        setData(response.data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch delivery fees by business")
        console.error("Error fetching delivery fees by business:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [JSON.stringify(dateRange)])

  return { data, loading, error, refetch: () => fetchData() }
}

// Hook for Service Fees by Business
export function useServiceFeesByBusiness(dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await analyticsAPI.getServiceFeesByBusiness(dateRange)
        setData(response.data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch service fees by business")
        console.error("Error fetching service fees by business:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [JSON.stringify(dateRange)])

  return { data, loading, error, refetch: () => fetchData() }
}
