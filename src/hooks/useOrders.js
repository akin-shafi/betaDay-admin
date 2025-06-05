"use client"

import { useState, useEffect } from "react"
import { ordersAPI } from "../services/api"

export function useOrders(params = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [params.page, params.limit, params.status, params.startDate, params.endDate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await ordersAPI.getAllOrders(params)
      setData(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders")
      console.error("Orders fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchOrders }
}
