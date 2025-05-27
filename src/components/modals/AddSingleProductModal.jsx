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

  return (
    <Modal
      title="Add New Product"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Create"
      cancelText="Cancel"
      okButtonProps={{
        className: "bg-gray-900 hover:bg-[#ff6600] !text-base md:!text-sm",
      }}
      cancelButtonProps={{ className: "!text-base md:!text-sm" }}
      // width={{ xs: "90vw", lg: 800 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
          />
        </Form.Item>
        <Form.Item
          label="Categories"
          name="categories"
          rules={[
            { required: true, message: "Please select at least one category" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select categories"
            loading={loading}
            options={productCategories.map((category) => ({
              label: category.name,
              value: category.name,
            }))}
            showSearch
            optionFilterProp="label"
            className="!text-base md:!text-sm"
            style={{ fontSize: "16px" }}
            tagRender={(props) => (
              <span
                className="text-base md:text-sm"
                style={{ fontSize: "16px" }}
              >
                <Select.Option {...props} />
              </span>
            )}
            dropdownStyle={{ fontSize: "16px" }}
          />
        </Form.Item>
        <Form.Item label="Stock Quantity" name="stockQuantity">
          <InputNumber
            min={0}
            className="w-full !text-base md:!text-sm"
            style={{ fontSize: "16px" }}
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
