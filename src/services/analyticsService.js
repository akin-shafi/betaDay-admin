const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to build query parameters
const buildQueryParams = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.startDate) {
    queryParams.append("startDate", params.startDate.toISOString());
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate.toISOString());
  }
  if (params.businessId) {
    queryParams.append("businessId", params.businessId);
  }
  return queryParams.toString();
};

// Fetch all analytics data in a single call
export const fetchAllAnalytics = async (token, params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_URL}/api/analytics/all${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch analytics data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

// Fetch comprehensive dashboard analytics
export const fetchDashboardAnalytics = async (token, params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_URL}/api/analytics/dashboard${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch dashboard analytics"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    throw error;
  }
};

// Fetch total delivery fees
export const fetchTotalDeliveryFees = async (token, params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_URL}/api/analytics/delivery-fees${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch total delivery fees"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching total delivery fees:", error);
    throw error;
  }
};

// Fetch total service fees
export const fetchTotalServiceFees = async (token, params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_URL}/api/analytics/service-fees${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch total service fees"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching total service fees:", error);
    throw error;
  }
};

// Fetch total revenue by business
export const fetchRevenueByBusiness = async (token, params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_URL}/api/analytics/revenue-by-business${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch revenue by business"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching revenue by business:", error);
    throw error;
  }
};

// Fetch total delivery fees by business
export const fetchDeliveryFeesByBusiness = async (token, params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_URL}/api/analytics/delivery-fees-by-business${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch delivery fees by business"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching delivery fees by business:", error);
    throw error;
  }
};

// Fetch total service fees by business
export const fetchServiceFeesByBusiness = async (token, params = {}) => {
  try {
    const queryString = buildQueryParams(params);
    const url = `${API_URL}/api/analytics/service-fees-by-business${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch service fees by business"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching service fees by business:", error);
    throw error;
  }
};
