/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
"use client";

import { Card, Row, Col, Statistic, Alert, Spin } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

export function PerformanceOverviewComponent({ analytics, loading, error }) {
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
    todayOrders: analytics?.data?.todayOrders ?? 0,
    todayRevenue: analytics?.data?.todayRevenue ?? 0,
    completedOrders: analytics?.data?.ordersByStatus?.delivered ?? 0,
    pendingOrders: analytics?.data?.pendingOrders ?? 0,
    cancelledOrders: analytics?.data?.ordersByStatus?.cancelled ?? 0,
  };

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Alert
          message="Error"
          description="Failed to load performance data. Please try again later."
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
          description="No performance data available."
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <Row gutter={[16, 16]}>
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

PerformanceOverviewComponent.propTypes = {
  analytics: PropTypes.shape({
    data: PropTypes.shape({
      todayOrders: PropTypes.number,
      todayRevenue: PropTypes.number,
      pendingOrders: PropTypes.number,
      ordersByStatus: PropTypes.shape({
        delivered: PropTypes.number,
        cancelled: PropTypes.number,
      }),
    }),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
};