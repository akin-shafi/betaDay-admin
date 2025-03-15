/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Switch, Button, message } from "antd";
import { fetchBusinessTypes } from "@/hooks/useBusiness";
import { useSession } from "@/hooks/useSession";

export default function EditBusinessModal({
  isVisible,
  onCancel,
  onFinish,
  business,
  form,
}) {
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  // Fetch business types when the modal is opened
  useEffect(() => {
    const loadBusinessTypes = async () => {
      if (!isVisible || !session?.token) return;

      try {
        setLoading(true);
        const types = await fetchBusinessTypes(session.token);
        setBusinessTypes(types);
      } catch (error) {
        message.error(error.message || "Failed to fetch business types");
      } finally {
        setLoading(false);
      }
    };

    loadBusinessTypes();
  }, [isVisible, session?.token]);

  // Set initial form values when business prop changes
  useEffect(() => {
    if (business && form) {
      form.setFieldsValue({
        ...business,
        businessType: business.businessType?.id || null, // Use the businessType.id for the form
        deliveryOptions: business.deliveryOptions || [],
      });
    }
  }, [business, form]);

  return (
    <Modal
      title="Edit Business"
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
          ...business,
          businessType: business?.businessType?.id || null,
          deliveryOptions: business?.deliveryOptions || [],
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Business Name"
            rules={[{ required: true, message: "Please enter business name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[{ required: true, message: "Please enter contact number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: false, message: "Please enter website" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please enter city" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Please enter state" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="openingTime"
            label="Opening Time"
            rules={[{ required: true, message: "Please enter opening time" }]}
          >
            <Input type="time" />
          </Form.Item>

          <Form.Item
            name="closingTime"
            label="Closing Time"
            rules={[{ required: true, message: "Please enter closing time" }]}
          >
            <Input type="time" />
          </Form.Item>

          <Form.Item
            name="deliveryOptions"
            label="Delivery Options"
            rules={[
              { required: true, message: "Please select delivery options" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select delivery options"
              options={[
                { label: "In-house", value: "In-house" },
                { label: "Pickup", value: "Pickup" },
                { label: "Delivery", value: "Delivery" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="businessType"
            label="Business Type"
            rules={[
              { required: true, message: "Please select a business type" },
            ]}
          >
            <Select
              placeholder="Select business type"
              loading={loading}
              options={businessTypes.map((type) => ({
                label: type.name,
                value: type.name,
              }))}
            />
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
