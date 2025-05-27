/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Modal, Form, Input, InputNumber, Switch, Select } from "antd";
import { useEffect } from "react";

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
  useEffect(() => {
    if (isVisible && product) {
      form.setFieldsValue({
        ...product,
        categories: product.categories?.map((cat) => cat.id) || [],
        options: product.options ? JSON.stringify(product.options) : "",
      });
      setSelectedCurrency(product.currency || "Naira");
    }
  }, [isVisible, product, form]);

  return (
    <Modal
      title="Edit Product"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Update"
      cancelText="Cancel"
      okButtonProps={{ className: "bg-gray-900 hover:bg-[#ff6600]" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isActive: true,
          isAvailable: true,
          isFeatured: false,
          stockQuantity: 0,
        }}
      >
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input placeholder="Enter product name" />
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
            className="w-full"
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
          <TextArea placeholder="Enter product description" rows={4} />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Input placeholder="Enter category name" />
        </Form.Item>
        <Form.Item label="Categories" name="categories">
          <Select mode="tags" placeholder="Select or add categories" />
        </Form.Item>
        <Form.Item label="Options (JSON)" name="options">
          <Input placeholder='Enter options as JSON (e.g., {"size": "medium"})' />
        </Form.Item>
        <Form.Item label="Stock Quantity" name="stockQuantity">
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item label="Discount Price" name="discountPrice">
          <InputNumber
            min={0}
            step={0.01}
            className="w-full"
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
        <Form.Item label="Is Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          label="Is Available"
          name="isAvailable"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Is Featured"
          name="isFeatured"
          valuePropName="checked"
        >
          <Switch />
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
