/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { FiEye, FiEdit, FiTrash2, FiFilter } from "react-icons/fi";

export function OrdersSection({ token }) {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    startDate: "",
    endDate: "",
  });

  const { data, loading, error } = useOrders(token, filters);

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
        <p className="text-red-600">Error loading orders: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-3 rounded-lg border overflow-x-auto">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1">
            <FiFilter className="text-gray-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Filter:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {["", "pending", "processing", "delivered", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    filters.status === status
                      ? "bg-[#ff6600] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status || "All"}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Orders Table/Cards */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h3 className="text-base font-semibold">Orders Management</h3>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden">
          <div className="divide-y">
            {data?.orders?.map((order) => (
              <div key={order.id} className="p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      #{order.id.slice(-8)}
                    </span>
                    <span
                      className={`ml-2 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    ₦{Number(order.totalAmount).toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium text-gray-700">
                      {order.user?.fullname || order.user?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business:</span>
                    <span className="font-medium text-gray-700">
                      {order.business?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-end space-x-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                    <FiEye className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-md">
                    <FiEdit className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.fullname || order.user?.email || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {order.business?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    ₦{Number(order.totalAmount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.metadata && (
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-700 w-full sm:w-auto text-center sm:text-left">
                Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                {Math.min(filters.page * filters.limit, data.metadata.total)} of{" "}
                {data.metadata.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={!data.metadata.hasPreviousPage}
                  className="px-3 py-1 border rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-xs">
                  Page {filters.page} of {data.metadata.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={!data.metadata.hasNextPage}
                  className="px-3 py-1 border rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
