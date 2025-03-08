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
      // console.log("Raw API Response:", data.data); // For debugging

      // Map the nested response to a flat structure
      return {
        data: data.data.orders || [], // Orders array, default to empty if missing
        total: data.data.metadata.total || 0, // Total number of orders
        page: data.data.metadata.page || 1, // Current page
        limit: data.data.metadata.limit || 10, // Items per page
        totalPages: data.data.metadata.totalPages || 1, // Total pages for pagination
        hasNextPage: data.data.metadata.hasNextPage || false, // For pagination controls
        hasPreviousPage: data.data.metadata.hasPreviousPage || false, // For pagination controls
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
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

      const data = await response.json();

      // Return the data in the expected structure
      return {
        statusCode: data.statusCode || 200,
        message: data.message || "Order retrieved successfully",
        order: {
          id: data.order.id,
          businessId: data.order.businessId,
          items: data.order.items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            specialInstructions: item.specialInstructions,
          })),
          subtotal: data.order.subtotal,
          deliveryFee: data.order.deliveryFee,
          serviceFee: data.order.serviceFee,
          totalAmount: data.order.totalAmount,
          status: data.order.status,
          deliveryAddress: {
            city: data.order.deliveryAddress.city,
            state: data.order.deliveryAddress.state,
            street: data.order.deliveryAddress.street,
          },
          paymentDetails: {
            method: data.order.paymentDetails.method,
            status: data.order.paymentDetails.status,
            paymentDate: data.order.paymentDetails.paymentDate,
            transactionId: data.order.paymentDetails.transactionId,
          },
          timeline: {
            ordered: data.order.timeline.ordered,
            delivered: data.order.timeline.delivered,
          },
          rating: data.order.rating,
          feedback: data.order.feedback,
          isRefunded: data.order.isRefunded,
          createdAt: data.order.createdAt,
          updatedAt: data.order.updatedAt,
          user: {
            id: data.order.user.id,
            fullName: data.order.user.fullName,
            email: data.order.user.email,
            phoneNumber: data.order.user.phoneNumber,
            role: data.order.user.role,
            profileImage: data.order.user.profileImage,
            address: data.order.user.address,
            city: data.order.user.city,
            state: data.order.user.state,
            isVerified: data.order.user.isVerified,
            isActive: data.order.user.isActive,
            createdAt: data.order.user.createdAt,
            updatedAt: data.order.user.updatedAt,
          },
          business: {
            id: data.order.business.id,
            name: data.order.business.name,
            description: data.order.business.description,
            address: data.order.business.address,
            city: data.order.business.city,
            state: data.order.business.state,
            location: data.order.business.location,
            image: data.order.business.image,
            openingTime: data.order.business.openingTime,
            closingTime: data.order.business.closingTime,
            deliveryOptions: data.order.business.deliveryOptions,
            contactNumber: data.order.business.contactNumber,
            website: data.order.business.website,
            priceRange: data.order.business.priceRange,
            deliveryTimeRange: data.order.business.deliveryTimeRange,
            rating: data.order.business.rating,
            totalRatings: data.order.business.totalRatings,
            isActive: data.order.business.isActive,
            createdAt: data.order.business.createdAt,
            updatedAt: data.order.business.updatedAt,
          },
          rider: data.order.rider,
        },
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch order details");
    }
  },
  // PUT
  // /orders/status/{orderId}

  updateOrderStatus: async (id, status, token) => {
    try {
      const response = await fetch(`${API_URL}/orders/status/${id}`, {
        method: "PUT",
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
