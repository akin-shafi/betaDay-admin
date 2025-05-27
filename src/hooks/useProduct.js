import { API_URL } from "@/config";

export const fetchProducts = async (token, businessId) => {
  try {
    const response = await fetch(
      `${API_URL}/products?businessId=${encodeURIComponent(businessId)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    const data = await response.json();
    // Handle case where backend returns { products: [...] }
    return Array.isArray(data.products)
      ? data.products
      : Array.isArray(data)
      ? data
      : [];
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    return [];
  }
};

export const fetchProductById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    throw error;
  }
};

export const createSingleProduct = async (data, image, token) => {
  try {
    const formData = new FormData();
    // Append product data fields
    Object.keys(data).forEach((key) => {
      if (key === "options" || key === "categories") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(`${API_URL}/products/single`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in createSingleProduct:", error);
    throw error;
  }
};

export const createMultipleProducts = async (products, images, token) => {
  try {
    const formData = new FormData();
    formData.append("products", JSON.stringify(products));
    images.forEach((image) => {
      if (image) {
        formData.append("images", image);
      }
    });

    const response = await fetch(`${API_URL}/products/multiple`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create products: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in createMultipleProducts:", error);
    throw error;
  }
};

export const updateProduct = async (id, data, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
};

export const updateProductImage = async (id, image, token) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await fetch(`${API_URL}/products/${id}/image`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload product image: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in updateProductImage:", error);
    throw error;
  }
};

export const updateProductStatus = async (id, isActive, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update product status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in updateProductStatus:", error);
    throw error;
  }
};

export const updateProductStock = async (id, stock, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}/stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stock }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update product stock: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in updateProductStock:", error);
    throw error;
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
};

export const searchProducts = async (query, token) => {
  try {
    const response = await fetch(
      `${API_URL}/products/search?query=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in searchProducts:", error);
    throw error;
  }
};

export const getProductCategories = async (token) => {
  try {
    const response = await fetch(`${API_URL}/product-categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch product categories: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getProductCategories:", error);
    throw error;
  }
};

// export const fetchProductCategories = async (token) => {
//   const response = await fetch(`${API_URL}/products/categories`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!response.ok) throw new Error("Failed to fetch product categories");
//   return response.json();
// };
