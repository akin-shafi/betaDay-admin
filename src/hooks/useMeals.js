// src/hooks/useMeals.js
const API_URL = import.meta.env.VITE_API_BASE_URL + "/api";

export const fetchMeals = async (token) => {
  try {
    const response = await fetch(`${API_URL}/meals`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch meals.");
    }

    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    throw new Error(error.message || "Error fetching meals.");
  }
};

export const fetchMealById = async (mealId, token) => {
  try {
    const response = await fetch(`${API_URL}/meals/${mealId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch meal.");
    }

    const data = await response.json();
    return data.meal;
  } catch (error) {
    throw new Error(error.message || "Error fetching meal.");
  }
};

export const createMeal = async (values, token) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    if (values.image) formData.append("image", values.image);
    formData.append("type", values.type);

    const response = await fetch(`${API_URL}/meals`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create meal.");
    }

    const data = await response.json();
    return data.meal;
  } catch (error) {
    throw new Error(error.message || "Error creating meal.");
  }
};

export const updateMeal = async (mealId, values, token) => {
  try {
    const formData = new FormData();
    if (values.name) formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);
    if (values.price) formData.append("price", values.price.toString());
    if (values.image) formData.append("image", values.image);
    if (values.type) formData.append("type", values.type);

    const response = await fetch(`${API_URL}/meals/${mealId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update meal.");
    }

    const data = await response.json();
    return data.meal;
  } catch (error) {
    throw new Error(error.message || "Error updating meal.");
  }
};

export const deleteMeal = async (mealId, token) => {
  try {
    const response = await fetch(`${API_URL}/meals/${mealId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete meal.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error deleting meal.");
  }
};