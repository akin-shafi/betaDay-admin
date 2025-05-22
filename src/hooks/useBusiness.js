import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8500"; // Use Vite environment variable

// ================== Businesses =========================== //
export const fetchBusinesses = async (
  token,
  page = 1,
  limit = 10,
  businessType = null,
  search = null
) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (businessType) {
      queryParams.append("businessType", businessType);
    }
    if (search) {
      queryParams.append("search", search);
    }

    const response = await fetch(
      `${API_URL}/businesses?${queryParams.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch businesses.");
    }

    const data = await response.json();
    return {
      businesses: Array.isArray(data.businesses) ? data.businesses : [],
      total: data.total || 0,
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching businesses.");
  }
};

export const fetchBusinessById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/businesses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch business details.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching business details.");
  }
};

export const createBusiness = async (data, token) => {
  const response = await fetch(`${API_URL}/businesses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create business.");
  }

  return response.json();
};

export const updateBusiness = async (id, data, token) => {
  const response = await fetch(`${API_URL}/businesses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteBusiness = async (id, token) => {
  const response = await fetch(`${API_URL}/businesses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete business");
};

// ================== Business Groups =========================== //
export function useFetchBusinessGroups(token, isVisible) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!isVisible || !token) {
        setGroups([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/groups?isActive=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch business groups."
          );
        }

        const data = await response.json();
        const groupList = Array.isArray(data.groups)
          ? data.groups.map((group) => ({ name: group.name }))
          : [];
        setGroups(groupList);
      } catch (err) {
        setError(err.message || "Error fetching business groups.");
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token, isVisible]);

  return { groups, loading, error };
}
