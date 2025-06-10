"use client";

import {
  Alert,
  Spin,
  Table,
  Input,
  Button,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TruckOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";

const { Title, Text } = Typography;

export function AnalyticsOverview({ data, loading, error }) {
  const [searchText, setSearchText] = useState("");

  // Format currency for NGN
  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "₦0.00";
    }
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (error) {
    return (
      <Card>
        <Alert
          message="Error Loading Data"
          description="Failed to load analytics data. Please try again later."
          type="error"
          showIcon
        />
      </Card>
    );
  }

  if (loading) {
    return (
      <Card style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px" }}>
          <Text>Loading analytics data...</Text>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <Alert
          message="No Data Available"
          description="No analytics data available for the selected period."
          type="info"
          showIcon
        />
      </Card>
    );
  }

  // Merge data from different sources
  const businesses = data.totalRevenueByBusiness || [];
  const deliveryFees = data.totalDeliveryFeesByBusiness || [];
  const serviceFees = data.totalServiceFeesByBusiness || [];

  // Create unified data source
  const businessMap = new Map();
  businesses.forEach((item) => {
    businessMap.set(item.businessId, {
      businessId: item.businessId,
      businessName: item.businessName,
      revenue: item.total,
      orders: item.count,
      revenueAverage: item.average,
    });
  });

  deliveryFees.forEach((item) => {
    const existing = businessMap.get(item.businessId) || {
      businessId: item.businessId,
      businessName: item.businessName,
    };
    businessMap.set(item.businessId, {
      ...existing,
      deliveryFees: item.total,
      deliveryFeesAverage: item.average,
    });
  });

  serviceFees.forEach((item) => {
    const existing = businessMap.get(item.businessId) || {
      businessId: item.businessId,
      businessName: item.businessName,
    };
    businessMap.set(item.businessId, {
      ...existing,
      serviceFees: item.total,
      serviceFeesAverage: item.average,
    });
  });

  const tableData = Array.from(businessMap.values()).map((item, index) => ({
    ...item,
    key: item.businessId || index,
    totalEarnings:
      (item.revenue || 0) + (item.deliveryFees || 0) + (item.serviceFees || 0),
  }));

  // Filter table data
  const filteredData = tableData.filter((item) =>
    item.businessName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Mobile-optimized table columns
  const columns = [
    {
      title: "Business",
      dataIndex: "businessName",
      key: "businessName",
      sorter: (a, b) => a.businessName.localeCompare(b.businessName),
      width: 150,
      fixed: "left",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (text) => (
        <div>
          <div style={{ fontWeight: "bold" }}>{formatCurrency(text || 0)}</div>
        </div>
      ),
      sorter: (a, b) => (a.revenue || 0) - (b.revenue || 0),
      width: 120,
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
      render: (text) => (text || 0).toLocaleString(),
      sorter: (a, b) => (a.orders || 0) - (b.orders || 0),
      width: 80,
    },
    {
      title: "Avg Order",
      dataIndex: "revenueAverage",
      key: "revenueAverage",
      render: (text) => formatCurrency(text || 0),
      sorter: (a, b) => (a.revenueAverage || 0) - (b.revenueAverage || 0),
      width: 100,
    },
    {
      title: "Delivery",
      dataIndex: "deliveryFees",
      key: "deliveryFees",
      render: (text) => formatCurrency(text || 0),
      sorter: (a, b) => (a.deliveryFees || 0) - (b.deliveryFees || 0),
      width: 100,
    },
    {
      title: "Service",
      dataIndex: "serviceFees",
      key: "serviceFees",
      render: (text) => formatCurrency(text || 0),
      sorter: (a, b) => (a.serviceFees || 0) - (b.serviceFees || 0),
      width: 100,
    },
    {
      title: "Total",
      dataIndex: "totalEarnings",
      key: "totalEarnings",
      render: (text) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(text || 0)}
        </Text>
      ),
      sorter: (a, b) => (a.totalEarnings || 0) - (b.totalEarnings || 0),
      width: 120,
      fixed: "right",
    },
  ];

  // Export to CSV function
  const exportToCSV = () => {
    const headers = [
      "Business Name",
      "Revenue",
      "Orders",
      "Avg. Order Value",
      "Delivery Fees",
      "Service Fees",
      "Total Earnings",
    ];
    const rows = tableData.map((item) => [
      `"${item.businessName}"`,
      item.revenue || 0,
      item.orders || 0,
      item.revenueAverage || 0,
      item.deliveryFees || 0,
      item.serviceFees || 0,
      item.totalEarnings || 0,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "business_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("CSV exported successfully");
  };

  return (
    <div style={{ padding: "0" }}>
      {/* Key Metrics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={data.totalRevenue || 0}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ fontSize: "18px", fontWeight: "bold" }}
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Avg: {formatCurrency(data.averageOrderValue || 0)}
            </Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={data.totalOrders || 0}
              prefix={<ShoppingOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ fontSize: "18px", fontWeight: "bold" }}
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {data.totalBusinesses || 0} businesses
            </Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Delivery Fees"
              value={data.totalDeliveryFees?.total || 0}
              formatter={(value) => formatCurrency(value)}
              prefix={<TruckOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ fontSize: "18px", fontWeight: "bold" }}
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Avg: {formatCurrency(data.totalDeliveryFees?.average || 0)}
            </Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Service Fees"
              value={data.totalServiceFees?.total || 0}
              formatter={(value) => formatCurrency(value)}
              prefix={<ToolOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ fontSize: "18px", fontWeight: "bold" }}
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Avg: {formatCurrency(data.totalServiceFees?.average || 0)}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Business Performance Table */}
      {tableData.length > 0 && (
        <Card>
          <Row
            justify="space-between"
            align="middle"
            gutter={[16, 16]}
            style={{ marginBottom: "16px" }}
          >
            <Col xs={24} sm={12}>
              <Title level={4} style={{ margin: 0 }}>
                Business Performance
              </Title>
            </Col>
            <Col xs={24} sm={12}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search businesses..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  size="large"
                />
                <Button
                  icon={<DownloadOutlined />}
                  onClick={exportToCSV}
                  type="primary"
                  size="large"
                  style={{ width: "100%" }}
                  className="non-printable"
                >
                  Export CSV
                </Button>
              </Space>
            </Col>
          </Row>

          <div style={{ overflowX: "auto" }}>
            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} businesses`,
                responsive: true,
              }}
              scroll={{ x: 800 }}
              size="small"
              className="mobile-table"
            />
          </div>
        </Card>
      )}
    </div>
  );
}

AnalyticsOverview.propTypes = {
  data: PropTypes.shape({
    totalDeliveryFees: PropTypes.shape({
      total: PropTypes.number,
      count: PropTypes.number,
      average: PropTypes.number,
    }),
    totalServiceFees: PropTypes.shape({
      total: PropTypes.number,
      count: PropTypes.number,
      average: PropTypes.number,
    }),
    totalRevenue: PropTypes.number,
    totalOrders: PropTypes.number,
    totalBusinesses: PropTypes.number,
    averageOrderValue: PropTypes.number,
    totalRevenueByBusiness: PropTypes.arrayOf(
      PropTypes.shape({
        businessId: PropTypes.string,
        businessName: PropTypes.string,
        total: PropTypes.number,
        count: PropTypes.number,
        average: PropTypes.number,
      })
    ),
    totalDeliveryFeesByBusiness: PropTypes.arrayOf(
      PropTypes.shape({
        businessId: PropTypes.string,
        businessName: PropTypes.string,
        total: PropTypes.number,
        count: PropTypes.number,
        average: PropTypes.number,
      })
    ),
    totalServiceFeesByBusiness: PropTypes.arrayOf(
      PropTypes.shape({
        businessId: PropTypes.string,
        businessName: PropTypes.string,
        total: PropTypes.number,
        count: PropTypes.number,
        average: PropTypes.number,
      })
    ),
  }),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
