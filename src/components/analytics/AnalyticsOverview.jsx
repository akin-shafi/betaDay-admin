import { Alert, Spin, Table, Input, Button, message } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";

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
      <Alert
        message="Error"
        description="Failed to load analytics data. Please try again later."
        type="error"
        showIcon
        className="max-w-2xl mx-auto"
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <Alert
        message="No Data"
        description="No analytics data available."
        type="info"
        showIcon
        className="max-w-2xl mx-auto"
      />
    );
  }

  // Merge data from totalRevenueByBusiness, totalDeliveryFeesByBusiness, and totalServiceFeesByBusiness
  const businesses = data.totalRevenueByBusiness || [];
  const deliveryFees = data.totalDeliveryFeesByBusiness || [];
  const serviceFees = data.totalServiceFeesByBusiness || [];

  // Create a unified data source
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

  // Add totalEarnings to tableData
  const tableData = Array.from(businessMap.values()).map((item, index) => ({
    ...item,
    key: item.businessId || index,
    totalEarnings:
      (item.revenue || 0) + (item.deliveryFees || 0) + (item.serviceFees || 0),
  }));

  // Filter table data based on search text
  const filteredData = tableData.filter((item) =>
    item.businessName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Define table columns
  const columns = [
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
      sorter: (a, b) => a.businessName.localeCompare(b.businessName),
    },
    {
      title: "Revenue (without Delivery & Service)",
      dataIndex: "revenue",
      key: "revenue",
      render: (text) => formatCurrency(text || 0),
      sorter: (a, b) => (a.revenue || 0) - (b.revenue || 0),
      defaultSortOrder: "descend",
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
      render: (text) => (text || 0).toLocaleString(),
      sorter: (a, b) => (a.orders || 0) - (b.orders || 0),
    },
    {
      title: "Avg. Order Value",
      dataIndex: "revenueAverage",
      key: "revenueAverage",
      render: (text) => formatCurrency(text || 0),
      sorter: (a, b) => (a.revenueAverage || 0) - (b.revenueAverage || 0),
    },
    {
      title: "Delivery Fees",
      dataIndex: "deliveryFees",
      key: "deliveryFees",
      render: (text) => formatCurrency(text || 0),
      sorter: (a, b) => (a.deliveryFees || 0) - (b.deliveryFees || 0),
      defaultSortOrder: "descend",
    },
    {
      title: "Service Fees",
      dataIndex: "serviceFees",
      key: "serviceFees",
      render: (text) => formatCurrency(text || 0),
      sorter: (a, b) => (a.serviceFees || 0) - (b.serviceFees || 0),
      defaultSortOrder: "descend",
    },
    {
      title: "Total Earnings",
      dataIndex: "totalEarnings",
      key: "totalEarnings",
      render: (text) => formatCurrency(text || 0),
      sorter: (a, b) => (a.totalEarnings || 0) - (b.totalEarnings || 0),
      defaultSortOrder: "descend",
    },
  ];

  // Export table data to CSV
  const exportToCSV = () => {
    const headers = [
      "Business Name",
      "Revenue",
      "Orders",
      "Avg. Order Value",
      "Delivery Fees",
      "Avg. Delivery Fee",
      "Service Fees",
      "Avg. Service Fee",
      "Total Earnings",
    ];
    const rows = tableData.map((item) => [
      `"${item.businessName}"`,
      formatCurrency(item.revenue || 0),
      item.orders || 0,
      formatCurrency(item.revenueAverage || 0),
      formatCurrency(item.deliveryFees || 0),
      formatCurrency(item.deliveryFeesAverage || 0),
      formatCurrency(item.serviceFees || 0),
      formatCurrency(item.serviceFeesAverage || 0),
      formatCurrency(item.totalEarnings || 0),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "business_performance_metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("CSV exported successfully");
  };

  return (
    <div className="space-y-8 p-4">
      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-blue-500 p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(data.totalRevenue || 0)}
          </p>
          <p className="text-xs mt-1 text-blue-600">
            Avg. Order: {formatCurrency(data.averageOrderValue || 0)}
          </p>
        </div>
        <div className="bg-white border-2 border-green-500 p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Total Orders
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {(data.totalOrders || 0).toLocaleString()}
          </p>
          <p className="text-xs mt-1 text-green-600">
            Across {data.totalBusinesses || 0} businesses
          </p>
        </div>
        <div className="bg-white border-2 border-purple-500 p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Total Delivery Fees
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(data.totalDeliveryFees?.total || 0)}
          </p>
          <p className="text-xs mt-1 text-purple-600">
            Avg. Fee: {formatCurrency(data.totalDeliveryFees?.average || 0)}
          </p>
        </div>
        <div className="bg-white border-2 border-yellow-500 p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Total Service Fees
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(data.totalServiceFees?.total || 0)}
          </p>
          <p className="text-xs mt-1 text-yellow-600">
            Avg. Fee: {formatCurrency(data.totalServiceFees?.average || 0)}
          </p>
        </div>
      </div>

      {/* Consolidated Business Metrics Table */}
      {tableData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Business Performance Metrics
            </h3>
            <div className="flex items-center space-x-4 non-printable">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search by business name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Button icon={<DownloadOutlined />} onClick={exportToCSV}>
                Export to CSV
              </Button>
            </div>
          </div>
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 5 }}
            className="analytics-table"
          />
        </div>
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
