"use client";

import { useState, useEffect } from "react";
import { message, Button, Space } from "antd";
import { ReloadOutlined, PrinterOutlined } from "@ant-design/icons";
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
    <div className="space-y-6">
      <div className="non-printable">
        <h5 className="text-2xl font-semibold text-gray-900">Analytics</h5>
        <p className="text-gray-600 text-sm">
          Comprehensive analytics and insights
        </p>
      </div>

      <div className="flex justify-between items-center non-printable">
        <DateRangePicker onChange={setDateRange} />
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            Print
          </Button>
        </Space>
      </div>

      <div className="printable-content">
        <AnalyticsOverview
          data={analyticsData?.dashboardData}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
