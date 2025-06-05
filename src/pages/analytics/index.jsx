"use client"

import { useState } from "react"
import { useAnalytics } from "@/hooks/useAnalytics"
import {
  useTotalDeliveryFees,
  useTotalServiceFees,
  useRevenueByBusiness,
  useDeliveryFeesByBusiness,
  useServiceFeesByBusiness,
} from "@/hooks/useAnalyticsMetrics"
import { DateRangePicker } from "@/components/analytics/DateRangePicker"
import { FeesCard } from "@/components/analytics/FeesCard"
import { BusinessTable } from "@/components/analytics/BusinessTable"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({})
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch all analytics data
  const { data: analytics, loading: analyticsLoading, error: analyticsError } = useAnalytics(dateRange)
  const { data: deliveryFees, loading: deliveryFeesLoading, error: deliveryFeesError } = useTotalDeliveryFees(dateRange)
  const { data: serviceFees, loading: serviceFeesLoading, error: serviceFeesError } = useTotalServiceFees(dateRange)
  const { data: revenueByBusiness, loading: revenueLoading, error: revenueError } = useRevenueByBusiness(dateRange)
  const {
    data: deliveryFeesByBusiness,
    loading: deliveryByBusinessLoading,
    error: deliveryByBusinessError,
  } = useDeliveryFeesByBusiness(dateRange)
  const {
    data: serviceFeesByBusiness,
    loading: serviceByBusinessLoading,
    error: serviceByBusinessError,
  } = useServiceFeesByBusiness(dateRange)

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "revenue", label: "Revenue by Business" },
    { id: "delivery", label: "Delivery Fees" },
    { id: "service", label: "Service Fees" },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case "revenue":
        return (
          <BusinessTable
            title="Revenue by Business"
            data={revenueByBusiness}
            loading={revenueLoading}
            error={revenueError}
          />
        )
      case "delivery":
        return (
          <div className="space-y-6">
            <FeesCard
              title="Total Delivery Fees"
              data={deliveryFees}
              loading={deliveryFeesLoading}
              error={deliveryFeesError}
            />
            <BusinessTable
              title="Delivery Fees by Business"
              data={deliveryFeesByBusiness}
              loading={deliveryByBusinessLoading}
              error={deliveryByBusinessError}
            />
          </div>
        )
      case "service":
        return (
          <div className="space-y-6">
            <FeesCard
              title="Total Service Fees"
              data={serviceFees}
              loading={serviceFeesLoading}
              error={serviceFeesError}
            />
            <BusinessTable
              title="Service Fees by Business"
              data={serviceFeesByBusiness}
              loading={serviceByBusinessLoading}
              error={serviceByBusinessError}
            />
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            {/* Analytics Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border">
                <h4 className="text-sm font-medium text-gray-500">Total Revenue</h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ₦{analytics?.totalRevenue ? (analytics.totalRevenue / 1000000).toFixed(1) + "M" : "0"}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border">
                <h4 className="text-sm font-medium text-gray-500">Total Orders</h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analytics?.totalOrders?.toLocaleString() || "0"}
                </p>
              </div>
              <FeesCard
                title="Total Delivery Fees"
                data={deliveryFees}
                loading={deliveryFeesLoading}
                error={deliveryFeesError}
              />
              <FeesCard
                title="Total Service Fees"
                data={serviceFees}
                loading={serviceFeesLoading}
                error={serviceFeesError}
              />
            </div>

            {/* Business Performance Tables */}
            <div className="grid md:grid-cols-2 gap-6">
              <BusinessTable
                title="Top Revenue by Business"
                data={revenueByBusiness?.slice(0, 5)}
                loading={revenueLoading}
                error={revenueError}
              />
              <BusinessTable
                title="Top Delivery Fees by Business"
                data={deliveryFeesByBusiness?.slice(0, 5)}
                loading={deliveryByBusinessLoading}
                error={deliveryByBusinessError}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h5 className="text-2xl font-semibold text-gray-900">Analytics</h5>
        <p className="text-gray-600 text-sm">Comprehensive analytics and insights</p>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker onChange={setDateRange} />

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Content */}
      {renderActiveTab()}
    </div>
  )
}
