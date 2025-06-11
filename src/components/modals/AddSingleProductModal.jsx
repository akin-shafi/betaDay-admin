"use client";

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import { getProductCategories } from "@/hooks/useProduct";
import { useSession } from "@/hooks/useSession";

const { TextArea } = Input;

export default function AddSingleProductModal({
  isVisible,
  onCancel,
  onFinish,
  form,
  selectedCurrency,
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
      message.success("Product created successfully");
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error(error.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add New Product"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Create"
      cancelText="Cancel"
      width={window.innerWidth < 768 ? "95%" : 600}
      okButtonProps={{
        className: "bg-gray-900 hover:bg-[#ff6600] text-base",
        disabled: submitting,
        loading: submitting,
        style: { fontSize: "16px" },
      }}
      cancelButtonProps={{
        className: "text-base",
        disabled: submitting,
        style: { fontSize: "16px" },
      }}
      className="mobile-optimized-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          categories: [],
        }}
      >
        {/* Product Name & Price side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">
                Product Name
              </span>
            }
            name="name"
            rules={[
              { required: true, message: "Please enter the product name" },
            ]}
          >
            <Input
              placeholder="Enter product name"
              className="text-base border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              style={{
                fontSize: "16px",
                padding: "8px 12px",
                height: "auto",
              }}
              disabled={submitting}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700">Price</span>
            }
            name="price"
            rules={[
              { required: true, message: "Please enter the product price" },
            ]}
          >
            <InputNumber
              min={0}
              step={0.01}
              className="w-full text-base border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              style={{
                fontSize: "16px",
                padding: "8px 12px",
                height: "auto",
              }}
              controls={false}
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
        </div>

        <Form.Item
          label={
            <span className="text-sm font-medium text-gray-700">
              Categories
            </span>
          }
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
            className="text-base mobile-select"
            style={{
              fontSize: "16px",
            }}
            dropdownStyle={{
              fontSize: "16px",
            }}
            disabled={submitting}
            onChange={(value) => {
              form.setFieldsValue({ categories: value });
            }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-sm font-medium text-gray-700">
              Description
            </span>
          }
          name="description"
        >
          <TextArea
            placeholder="Enter product description"
            rows={4}
            className="text-base border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
            style={{
              fontSize: "16px",
              padding: "8px 12px",
            }}
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
