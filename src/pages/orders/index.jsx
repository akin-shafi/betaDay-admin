import { useState, useEffect } from "react";
// import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import { orderService } from "@/services/orderService";
import { useSession } from "@/hooks/useSession";
import { OrdersListSkeleton } from "@/components/skeletons/OrdersListSkeleton";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { message, Table } from "antd";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { session } = useSession();
  const navigate = useNavigate();

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: params.current || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        status: filterStatus === "all" ? undefined : filterStatus,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        search: searchTerm,
      };

      const response = await orderService.getAllOrders(
        session?.token,
        queryParams
      );

      setOrders(response.data);
      setPagination({
        ...pagination,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: response.total, // Assuming the API returns total count
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchOrders();
    }
  }, [session?.token, filterStatus, dateRange, searchTerm]);

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchOrders({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleExport = async () => {
    try {
      const filters = {
        status: filterStatus === "all" ? undefined : filterStatus,
        search: searchTerm || undefined,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };
      const blob = await orderService.exportOrders(filters, session?.token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success("Orders exported successfully");
    } catch (error) {
      message.error("Failed to export orders");
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const columns = [
    {
      title: "Order ID",
      key: "orderNumber",
      render: (text, record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            #{record.orderNumber}
          </div>
          <div className="text-sm text-gray-500">
            {format(new Date(record.createdAt), "MMM d, yyyy")}
          </div>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (text, record) => (
        <div>
          <div className="text-sm text-gray-900">{record.customerName}</div>
          <div className="text-sm text-gray-500">{record.customerEmail}</div>
        </div>
      ),
    },
    {
      title: "Business",
      dataIndex: "businessName",
      key: "business",
      render: (text) => <div className="text-sm text-gray-900">{text}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <OrderStatusBadge status={status} />,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <div className="text-sm text-gray-900">₦{total.toLocaleString()}</div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="space-x-4">
          <button
            onClick={() => handleViewDetails(record.id)}
            className="text-[#ff6600] hover:text-[#ff8533] font-medium"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all orders in one place
          </p>
        </div>
      </div>

      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
        loading={loading}
      />

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}
