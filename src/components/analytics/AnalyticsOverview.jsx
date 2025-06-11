"use client";

import { useState } from "react";
import {
  Search,
  Download,
  ShoppingBag,
  DollarSign,
  Truck,
  Settings,
} from "lucide-react";
import PropTypes from "prop-types";

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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error Loading Data
            </h3>
            <p className="text-sm text-red-600 mt-1">
              Failed to load analytics data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton for metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        {/* Loading skeleton for table */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">i</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              No Data Available
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              No analytics data available for the selected period.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Process business data
  const businesses = data.totalRevenueByBusiness || [];
  const deliveryFees = data.totalDeliveryFeesByBusiness || [];
  const serviceFees = data.totalServiceFeesByBusiness || [];

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

  const filteredData = tableData.filter((item) =>
    item.businessName.toLowerCase().includes(searchText.toLowerCase())
  );

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
  };

  return (
    <div className="space-y-4">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Total Revenue
              </p>
              <p className="text-lg lg:text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(data.totalRevenue || 0)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Avg: {formatCurrency(data.averageOrderValue || 0)}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Total Orders
              </p>
              <p className="text-lg lg:text-xl font-bold text-gray-900 mt-1">
                {(data.totalOrders || 0).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {data.totalBusinesses || 0} businesses
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Delivery Fees
              </p>
              <p className="text-lg lg:text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(data.totalDeliveryFees?.total || 0)}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Avg: {formatCurrency(data.totalDeliveryFees?.average || 0)}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Service Fees
              </p>
              <p className="text-lg lg:text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(data.totalServiceFees?.total || 0)}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Avg: {formatCurrency(data.totalServiceFees?.average || 0)}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Business Performance Table */}
      {tableData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Table Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Business Performance
              </h3>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full sm:w-64"
                  />
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors print:hidden"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {filteredData.slice(0, 10).map((business) => (
                <div key={business.key} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {business.businessName}
                    </h4>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(business.totalEarnings || 0)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Revenue:</span>
                      <span className="ml-1 font-medium">
                        {formatCurrency(business.revenue || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Orders:</span>
                      <span className="ml-1 font-medium">
                        {(business.orders || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Delivery:</span>
                      <span className="ml-1 font-medium">
                        {formatCurrency(business.deliveryFees || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Service:</span>
                      <span className="ml-1 font-medium">
                        {formatCurrency(business.serviceFees || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, 10).map((business) => (
                  <tr key={business.key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {business.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(business.revenue || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(business.orders || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(business.revenueAverage || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(business.deliveryFees || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(business.serviceFees || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(business.totalEarnings || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-700">
              Showing {Math.min(10, filteredData.length)} of{" "}
              {filteredData.length} businesses
            </p>
          </div>
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
