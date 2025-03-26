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
  message,
} from "antd";
import { fetchProductCategories } from "@/hooks/useProduct"; // Assuming this is the file path
import { useSession } from "@/hooks/useSession";

const CURRENCY_OPTIONS = [
  { label: "Naira (₦)", value: "Naira" },
  { label: "Dollar ($)", value: "Dollar" },
  { label: "Euro (€)", value: "Euro" },
  { label: "Pound (£)", value: "Pound" },
];

export default function EditProductModal({
  isVisible,
  onCancel,
  onFinish,
  product,
  form,
  selectedCurrency,
  setSelectedCurrency,
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
        const categories = await fetchProductCategories(session.token);
        setProductCategories(categories); // Store full category objects
      } catch (error) {
        message.error(error.message || "Failed to fetch product categories");
      } finally {
        setLoading(false);
      }
    };

    loadProductCategories();
  }, [isVisible, session?.token]);

  // Set initial form values when product prop changes
  useEffect(() => {
    if (product && form) {
      form.setFieldsValue({
        ...product,
        categories: product.categories?.map((cat) => cat.name) || [], // Map to array of names
        currency: product.currency || "Naira",
      });
      setSelectedCurrency(product.currency || "Naira");
    }
  }, [product, form, setSelectedCurrency]);

  return (
    <Modal
      title="Edit Product"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          ...product,
          categories: product?.categories?.map((cat) => cat.name) || [],
          currency: product?.currency || "Naira",
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
            name="categories"
            label="Categories"
            rules={[{ required: true, message: "Please select at least one category" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select categories"
              loading={loading}
              options={productCategories.map((category) => ({
                label: category.name,
                value: category.name, // Use name as value for consistency with backend
              }))}
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
                  CURRENCY_OPTIONS.find((c) => c.value === selectedCurrency)?.label.split(" ")[0] || "₦";
                return `${currencySymbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }}
              parser={(value) => {
                const currencySymbol =
                  CURRENCY_OPTIONS.find((c) => c.value === selectedCurrency)?.label.split(" ")[0] || "₦";
                return value
                  .replace(new RegExp(`\\${currencySymbol}\\s?|(,*)/g`), "")
                  .replace(/[^0-9.-]/g, "");
              }}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: false, message: "Please enter stock" }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image"
            rules={[{ required: false, message: "Please enter image URL" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
}