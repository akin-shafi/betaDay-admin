/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiDownload, FiEye } from "react-icons/fi";

export function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    paymentStatus: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const mockOrders = [
        {
          id: "ord_001",
          userId: "user_001",
          businessId: "bus_001",
          status: "delivered",
          subtotal: 2500,
          deliveryFee: 500,
          serviceFee: 200,
          discount: 0,
          totalAmount: 3200,
          paymentMethod: "paystack_card",
          paymentStatus: "paid",
          isPaid: true,
          currency: "NGN",
          deliveryCity: "Lagos",
          deliveryState: "Lagos",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T12:45:00Z",
          user: {
            id: "user_001",
            email: "john.doe@email.com",
            firstName: "John",
            lastName: "Doe",
            phone: "+234801234567",
          },
          business: {
            id: "bus_001",
            name: "Mama's Kitchen",
            email: "mama@kitchen.com",
            phone: "+234807654321",
          },
          orderItems: [
            {
              id: "item_001",
              itemId: "prod_001",
              name: "Jollof Rice & Chicken",
              price: 2000,
              quantity: 1,
              totalPrice: 2000,
            },
            {
              id: "item_002",
              itemId: "prod_002",
              name: "Soft Drink",
              price: 500,
              quantity: 1,
              totalPrice: 500,
            },
          ],
        },
        {
          id: "ord_002",
          userId: "user_002",
          businessId: "bus_002",
          status: "preparing",
          subtotal: 1800,
          deliveryFee: 400,
          serviceFee: 150,
          discount: 200,
          totalAmount: 2150,
          paymentMethod: "wallet",
          paymentStatus: "paid",
          isPaid: true,
          currency: "NGN",
          deliveryCity: "Abuja",
          deliveryState: "FCT",
          createdAt: "2024-01-15T14:20:00Z",
          updatedAt: "2024-01-15T14:25:00Z",
          user: {
            id: "user_002",
            email: "jane.smith@email.com",
            firstName: "Jane",
            lastName: "Smith",
            phone: "+234802345678",
          },
          business: {
            id: "bus_002",
            name: "Quick Bites",
            email: "info@quickbites.com",
            phone: "+234808765432",
          },
        },
        {
          id: "ord_003",
          userId: "user_003",
          businessId: "bus_003",
          status: "pending",
          subtotal: 3500,
          deliveryFee: 600,
          serviceFee: 300,
          discount: 0,
          totalAmount: 4400,
          paymentMethod: "cash",
          paymentStatus: "pending",
          isPaid: false,
          currency: "NGN",
          deliveryCity: "Port Harcourt",
          deliveryState: "Rivers",
          createdAt: "2024-01-15T16:10:00Z",
          updatedAt: "2024-01-15T16:10:00Z",
          user: {
            id: "user_003",
            email: "mike.johnson@email.com",
            firstName: "Mike",
            lastName: "Johnson",
            phone: "+234803456789",
          },
          business: {
            id: "bus_003",
            name: "Fresh Groceries",
            email: "fresh@groceries.com",
            phone: "+234809876543",
          },
        },
      ];

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrders(mockOrders);
      setPagination({
        total: 150,
        page: 1,
        limit: 10,
        totalPages: 15,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      preparing: "bg-orange-100 text-orange-800",
      ready_for_pickup: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.business?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPaymentStatus =
      !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6600]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Orders</span>
              <span className="font-semibold">2,459</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-blue-600">128</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">2,274</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">Revenue Today</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold">₦847,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery Fees</span>
              <span className="font-semibold">₦45,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service Fees</span>
              <span className="font-semibold">₦28,400</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Net Revenue</span>
              <span className="font-semibold text-[#ff6600]">₦773,900</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid Orders</span>
              <span className="font-semibold text-green-600">2,156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Payment</span>
              <span className="font-semibold text-yellow-600">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Failed Payment</span>
              <span className="font-semibold text-red-600">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Refunded</span>
              <span className="font-semibold text-gray-600">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">Top Locations</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lagos</span>
              <span className="font-semibold">1,245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Abuja</span>
              <span className="font-semibold">567</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Port Harcourt</span>
              <span className="font-semibold">234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Kano</span>
              <span className="font-semibold">189</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold">Orders Management</h3>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#ff6600] hover:bg-[#ff8533] text-white rounded-lg flex items-center gap-2">
              <FiDownload className="text-sm" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-[#ff6600]"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-[#ff6600]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready_for_pickup">Ready for Pickup</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) =>
              setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-[#ff6600]"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value, page: 1 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-[#ff6600]"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value, page: 1 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-[#ff6600]"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.user?.firstName} {order.user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.business?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.deliveryCity}, {order.deliveryState}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₦{order.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Items: ₦{order.subtotal.toLocaleString()} | Delivery: ₦
                      {order.deliveryFee.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-[#ff6600] hover:text-[#ff8533] p-1"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, e.target.value)
                        }
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-[#ff6600] focus:border-[#ff6600]"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="accepted">Accepted</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready_for_pickup">
                          Ready for Pickup
                        </option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setFilters({ ...filters, page: filters.page - 1 })
                }
                disabled={!pagination.hasPreviousPage}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setFilters({ ...filters, page: filters.page + 1 })
                }
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Order ID
                  </label>
                  <p className="text-sm text-gray-900">
                    #{selectedOrder.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Payment Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {selectedOrder.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Customer Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedOrder.user?.firstName}{" "}
                    {selectedOrder.user?.lastName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.user?.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.user?.phone}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Business Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedOrder.business?.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.business?.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.business?.phone}
                  </p>
                </div>
              </div>

              {selectedOrder.orderItems &&
                selectedOrder.orderItems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Order Items
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ₦
                              {item.price.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            ₦{item.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Order Summary
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₦{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee:</span>
                    <span>₦{selectedOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee:</span>
                    <span>₦{selectedOrder.serviceFee.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>-₦{selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₦{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Delivery Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">City:</span>{" "}
                    {selectedOrder.deliveryCity}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">State:</span>{" "}
                    {selectedOrder.deliveryState}
                  </p>
                  {selectedOrder.customerInstructions && (
                    <p className="text-sm">
                      <span className="font-medium">Instructions:</span>{" "}
                      {selectedOrder.customerInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
