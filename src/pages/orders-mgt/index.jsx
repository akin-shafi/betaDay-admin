/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { PerformanceOverviewComponent } from "@/components/orders/performance-overview";
import { OrderFiltersComponent } from "@/components/orders/order-filters";
import { OrderTable } from "@/components/orders/order-table";
import { useSession } from "@/hooks/useSession";
import ErrorBoundary from "@/components/ErrorBoundary";
import moment from "moment";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function OrderManagement() {
  const { session } = useSession();
  const token = session?.token;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    paymentMethod: "all",
    paymentStatus: "all",
    dateRange: null,
  });
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("last7Days");
  const [customDateRange, setCustomDateRange] = useState(null);

  // Normalize order data to match OrderTable expectations
  const normalizeOrder = (order) => {
    if (!order) {
      console.error("normalizeOrder received invalid order:", order);
      return {};
    }
    return {
      id: order.id || "",
      customerName: order.user?.fullName || "N/A",
      customerEmail: order.user?.email || "N/A",
      customerPhone: order.user?.phoneNumber || "N/A",
      items: order.orderItems || [],
      finalAmount: parseFloat(order.totalAmount) || 0,
      paymentMethod: order.paymentMethod || "N/A",
      paymentStatus: order.paymentStatus || "N/A",
      orderStatus: order.status || "N/A",
      createdAt: order.createdAt || "",
      deliveryAddress: order.deliveryAddress || {},
      deliveryInstructions: order.deliveryInstructions || "",
      estimatedDeliveryTime: order.estimatedDeliveryTime || "",
      totalAmount: parseFloat(order.totalAmount) || 0,
      deliveryFee: parseFloat(order.deliveryFee) || 0,
      serviceFee: parseFloat(order.serviceFee) || 0,
    };
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.paymentStatus !== "all")
        params.append("paymentStatus", filters.paymentStatus);
      if (filters.paymentMethod !== "all")
        params.append("paymentMethod", filters.paymentMethod);
      if (filters.search) params.append("search", filters.search);

      // Add date filter parameters based on dateFilter and customDateRange
      let startDate, endDate;
      if (dateFilter === "today") {
        startDate = moment().startOf("day").toISOString();
        endDate = moment().endOf("day").toISOString();
      } else if (dateFilter === "last7Days") {
        startDate = moment().subtract(7, "days").startOf("day").toISOString();
        endDate = moment().endOf("day").toISOString();
      } else if (dateFilter === "last3Months") {
        startDate = moment().subtract(3, "months").startOf("day").toISOString();
        endDate = moment().endOf("day").toISOString();
      } else if (dateFilter === "custom" && customDateRange) {
        startDate = moment(customDateRange[0]).startOf("day").toISOString();
        endDate = moment(customDateRange[1]).endOf("day").toISOString();
      }

      if (startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      const response = await fetch(`${API_BASE_URL}/api/orders?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const { data } = await response.json();
      const normalizedOrders = (data.orders || []).map(normalizeOrder);
      setOrders(normalizedOrders);
      setFilteredOrders(normalizedOrders);
      message.success("Orders loaded successfully");
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
      message.error("Failed to load orders");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics from API
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const params = new URLSearchParams();
      let startDate, endDate;

      if (dateFilter === "today") {
        startDate = moment().startOf("day").toISOString();
        endDate = moment().endOf("day").toISOString();
      } else if (dateFilter === "last7Days") {
        startDate = moment().subtract(7, "days").startOf("day").toISOString();
        endDate = moment().endOf("day").toISOString();
      } else if (dateFilter === "last3Months") {
        startDate = moment().subtract(3, "months").startOf("day").toISOString();
        endDate = moment().endOf("day").toISOString();
      } else if (dateFilter === "custom" && customDateRange) {
        startDate = moment(customDateRange[0]).startOf("day").toISOString();
        endDate = moment(customDateRange[1]).endOf("day").toISOString();
      }

      if (startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/orders/analytics?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      message.error("Failed to load analytics");
      setAnalytics({
        data: { totalOrders: 0, totalRevenue: 0, pendingOrders: 0 },
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, []);

  // Refetch orders and analytics when filters, dateFilter, or customDateRange change
  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, [filters, dateFilter, customDateRange]);

  const handleUpdateStatus = async (orderId, status, notes) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, notes }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order status");
      }

      await fetchOrders();
      message.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error(error.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setFilteredOrders((prev) => prev.filter((order) => order.id !== orderId));
      message.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error("Failed to delete order");
    }
  };

  const handleRefundOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: "Admin initiated refund",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process refund");
      }

      const refundResult = await response.json();
      const updatedOrder = normalizeOrder({
        ...orders.find((order) => order.id === orderId),
        paymentStatus: "refunded",
      });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      setFilteredOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      message.success("Refund processed successfully");
    } catch (error) {
      console.error("Error processing refund:", error);
      message.error("Failed to process refund");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (orderIds, action) => {
    setLoading(true);
    try {
      const mappedAction = action === "confirm" ? "updateStatus" : action;
      const status = action === "confirm" ? "accepted" : action;
      const response = await fetch(`${API_BASE_URL}/api/orders/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderIds,
          action: mappedAction,
          data: mappedAction === "updateStatus" ? { status } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to perform bulk action");
      }

      const result = await response.json();
      if (mappedAction === "updateStatus" || action === "cancel") {
        setOrders((prev) =>
          prev.map((order) =>
            orderIds.includes(order.id)
              ? { ...order, orderStatus: status }
              : order
          )
        );
        setFilteredOrders((prev) =>
          prev.map((order) =>
            orderIds.includes(order.id)
              ? { ...order, orderStatus: status }
              : order
          )
        );
        message.success(`${orderIds.length} orders ${action}ed`);
      } else if (action === "export") {
        handleExport(orderIds);
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      message.error("Failed to perform bulk action");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (orderIds = null) => {
    const ordersToExport = orderIds
      ? filteredOrders.filter((order) => orderIds.includes(order.id))
      : filteredOrders;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Order ID,Customer,Email,Phone,Amount,Payment Method,Payment Status,Order Status,Date\n" +
      ordersToExport
        .map(
          (order) =>
            `${order.id},${order.customerName},${order.customerEmail},${order.customerPhone},${order.finalAmount},${order.paymentMethod},${order.paymentStatus},${order.orderStatus},${order.createdAt}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `orders_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success("Orders exported successfully");
  };

  const handleRefresh = async () => {
    await Promise.all([fetchOrders(), fetchAnalytics()]);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0" }}>
          Order Management
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0" }}>
          Manage and track all customer orders from one place
        </p>
      </div>

      <PerformanceOverviewComponent
        analytics={analytics}
        loading={analyticsLoading}
        error={error}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange} // Added missing prop
      />

      <OrderFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onExport={() => handleExport()}
        onRefresh={handleRefresh}
        totalOrders={orders.length}
        filteredOrders={filteredOrders.length}
      />
      <ErrorBoundary>
        <OrderTable
          orders={filteredOrders}
          onUpdateStatus={handleUpdateStatus}
          onDeleteOrder={handleDeleteOrder}
          onRefundOrder={handleRefundOrder}
          onBulkAction={handleBulkAction}
          loading={loading}
          dateFilter={dateFilter}
          customDateRange={customDateRange}
        />
      </ErrorBoundary>
    </div>
  );
}
