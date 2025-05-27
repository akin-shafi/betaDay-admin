/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import { getProductCategories } from "@/hooks/useProduct";
import { useSession } from "@/hooks/useSession";

const { TextArea } = Input;

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
  const [submitting, setSubmitting] = useState(false);
  const { session } = useSession();

  // Fetch product categories when the modal is opened
  useEffect(() => {
    const loadProductCategories = async () => {
      if (!isVisible || !session?.token) return;

      try {
        setLoading(true);
        const response = await getProductCategories(session.token);
        setProductCategories(response.categories || []);
      } catch (error) {
        message.error(error.message || "Failed to fetch product categories");
      } finally {
        setLoading(false);
      }
    };

    loadProductCategories();
  }, [isVisible, session?.token]);

  // Populate form with product data when modal opens
  useEffect(() => {
    if (isVisible && product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        description: product.description,
        categories: product.categories?.map((cat) => cat.name) || [], // Use category names instead of IDs
        stockQuantity: product.stockQuantity || 0,
      });
      setSelectedCurrency(product.currency || "Naira");
    }
  }, [isVisible, product, form, setSelectedCurrency]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isVisible) {
      form.resetFields();
    }
  }, [isVisible, form]);

  // Handle form submission with submitting state
  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      await onFinish(values);
      message.success("Product updated successfully");
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error(error.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Edit Product"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Update"
      cancelText="Cancel"
      okButtonProps={{
        className: "bg-gray-900 hover:bg-[#ff6600] !text-base md:!text-sm",
        disabled: submitting,
        loading: submitting,
      }}
      cancelButtonProps={{
        className: "!text-base md:!text-sm",
        disabled: submitting,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          stockQuantity: 0,
          categories: [],
        }}
      >
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input
            placeholder="Enter product name"
            className="!text-base md:!text-sm"
            style={{ fontSize: "16px" }}
            disabled={submitting}
          />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please enter the product price" },
          ]}
        >
          <InputNumber
            min={0}
            step={0.01}
            className="w-full !text-base md:!text-sm"
            style={{ fontSize: "16px" }}
            disabled={submitting}
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
              return value.replace(
                new RegExp(`\\${currencySymbol}\\s?|(,*)/g`),
                ""
              );
            }}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea
            placeholder="Enter product description"
            rows={4}
            className="!text-base md:!text-sm"
            style={{ fontSize: "16px" }}
            disabled={submitting}
          />
        </Form.Item>
        <Form.Item
          label="Categories"
          name="categories"
          rules={[
            {
              required: true,
              message: "Please select or add at least one category",
            },
          ]}
        >
          <Select
            mode="tags"
            placeholder="Select or type to add categories"
            loading={loading}
            options={productCategories.map((category) => ({
              label: category.name,
              value: category.name,
            }))}
            showSearch
            optionFilterProp="label"
            className="!text-base md:!text-sm"
            style={{ fontSize: "16px" }}
            disabled={submitting}
            onChange={(value) => {
              form.setFieldsValue({ categories: value });
            }}
          />
        </Form.Item>
        <Form.Item label="Stock Quantity" name="stockQuantity">
          <InputNumber
            min={0}
            className="w-full !text-base md:!text-sm"
            style={{ fontSize: "16px" }}
            disabled={submitting}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

const CURRENCY_OPTIONS = [
  { label: "Naira (₦)", value: "Naira" },
  { label: "Dollar ($)", value: "Dollar" },
  { label: "Euro (€)", value: "Euro" },
  { label: "Pound (£)", value: "Pound" },
];
