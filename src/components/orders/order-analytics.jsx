/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
"use client";

import { Card, Row, Col, Statistic, Badge, Spin, Alert } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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

  // Handle nested data structure and map completedOrders
  const normalizedAnalytics = {
    totalOrders: analytics?.data?.totalOrders ?? 0,
    totalRevenue: analytics?.data?.totalRevenue ?? 0,
    pendingOrders: analytics?.data?.pendingOrders ?? 0,
    averageOrderValue: analytics?.data?.averageOrderValue ?? 0,
    todayOrders: analytics?.data?.todayOrders ?? 0,
    todayRevenue: analytics?.data?.todayRevenue ?? 0,
    completedOrders: analytics?.data?.ordersByStatus?.delivered ?? 0,
    cancelledOrders: analytics?.data?.ordersByStatus?.cancelled ?? 0,
  };

  // Calculate percentage changes (example logic, adjust based on trends if needed)
  const calculateOrderChange = () => {
    const todayOrders = normalizedAnalytics.todayOrders;
    const last7Days = analytics?.data?.recentTrends?.last7Days || [];
    const previousDayOrders =
      last7Days.find((trend) => trend.date === "2025-05-31")?.orders || 0;
    if (previousDayOrders === 0) return 0;
    return ((todayOrders - previousDayOrders) / previousDayOrders) * 100;
  };

  const calculateRevenueChange = () => {
    const todayRevenue = normalizedAnalytics.todayRevenue;
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
              prefix={<DollarOutlined />}
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

        <Col xs={24} lg={12}>
          <Card title="Today's Performance">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Orders Today"
                  value={normalizedAnalytics.todayOrders}
                  valueStyle={{ fontSize: "24px" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Revenue Today"
                  value={normalizedAnalytics.todayRevenue}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ fontSize: "24px" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Order Status Overview">
            <Row gutter={16}>
              <Col span={8} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#52c41a",
                  }}
                >
                  {normalizedAnalytics.completedOrders}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  <CheckCircleOutlined /> Completed
                </div>
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#faad14",
                  }}
                >
                  {normalizedAnalytics.pendingOrders}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  <ClockCircleOutlined /> Pending
                </div>
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#ff4d4f",
                  }}
                >
                  {normalizedAnalytics.cancelledOrders}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  <CloseCircleOutlined /> Cancelled
                </div>
              </Col>
            </Row>
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
      ordersByStatus: PropTypes.shape({
        delivered: PropTypes.number,
        cancelled: PropTypes.number,
      }),
    }),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
};