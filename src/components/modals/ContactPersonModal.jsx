import { Modal, Form, Input, Select, Button } from "antd";

export default function ContactPersonModal({
  isVisible,
  onCancel,
  onFinish,
  contactPerson,
  form,
}) {
  return (
    <Modal
      title={contactPerson ? "Edit Contact Person" : "Add New Contact Person"}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={contactPerson}
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: "Please enter position" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Please select department" }]}
        >
          <Select
            placeholder="Select department"
            options={[
              { label: "Sales", value: "sales" },
              { label: "Marketing", value: "marketing" },
              { label: "Operations", value: "operations" },
              { label: "Finance", value: "finance" },
              { label: "HR", value: "hr" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
          rules={[{ required: true, message: "Please enter notes" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {contactPerson ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
