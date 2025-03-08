/* eslint-disable react-refresh/only-export-components */

const API_URL = import.meta.env.VITE_API_BASE_URL;
export const orderService = {
  getAllOrders: async (token, params = {}) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.status) queryParams.append("status", params.status);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.search) queryParams.append("search", params.search);

      const queryString = queryParams.toString();
      const url = `${API_URL}/orders${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch orders");
      }

      const data = await response.json();
      return {
        data: data.orders,
        total: data.total,
        page: data.page,
        limit: data.limit,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch orders");
    }
  },

  getOrderById: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch order details");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to fetch order details");
    }
  },

  updateOrderStatus: async (id, status, token) => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update order status");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to update order status");
    }
  },

  exportOrders: async (filters, token) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.search) queryParams.append("search", filters.search);

      const queryString = queryParams.toString();
      const url = `${API_URL}/orders/export${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to export orders");
      }

      return await response.blob();
    } catch (error) {
      throw new Error(error.message || "Failed to export orders");
    }
  },
};

const OrderService = () => {
  return <div></div>;
};

export default OrderService;
