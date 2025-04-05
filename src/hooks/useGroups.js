// src/hooks/useGroups.js
const API_URL = import.meta.env.VITE_API_BASE_URL + "/api";

export const fetchGroups = async (token) => {
  try {
    const response = await fetch(`${API_URL}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch groups.");
    }

    const data = await response.json();
    return data.groups || [];
  } catch (error) {
    throw new Error(error.message || "Error fetching groups.");
  }
};

export const fetchGroupById = async (groupId, token) => {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch group.");
    }

    const data = await response.json();
    return data.group;
  } catch (error) {
    throw new Error(error.message || "Error fetching group.");
  }
};

export const createGroup = async (values, token) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("image", values.image);

    const response = await fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create group.");
    }

    const data = await response.json();
    return data.group;
  } catch (error) {
    throw new Error(error.message || "Error creating group.");
  }
};

export const updateGroup = async (groupId, values, token) => {
  try {
    const formData = new FormData();
    if (values.name) formData.append("name", values.name);
    if (values.image) formData.append("image", values.image);

    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update group.");
    }

    const data = await response.json();
    return data.group;
  } catch (error) {
    throw new Error(error.message || "Error updating group.");
  }
};

export const deactivateGroup = async (groupId, token) => {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}/deactivate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to deactivate group.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error deactivating group.");
  }
};

export const activateGroup = async (groupId, token) => {
  try {
    const response = await fetch(`${API_URL}/groups/${groupId}/activate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to activate group.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error activating group.");
  }
};
