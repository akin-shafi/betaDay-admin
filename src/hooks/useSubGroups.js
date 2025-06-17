// src/hooks/usesubGroups.js
const API_URL = import.meta.env.VITE_API_BASE_URL + "/api";
export const fetchSubGroups = async (groupId, token) => {
  try {
    const response = await fetch(`${API_URL}/subgroups?groupId=${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch subgroups.");
    }

    const data = await response.json();
    return data.subGroups || [];
  } catch (error) {
    throw new Error(error.message || "Error fetching subgroups.");
  }
};

export const fetchSubGroupById = async (subGroupId, token) => {
  try {
    const response = await fetch(`${API_URL}/subgroups/${subGroupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch subgroup.");
    }

    const data = await response.json();
    return data.subGroup;
  } catch (error) {
    throw new Error(error.message || "Error fetching subgroup.");
  }
};

export const createSubGroup = async (groupId, values, token) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("image", values.image);
    formData.append("groupId", groupId);

    const response = await fetch(`${API_URL}/subgroups`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create subgroup.");
    }

    const data = await response.json();
    return data.subGroup;
  } catch (error) {
    throw new Error(error.message || "Error creating subgroup.");
  }
};



export const updateSubGroup = async (subGroupId, values, token) => {
  try {
    const hasImageFile = values.image && values.image instanceof File;
    let response;

    if (hasImageFile) {
      // Use FormData for image uploads
      const formData = new FormData();
      if (values.name) formData.append("name", values.name);
      if (values.isActive !== undefined)
        formData.append("isActive", values.isActive.toString());
      formData.append("image", values.image);

      response = await fetch(`${API_URL}/subgroups/${subGroupId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    } else {
      // Use JSON for non-image updates
      const updateData = {};
      if (values.name) updateData.name = values.name;
      if (values.isActive !== undefined) updateData.isActive = values.isActive;

      response = await fetch(`${API_URL}/subgroups/${subGroupId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update subgroup.");
    }

    const data = await response.json();
    return data.subGroup;
  } catch (error) {
    throw new Error(error.message || "Error updating subgroup.");
  }
};

export const deactivateSubGroup = async (subGroupId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/subgroups/${subGroupId}/deactivate`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to deactivate subgroup.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error deactivating subgroup.");
  }
};

export const activateSubGroup = async (subGroupId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/subgroups/${subGroupId}/activate`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to activate subgroup.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error activating subgroup.");
  }
};
