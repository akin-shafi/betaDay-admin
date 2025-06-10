/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { message, Button, Row, Col, Typography, Card, Spin } from "antd";
import { ReloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { useSession } from "@/hooks/useSession";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { fetchAllAnalytics } from "@/services/analyticsService";

const { Title, Text } = Typography;

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
    <div
      style={{
        // padding: "16px",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header Section */}
      <Card
        className="non-printable"
        style={{ marginBottom: "16px" }}
        bodyStyle={{ padding: "16px" }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Title level={3} style={{ margin: 0, fontSize: "20px" }}>
              Analytics Dashboard
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Comprehensive analytics and insights
            </Text>
          </Col>
          <Col xs={24} sm={12}>
            <Row justify="end" gutter={[8, 8]}>
              <Col>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                  size="large"
                  style={{ minWidth: "100px" }}
                >
                  Refresh
                </Button>
              </Col>
              <Col>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                  size="large"
                  style={{ minWidth: "100px" }}
                >
                  Print
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Date Range Picker */}
      <div className="non-printable" style={{ marginBottom: "16px" }}>
        <DateRangePicker onChange={setDateRange} />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <Card style={{ textAlign: "center", marginBottom: "16px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text>Loading analytics data...</Text>
          </div>
        </Card>
      )}

      {/* Analytics Content */}
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
