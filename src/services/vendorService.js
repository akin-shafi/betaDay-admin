import { API_URL, ENDPOINTS } from "@/config";

export const vendorService = {
  getAllVendors: async (token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.BUSINESSES}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch vendors");
      }

      const data = await response.json();
      return data.vendors;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch vendors");
    }
  },

  getVendorById: async (id, token) => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.BUSINESS_DETAILS(id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch vendor details");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to fetch vendor details");
    }
  },

  createVendor: async (vendorData, token) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.BUSINESSES}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create vendor");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to create vendor");
    }
  },

  updateVendor: async (id, vendorData, token) => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.BUSINESS_DETAILS(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(vendorData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update vendor");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to update vendor");
    }
  },

  updateVendorStatus: async (id, status, token) => {
    try {
      const response = await fetch(
        `${API_URL}${ENDPOINTS.BUSINESS_STATUS(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update vendor status");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to update vendor status");
    }
  },
};
