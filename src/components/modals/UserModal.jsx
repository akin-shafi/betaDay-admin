import { Modal, Form, Input, Select, Switch, Button } from "antd";

export const UserModal = ({ isVisible, onCancel, onFinish, user, form }) => {
  return (
    <Modal
      title={user ? "Edit User" : "Add New User"}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={user}
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
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select role" }]}
        >
          <Select
            placeholder="Select role"
            options={[
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
              { label: "Manager", value: "manager" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="isActive" label="Status" valuePropName="checked">
          <Switch />
        </Form.Item>

        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-gray-900 hover:bg-[#ff6600]"
          >
            {user ? "Update User" : "Create User"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserModal;
