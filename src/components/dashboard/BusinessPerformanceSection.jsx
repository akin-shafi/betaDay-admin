/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import { getRevenueByBusiness, getDeliveryFeesByBusiness, getServiceFeesByBusiness } from "@/hooks/useAnalytics"

export function BusinessPerformanceSection({ token }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeMetric, setActiveMetric] = useState("revenue")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetchBusinessData()
  }, [token, activeMetric])

  const fetchBusinessData = async () => {
    try {
      setLoading(true)
      let response

      switch (activeMetric) {
        case "revenue":
          response = await getRevenueByBusiness(token)
          break
        case "deliveryFees":
          response = await getDeliveryFeesByBusiness(token)
          break
        case "serviceFees":
          response = await getServiceFeesByBusiness(token)
          break
        default:
          response = await getRevenueByBusiness(token)
      }

      setData(response.data)
    } catch (error) {
      console.error("Error fetching business data:", error)
    } finally {
      setLoading(false)
    }
  }

  const metrics = [
    { id: "revenue", label: "Revenue", color: "text-green-600" },
    { id: "deliveryFees", label: "Delivery Fees", color: "text-blue-600" },
    { id: "serviceFees", label: "Service Fees", color: "text-purple-600" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex gap-4">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeMetric === metric.id ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Business Performance Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            Business Performance - {metrics.find((m) => m.id === activeMetric)?.label}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average per Order
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.map((business, index) => (
                <tr key={business.businessId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{business.businessName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{Number(business.total).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₦{Number(business.average).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
