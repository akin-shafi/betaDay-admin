"use client";

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Modal, Form, Input, InputNumber, Button, Select, message } from "antd";
import { Plus, MinusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductCategories } from "@/hooks/useProduct";
import { useSession } from "@/hooks/useSession";
const { TextArea } = Input;

export default function AddMultipleProductsModal({
  isVisible,
  onCancel,
  onFinish: onFinishProp,
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

  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      await onFinishProp(values);
      message.success("Products created successfully");
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error(error.message || "Failed to create products");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add Multiple Products"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Create"
      cancelText="Cancel"
      width={window.innerWidth < 768 ? "95%" : 800}
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
          products: [{ categories: [] }],
        }}
      >
        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className="border border-gray-200 p-4 mb-4 rounded-lg bg-gray-50"
                >
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Product {name + 1}
                    </h4>
                  </div>

                  {/* Two-column grid for Product Name and Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...restField}
                      label={
                        <span className="text-sm font-medium text-gray-700">
                          Product Name
                        </span>
                      }
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the product name",
                        },
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
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label={
                        <span className="text-sm font-medium text-gray-700">
                          Price
                        </span>
                      }
                      name={[name, "price"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the product price",
                        },
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

                  {/* Categories Field */}
                  <Form.Item
                    {...restField}
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Categories
                      </span>
                    }
                    name={[name, "categories"]}
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
                      onChange={(value) => {
                        form.setFieldsValue({
                          products: {
                            [name]: { categories: value },
                          },
                        });
                      }}
                    />
                  </Form.Item>

                  {/* Description Field */}
                  <Form.Item
                    {...restField}
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Description
                      </span>
                    }
                    name={[name, "description"]}
                  >
                    <TextArea
                      placeholder="Enter product description"
                      rows={3}
                      className="text-base border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                      style={{
                        fontSize: "16px",
                        padding: "8px 12px",
                      }}
                      disabled={submitting}
                    />
                  </Form.Item>

                  {/* Remove Product Button */}
                  {fields.length > 1 && (
                    <div className="flex justify-end">
                      <Button
                        type="link"
                        icon={<MinusCircle size={16} />}
                        onClick={() => remove(name)}
                        className="text-red-500 hover:text-red-600 text-base p-0 h-auto"
                        disabled={submitting}
                        style={{ fontSize: "16px" }}
                      >
                        Remove Product
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Another Product Button */}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<Plus size={16} />}
                className="mt-4 text-base border-gray-300 hover:border-orange-500 hover:text-orange-500 rounded-lg"
                style={{
                  fontSize: "16px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disabled={submitting}
              >
                Add Another Product
              </Button>
            </>
          )}
        </Form.List>
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
