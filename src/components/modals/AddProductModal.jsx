/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  InputNumber,
  Upload,
  message,
} from "antd";
import { Upload as UploadIcon } from "lucide-react";
import { getProductCategories } from "@/hooks/useProduct";
import { useSession } from "@/hooks/useSession";

const CURRENCY_OPTIONS = [
  { label: "Naira (₦)", value: "Naira" },
  { label: "Dollar ($)", value: "Dollar" },
  { label: "Euro (€)", value: "Euro" },
  { label: "Pound (£)", value: "Pound" },
];

export default function AddProductModal({
  isVisible,
  onCancel,
  onFinish,
  form,
  selectedCurrency,
  setSelectedCurrency,
  imagePreview,
  setImagePreview,
}) {
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  // Fetch product categories when the modal is opened
  useEffect(() => {
    const loadProductCategories = async () => {
      if (!isVisible || !session?.token) return;

      try {
        setLoading(true);
        const categories = await getProductCategories(session.token);
        const categoryNames = categories.map((category) => category.name);
        setProductCategories(categoryNames);
      } catch (error) {
        message.error(error.message || "Failed to fetch product categories");
      } finally {
        setLoading(false);
      }
    };

    loadProductCategories();
  }, [isVisible, session?.token]);

  const beforeImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    return false; // Prevent default upload behavior
  };

  const handleImageChange = (info) => {
    if (info.file) {
      setImagePreview(URL.createObjectURL(info.file));
      form.setFieldsValue({ image: info.file });
    }
  };

  return (
    <Modal
      title="Add New Product"
      open={isVisible}
      onCancel={() => {
        onCancel();
        setImagePreview(null);
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isActive: true,
          currency: "Naira",
          category: null,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Categories"
            name="categories"
            rules={[
              {
                required: true,
                message: "Please select at least one category",
              },
            ]}
          >
            <Select
              placeholder="Select categories"
              loading={loading}
              options={productCategories.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, message: "Please select currency" }]}
          >
            <Select
              placeholder="Select currency"
              options={CURRENCY_OPTIONS}
              onChange={(value) => setSelectedCurrency(value)}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              step={0.01}
              formatter={(value) => {
                const currencySymbol =
                  CURRENCY_OPTIONS.find(
                    (c) => c.value === selectedCurrency
                  )?.label.split(" ")[0] || "₦";
                return `${currencySymbol} ${value}`.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                );
              }}
              parser={(value) => {
                const currencySymbol =
                  CURRENCY_OPTIONS.find(
                    (c) => c.value === selectedCurrency
                  )?.label.split(" ")[0] || "₦";
                return value
                  .replace(new RegExp(`\\${currencySymbol}\\s?|(,*)/g`), "")
                  .replace(/[^0-9.-]/g, "");
              }}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please enter stock" }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="image"
            label="Product Image"
            rules={[
              {
                required: true,
                message: "Please upload or enter an image URL",
              },
            ]}
          >
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <img
                  src={imagePreview || "https://via.placeholder.com/150"}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
              <Upload
                name="image"
                listType="picture"
                className="image-uploader"
                showUploadList={false}
                beforeUpload={beforeImageUpload}
                onChange={handleImageChange}
                maxCount={1}
                customRequest={({ onSuccess }) => {
                  onSuccess();
                }}
              >
                <Button icon={<UploadIcon size={16} />}>Select Image</Button>
              </Upload>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              <Input
                placeholder="Enter image URL"
                onChange={(e) => {
                  const newUrl = e.target.value;
                  if (newUrl) {
                    setImagePreview(newUrl);
                    form.setFieldsValue({ image: newUrl });
                  }
                }}
              />
            </div>
          </Form.Item>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={() => {
              onCancel();
              setImagePreview(null);
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create Product
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
