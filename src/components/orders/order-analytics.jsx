/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
"use client";

import { Card, Row, Col, Statistic, Alert, Spin, Badge } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined, 
  ShoppingCartOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

export function OrderAnalyticsComponent({ analytics, loading, error }) {
  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "₦0.00";
    }
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  // Handle nested data structure
  const normalizedAnalytics = {
    totalOrders: analytics?.data?.totalOrders ?? 0,
    totalRevenue: analytics?.data?.totalRevenue ?? 0,
    pendingOrders: analytics?.data?.pendingOrders ?? 0,
    averageOrderValue: analytics?.data?.averageOrderValue ?? 0,
  };

  // Calculate percentage changes
  const calculateOrderChange = () => {
    const todayOrders = analytics?.data?.todayOrders ?? 0;
    const last7Days = analytics?.data?.recentTrends?.last7Days || [];
    const previousDayOrders =
      last7Days.find((trend) => trend.date === "2025-05-31")?.orders || 0;
    if (previousDayOrders === 0) return 0;
    return ((todayOrders - previousDayOrders) / previousDayOrders) * 100;
  };

  const calculateRevenueChange = () => {
    const todayRevenue = analytics?.data?.todayRevenue ?? 0;
    const last7Days = analytics?.data?.recentTrends?.last7Days || [];
    const previousDayRevenue =
      last7Days.find((trend) => trend.date === "2025-05-31")?.revenue || 0;
    if (previousDayRevenue === 0) return 0;
    return ((todayRevenue - previousDayRevenue) / previousDayRevenue) * 100;
  };

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Alert
          message="Error"
          description="Failed to load analytics data. Please try again later."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!analytics?.data) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Alert
          message="No Data"
          description="No analytics data available."
          type="info"
          showIcon
        />
      </div>
    );
  }

  const orderChange = calculateOrderChange();
  const revenueChange = calculateRevenueChange();

  return (
    <div style={{ marginBottom: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={normalizedAnalytics.totalOrders}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <div style={{ fontSize: "12px", color: orderChange >= 0 ? "#52c41a" : "#ff4d4f" }}>
                  {orderChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
                  {Math.abs(orderChange).toFixed(1)}%
                </div>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={normalizedAnalytics.totalRevenue}
              formatter={(value) => formatCurrency(value)}
              suffix={
                <div style={{ fontSize: "12px", color: revenueChange >= 0 ? "#52c41a" : "#ff4d4f" }}>
                  {revenueChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
                  {Math.abs(revenueChange).toFixed(1)}%
                </div>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={normalizedAnalytics.pendingOrders}
              prefix={<ClockCircleOutlined />}
              suffix={<Badge status="warning" text="Needs Attention" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={normalizedAnalytics.averageOrderValue}
              prefix={<UserOutlined />}
              formatter={(value) => formatCurrency(value)}
              suffix={
                <div style={{ fontSize: "12px", color: "#ff4d4f" }}>
                  <ArrowDownOutlined /> 2.1%
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

OrderAnalyticsComponent.propTypes = {
  analytics: PropTypes.shape({
    data: PropTypes.shape({
      totalOrders: PropTypes.number,
      totalRevenue: PropTypes.number,
      pendingOrders: PropTypes.number,
      averageOrderValue: PropTypes.number,
      todayOrders: PropTypes.number,
      todayRevenue: PropTypes.number,
    }),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
};