"use client"

import { useState, useEffect } from "react"
import { analyticsAPI } from "../services/api"

export function useAnalytics(dateRange = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange.startDate, dateRange.endDate])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await analyticsAPI.getDashboardAnalytics(dateRange)
      setData(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch analytics")
      console.error("Analytics fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchAnalytics }
}
