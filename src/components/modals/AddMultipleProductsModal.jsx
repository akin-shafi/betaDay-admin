/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Modal, Form, Input, InputNumber, Button, Select, message } from "antd";
import { Plus, MinusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductCategories } from "@/hooks/useProduct";
import { useSession } from "@/hooks/useSession";

export default function AddMultipleProductsModal({
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
      title="Add Multiple Products"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Create"
      cancelText="Cancel"
      okButtonProps={{ className: "bg-gray-900 hover:bg-[#ff6600]" }}
      // width={{ xs: "60vw", md: 600 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
                  className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 border p-4 mb-4 rounded gap-4 sm:gap-0"
                >
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <Form.Item
                      {...restField}
                      label="Product Name"
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Enter name",
                        },
                      ]}
                      className="mb-0"
                    >
                      <Input
                        placeholder="Enter product name"
                        className="!text-base md:!text-sm"
                        style={{ fontSize: "16px" }}
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full sm:w-24">
                    <Form.Item
                      {...restField}
                      label="Price"
                      name={[name, "price"]}
                      rules={[
                        {
                          required: true,
                          message: "Enter price",
                        },
                      ]}
                      className="mb-0"
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
                          return `${currencySymbol}${value}`.replace(
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
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <Form.Item
                      {...restField}
                      label="Categories"
                      name={[name, "categories"]}
                      rules={[
                        {
                          required: true,
                          message: "Select or add category",
                        },
                      ]}
                      className="mb-0"
                    >
                      <Select
                        mode="tags"
                        placeholder="Select or type categories"
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
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="text"
                      icon={<MinusCircle size={16} />}
                      onClick={() => remove(name)}
                      className="text-red-500 self-end sm:self-center mb-2 sm:mb-0"
                    />
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
