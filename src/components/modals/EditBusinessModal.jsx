/* eslint-disable react/prop-types */
import { Modal, Form, Input, Select, Switch, Button } from "antd";

export default function EditBusinessModal({
  isVisible,
  onCancel,
  onFinish,
  business,
  form,
}) {
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
        initialValues={business}
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
            rules={[{ required: true, message: "Please enter website" }]}
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
            name="categories"
            label="Categories"
            rules={[{ required: true, message: "Please select categories" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select categories"
              options={[
                { label: "Restaurant", value: "Restaurant" },
                { label: "Hotel", value: "Hotel" },
                { label: "Pharmacy", value: "Pharmacy" },
                { label: "Bakery", value: "Bakery" },
              ]}
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
