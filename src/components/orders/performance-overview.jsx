/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Alert,
  Spin,
  Radio,
  DatePicker,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  WalletOutlined,
  CreditCardOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import moment from "moment";
import { debounce } from "lodash";

export function PerformanceOverviewComponent({
  analytics,
  loading,
  error,
  dateFilter,
  setDateFilter,
  customDateRange,
  setCustomDateRange,
}) {
  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "₦0.00";
    }
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const debouncedHandleCustomRangeChange = debounce((dates) => {
    setCustomDateRange(dates);
    setDateFilter("custom");
  }, 300);

  // Handle nested data structure
  const normalizedAnalytics = {
    todayOrders: analytics?.data?.todayOrders ?? 0,
    todayRevenue: analytics?.data?.todayRevenue ?? 0,
    completedOrders: analytics?.data?.ordersByStatus?.delivered ?? 0,
    pendingOrders: analytics?.data?.ordersByStatus?.pending ?? 0,
    cancelledOrders: analytics?.data?.ordersByStatus?.cancelled ?? 0,
    ordersByPaymentMethod: analytics?.data?.ordersByPaymentMethod ?? {
      wallet: 0,
      cash: 0,
      paystack_card: 0,
      paystack_bank: 0,
      paystack_ussd: 0,
      opay_card: 0,
      opay_bank: 0,
      opay_wallet: 0,
      opay_ussd: 0,
    },
    ordersByPaymentStatus: analytics?.data?.ordersByPaymentStatus ?? {
      pending: 0,
      processing: 0,
      paid: 0,
      failed: 0,
      cancelled: 0,
      refunded: 0,
    },
    topBusinesses: analytics?.data?.topBusinesses ?? [],
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    if (e.target.value !== "custom") {
      setCustomDateRange(null);
    }
  };

  const handleCustomRangeChange = (dates) => {
    setCustomDateRange(dates);
    setDateFilter("custom");
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
      <div style={{ marginBottom: "16px" }}>
        <Radio.Group
          value={dateFilter}
          onChange={handleDateFilterChange}
          style={{ marginRight: "16px" }}
        >
          <Radio.Button value="today">Today</Radio.Button>
          <Radio.Button value="last7Days">Last 7 Days</Radio.Button>
          <Radio.Button value="last3Months">Last 3 Months</Radio.Button>
          <Radio.Button value="custom">Custom Range</Radio.Button>
        </Radio.Group>
        {dateFilter === "custom" && (
          <DatePicker.RangePicker
            value={customDateRange}
            onChange={debouncedHandleCustomRangeChange}
            format="YYYY-MM-DD"
            style={{ width: "300px" }}
          />
        )}
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              dateFilter === "today"
                ? "Today's Performance"
                : dateFilter === "last7Days"
                ? "Last 7 Days Performance"
                : dateFilter === "last3Months"
                ? "Last 3 Months Performance"
                : "Custom Range Performance"
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Orders"
                  value={normalizedAnalytics.todayOrders}
                  valueStyle={{ fontSize: "24px" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Revenue"
                  value={normalizedAnalytics.todayRevenue}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ fontSize: "24px" }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: "24px" }}>
              <h3>
                {dateFilter === "today"
                  ? "Today"
                  : dateFilter === "last7Days"
                  ? "Last 7 Days"
                  : dateFilter === "last3Months"
                  ? "Last 3 Months"
                  : "Custom Range"}
                :
              </h3>
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
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Order Status Overview">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Payment Methods"
                  value={`${normalizedAnalytics.ordersByPaymentMethod.wallet} Wallet, ${normalizedAnalytics.ordersByPaymentMethod.paystack} Paystack, ${normalizedAnalytics.ordersByPaymentMethod.opay} Opay, ${normalizedAnalytics.ordersByPaymentMethod.cash} Cash`}
                  prefix={<WalletOutlined />}
                  valueStyle={{ fontSize: "14px" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Payment Status"
                  value={`${normalizedAnalytics.ordersByPaymentStatus.paid} Paid, ${normalizedAnalytics.ordersByPaymentStatus.pending} Pending, ${normalizedAnalytics.ordersByPaymentStatus.failed} Failed, ${normalizedAnalytics.ordersByPaymentStatus.refunded} Refunded`}
                  prefix={<CreditCardOutlined />}
                  valueStyle={{ fontSize: "14px" }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: "24px" }}>
              <h3>Top Businesses:</h3>
              {normalizedAnalytics.topBusinesses.length > 0 ? (
                normalizedAnalytics.topBusinesses.map((business) => (
                  <div
                    key={business.businessId}
                    style={{ marginBottom: "8px" }}
                  >
                    <Row>
                      <Col span={12}>
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                          <ShopOutlined /> {business.businessName}
                        </div>
                      </Col>
                      <Col span={6}>
                        <div style={{ fontSize: "14px" }}>
                          {business.orderCount} Orders
                        </div>
                      </Col>
                      <Col span={6}>
                        <div style={{ fontSize: "14px" }}>
                          {formatCurrency(business.revenue)}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "14px", color: "#666" }}>
                  No top businesses available
                </div>
              )}
            </div>
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
        pending: PropTypes.number,
        cancelled: PropTypes.number,
      }),
      ordersByPaymentMethod: PropTypes.shape({
        wallet: PropTypes.number,
        paystack: PropTypes.number,
        opay: PropTypes.number,
        cash: PropTypes.number,
      }),
      ordersByPaymentStatus: PropTypes.shape({
        pending: PropTypes.number,
        paid: PropTypes.number,
        failed: PropTypes.number,
        refunded: PropTypes.number,
      }),
      topBusinesses: PropTypes.arrayOf(
        PropTypes.shape({
          businessId: PropTypes.string,
          businessName: PropTypes.string,
          orderCount: PropTypes.number,
          revenue: PropTypes.number,
        })
      ),
    }),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
  dateFilter: PropTypes.string,
  setDateFilter: PropTypes.func,
  customDateRange: PropTypes.array,
  setCustomDateRange: PropTypes.func,
};
