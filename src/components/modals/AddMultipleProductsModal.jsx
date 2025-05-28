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
          products: [{ categories: [] }],
        }}
      >
        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="border p-4 mb-4 rounded">
                  {/* Two-column grid for Product Name and Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...restField}
                      label="Product Name"
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
                        className="!text-base md:!text-sm"
                        style={{ fontSize: "16px" }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Price"
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
                  </div>

                  {/* Remaining Fields */}
                  <Form.Item
                    {...restField}
                    label="Categories"
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
                      className="!text-base md:!text-sm"
                      style={{ fontSize: "16px" }}
                      onChange={(value) => {
                        form.setFieldsValue({
                          products: {
                            [name]: { categories: value },
                          },
                        });
                      }}
                    />
                  </Form.Item>

                  <Form.Item label="Description" name="description">
                    <TextArea
                      placeholder="Enter product description"
                      rows={2}
                      className="!text-base md:!text-sm"
                      style={{ fontSize: "16px" }}
                      disabled={submitting}
                    />
                  </Form.Item>

                  {fields.length > 1 && (
                    <Button
                      type="link"
                      icon={<MinusCircle size={16} />}
                      onClick={() => remove(name)}
                      className="text-red-500"
                      disabled={submitting}
                      style={{ fontSize: "16px" }}
                    >
                      Remove Product
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<Plus size={16} />}
                className="mt-2 !text-base md:!text-sm"
                style={{ fontSize: "16px" }}
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
