/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Input, Select, Spin, Button } from "antd";
import { RiDeleteBin5Line } from "react-icons/ri";
import cameraImage from "../../assets/images/camera.jpeg"; // Placeholder image
import { fetchInstitutionById, updateAsset } from "@/hooks/useAction"; // Assuming there's a function to update assets
import { useSession } from "@/hooks/useSession";

const EditAssetModal = ({ visible, onClose, asset, onUpdate }) => {
  const initialRow = {
    image: asset ? asset.image : "",
    caption: asset ? asset.caption : "",
    description: asset ? asset.description : "",
  };

  const { session } = useSession();
  const token = session?.token;
  const [row, setRow] = useState(initialRow);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [captions, setCaptions] = useState([
    "Main Gate",
    "Group Photo",
    "Meeting Session",
    "Administrative Building",
  ]);

  useEffect(() => {
    if (asset) {
      setRow({
        image: asset.image,
        caption: asset.caption,
        description: asset.description,
      });
    }
  }, [asset]);

  const renderError = () =>
    error && <p className="text-red-500 text-center mb-4">{error}</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!(row.image instanceof File)) {
      setError("Please select a valid image file.");
      setIsLoading(false);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(row.image.type)) {
      setError("Invalid image format. Only JPEG, PNG, and GIF are allowed.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", row.image);
    formData.append("caption", row.caption);
    formData.append("description", row.description);
    formData.append("assetId", asset.id); // Assuming each asset has an ID

    try {
      const response = await updateAsset(formData, token);

      if (!response.ok) {
        throw new Error("Failed to update asset");
      }

      onUpdate(); // Callback to refresh the data after the update
      onClose(); // Close the modal after successful update
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={600}>
      <Spin spinning={isLoading}>
        <div className="space-y-6 p-4">
          {renderError()}

          {/* Image Upload */}
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700">
              Image <sup className="text-red-500">*</sup>
            </label>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={
                    row.image instanceof File
                      ? URL.createObjectURL(row.image)
                      : row.image || cameraImage
                  }
                  alt="Asset Avatar"
                  className="w-16 h-16 object-cover"
                />
                {row.image && (
                  <RiDeleteBin5Line
                    className="absolute top-0 right-0 cursor-pointer text-red-500"
                    onClick={() => {
                      setRow({ ...row, image: "" });
                    }}
                  />
                )}
              </div>

              <label
                htmlFor="image-upload"
                className="cursor-pointer text-blue-500 hover:text-blue-700"
              >
                {row.image ? "Change Image" : "Upload Image"}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setRow({ ...row, image: file });
                  }
                }}
              />
            </div>
          </div>

          {/* Caption - Searchable Dropdown */}
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700">
              Caption <sup className="text-red-500">*</sup>
            </label>
            <Select
              value={row.caption}
              onChange={(value) => setRow({ ...row, caption: value })}
              style={{ width: "100%" }}
              showSearch
              allowClear
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {captions.map((caption, idx) => (
                <Select.Option key={idx} value={caption}>
                  {caption}
                </Select.Option>
              ))}
              <Select.Option value="other">
                <Input
                  placeholder="Enter custom caption"
                  onBlur={(e) => setRow({ ...row, caption: e.target.value })}
                />
              </Select.Option>
            </Select>
          </div>

          {/* Description */}
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700">
              Description <sup className="text-red-500">*</sup>
            </label>
            <Input.TextArea
              value={row.description}
              onChange={(e) => setRow({ ...row, description: e.target.value })}
              rows={3}
              placeholder="Enter asset description"
            />
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-appGreen hover:bg-appGreenLight"
            >
              Update Asset
            </Button>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default EditAssetModal;
