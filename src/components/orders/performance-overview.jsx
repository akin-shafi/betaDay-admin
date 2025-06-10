/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
"use client";

import {
  Statistic,
  Alert,
  Spin,
  Radio,
  DatePicker,
  Typography,
  Space,
  Tabs,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  WalletOutlined,
  ShopOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { debounce } from "lodash";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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
      <Alert
        message="Error"
        description="Failed to load performance data. Please try again later."
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8 mb-4">
        <Spin size="large" />
        <div className="mt-4">
          <Text>Loading analytics data...</Text>
        </div>
      </div>
    );
  }

  // Mobile date filter tabs
  const renderMobileDateFilter = () => (
    <div className="lg:hidden mb-4">
      <Tabs
        activeKey={dateFilter}
        onChange={(key) => setDateFilter(key)}
        size="small"
        centered
        items={[
          { key: "today", label: "Today" },
          { key: "last7Days", label: "7 Days" },
          { key: "last3Months", label: "3 Months" },
          { key: "custom", label: "Custom" },
        ]}
      />

      {dateFilter === "custom" && (
        <div className="mt-3 px-2">
          <RangePicker
            value={customDateRange}
            onChange={debouncedHandleCustomRangeChange}
            format="YYYY-MM-DD"
            className="w-full"
            size="middle"
          />
        </div>
      )}
    </div>
  );

  // Desktop date filter
  const renderDesktopDateFilter = () => (
    <div className="hidden lg:block mb-4">
      <div className="flex items-center justify-between">
        <Space align="center">
          <CalendarOutlined />
          <Text strong>Date Range:</Text>
          <Radio.Group
            value={dateFilter}
            onChange={handleDateFilterChange}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="today">Today</Radio.Button>
            <Radio.Button value="last7Days">Last 7 Days</Radio.Button>
            <Radio.Button value="last3Months">Last 3 Months</Radio.Button>
            <Radio.Button value="custom">Custom Range</Radio.Button>
          </Radio.Group>
        </Space>
        {dateFilter === "custom" && (
          <RangePicker
            value={customDateRange}
            onChange={debouncedHandleCustomRangeChange}
            format="YYYY-MM-DD"
            className="w-80"
          />
        )}
      </div>
    </div>
  );

  if (!analytics?.data) {
    return (
      <>
        {renderMobileDateFilter()}
        {renderDesktopDateFilter()}
        <Alert
          message="No Data"
          description="No performance data available."
          type="info"
          showIcon
          className="mb-4"
        />
      </>
    );
  }

  return (
    <>
      {renderMobileDateFilter()}
      {renderDesktopDateFilter()}

      {/* Key Metrics Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <div className="col-span-1 lg:col-span-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <Statistic
            title={
              <Text className="text-xs font-medium text-gray-600">Orders</Text>
            }
            value={normalizedAnalytics.todayOrders}
            valueStyle={{
              color: "#1890ff",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            prefix={<ShopOutlined />}
          />
        </div>

        <div className="col-span-1 lg:col-span-1 bg-green-50 p-3 rounded-lg border border-green-200">
          <Statistic
            title={
              <Text className="text-xs font-medium text-gray-600">Revenue</Text>
            }
            value={normalizedAnalytics.todayRevenue}
            formatter={(value) => formatCurrency(value)}
            valueStyle={{
              color: "#52c41a",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            prefix={<WalletOutlined />}
          />
        </div>

        <div className="col-span-1 bg-green-50 p-3 rounded-lg border border-green-200">
          <Statistic
            title={
              <Text className="text-xs font-medium text-gray-600">
                Completed
              </Text>
            }
            value={normalizedAnalytics.completedOrders}
            valueStyle={{
              color: "#52c41a",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            prefix={<CheckCircleOutlined />}
          />
        </div>

        <div className="col-span-1 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <Statistic
            title={
              <Text className="text-xs font-medium text-gray-600">Pending</Text>
            }
            value={normalizedAnalytics.pendingOrders}
            valueStyle={{
              color: "#faad14",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            prefix={<ClockCircleOutlined />}
          />
        </div>

        <div className="col-span-2 lg:col-span-1 bg-red-50 p-3 rounded-lg border border-red-200">
          <Statistic
            title={
              <Text className="text-xs font-medium text-gray-600">
                Cancelled
              </Text>
            }
            value={normalizedAnalytics.cancelledOrders}
            valueStyle={{
              color: "#ff4d4f",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            prefix={<CloseCircleOutlined />}
          />
        </div>
      </div>

      {/* Payment Methods & Top Businesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text strong className="block mb-3">
            Payment Methods
          </Text>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Statistic
                title="Wallet"
                value={normalizedAnalytics.ordersByPaymentMethod.wallet || 0}
                valueStyle={{ fontSize: "14px" }}
              />
            </div>
            <div>
              <Statistic
                title="Cash"
                value={normalizedAnalytics.ordersByPaymentMethod.cash || 0}
                valueStyle={{ fontSize: "14px" }}
              />
            </div>
            <div>
              <Statistic
                title="Paystack"
                value={
                  (normalizedAnalytics.ordersByPaymentMethod.paystack_card ||
                    0) +
                  (normalizedAnalytics.ordersByPaymentMethod.paystack_bank ||
                    0) +
                  (normalizedAnalytics.ordersByPaymentMethod.paystack_ussd || 0)
                }
                valueStyle={{ fontSize: "14px" }}
              />
            </div>
            <div>
              <Statistic
                title="Opay"
                value={
                  (normalizedAnalytics.ordersByPaymentMethod.opay_card || 0) +
                  (normalizedAnalytics.ordersByPaymentMethod.opay_bank || 0) +
                  (normalizedAnalytics.ordersByPaymentMethod.opay_wallet || 0) +
                  (normalizedAnalytics.ordersByPaymentMethod.opay_ussd || 0)
                }
                valueStyle={{ fontSize: "14px" }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <Text strong className="block mb-3">
            Top Businesses
          </Text>
          {normalizedAnalytics.topBusinesses.length > 0 ? (
            <div className="space-y-2">
              {normalizedAnalytics.topBusinesses
                .slice(0, 3)
                .map((business, index) => (
                  <div
                    key={business.businessId || index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <ShopOutlined />
                      <Text className="text-sm truncate max-w-32">
                        {business.businessName}
                      </Text>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {business.orderCount} orders
                      </div>
                      <Text strong className="text-sm">
                        {formatCurrency(business.revenue)}
                      </Text>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <Text type="secondary">No top businesses available</Text>
          )}
        </div>
      </div>
    </>
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
