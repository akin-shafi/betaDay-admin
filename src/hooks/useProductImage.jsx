import { message } from "antd";

export const updateProductImage = async (productId, image, token) => {
  try {
    // console.log("Starting product image update...");
    // console.log("Product ID:", productId);
    // console.log("Image type:", image instanceof File ? "File" : "URL");

    let response;
    if (image instanceof File) {
      const formData = new FormData();
      formData.append("image", image);
      console.log("Sending file upload request...");
      response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/${productId}/image`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      console.log("File upload response:", response.status);
    } else {
      console.log("Sending URL update request...");
      response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/${productId}/image`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image }),
        }
      );
      console.log("URL update response:", response.status);
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Failed to update product image");
    }

    const data = await response.json();
    message.success("Product image updated successfully");
    return data;
  } catch (error) {
    console.error("Error in updateProductImage:", error);
    throw error;
  }
};
