/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { RefreshCw, Printer } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { fetchAllAnalytics } from "@/services/analyticsService";

export default function AnalyticsPage() {
  const { session } = useSession();
  const token = session?.token;
  const [dateRange, setDateRange] = useState({});
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    if (!token) {
      setError("No authentication token provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchAllAnalytics(token, dateRange);
      setAnalyticsData(response.data);
      message.success("Analytics data loaded successfully");
    } catch (err) {
      setError(err.message || "Failed to fetch analytics data");
      message.error("Failed to load analytics data");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token, dateRange.startDate, dateRange.endDate]);

  const handlePrint = () => {
    window.print();
    message.success("Print initiated");
  };

  const handleRefresh = () => {
    fetchAnalytics();
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive analytics and insights
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="print:hidden">
        <DateRangePicker onChange={setDateRange} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="text-sm text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      )}

      {/* Analytics Content */}
      {!loading && (
        <div className="print:block">
          <AnalyticsOverview
            data={analyticsData?.dashboardData}
            loading={loading}
            error={error}
          />
        </div>
      )}
    </div>
  );
}
