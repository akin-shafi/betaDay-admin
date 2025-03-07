/* eslint-disable react-refresh/only-export-components */
import { message } from "antd";

export const updateBusinessImage = async (businessId, image, token) => {
  try {
    console.log("Starting image update process...");
    console.log("Business ID:", businessId);
    console.log("Image type:", image instanceof File ? "File" : "URL");
    console.log("Image value:", image);

    // If we have a file, we need to handle the upload first
    if (image instanceof File) {
      const formData = new FormData();
      formData.append("image", image);

      console.log("Preparing file upload...");
      console.log("File details:", {
        name: image.name,
        type: image.type,
        size: image.size,
      });

      // Make API call to upload the image
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/businesses/${businessId}/image`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            // Remove Content-Type header for FormData
            // The browser will set it automatically with the boundary
          },
          body: formData,
        }
      );

      console.log("Upload response status:", response.status);
      console.log(
        "Upload response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Upload failed:", errorData);
        throw new Error(errorData?.message || "Failed to upload image");
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      message.success("Business image updated successfully");
      return data;
    } else {
      console.log("Preparing URL update...");
      // If it's just a URL, update directly
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/businesses/${businessId}/image`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image }),
        }
      );

      console.log("URL update response status:", response.status);
      console.log(
        "URL update response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("URL update failed:", errorData);
        throw new Error(errorData?.message || "Failed to update image URL");
      }

      const data = await response.json();
      console.log("URL update successful:", data);
      message.success("Business image updated successfully");
      return data;
    }
  } catch (err) {
    console.error("Error in updateBusinessImage:", err);
    message.error(err.message || "Failed to update business image");
    throw err;
  }
};

const UseBusinessImage = () => {
  return <div></div>;
};

export default UseBusinessImage;
