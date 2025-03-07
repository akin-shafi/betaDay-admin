/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

export function InviteMemberModal({
  visible,
  onClose,
  onSubmit,
  showCloseIcon = true,
}) {
  const [form] = Form.useForm();

  // Reset the form when modal visibility changes
  useEffect(() => {
    if (visible) {
      form.resetFields(); // Clear form when modal opens
    }
  }, [form, visible]);

  const handleFinish = (values) => {
    onSubmit(values); // Call the onSubmit handler passed as prop
    form.resetFields(); // Clear the form after submitting
    onClose(); // Close the modal after submitting
  };

  return (
    <Modal
      open={visible}
      title="Invite Member"
      onCancel={onClose}
      maskClosable={false} // Prevent closing modal when clicking outside
      footer={[
        showCloseIcon && (
          <Button key="cancel" className="rounded-full" onClick={onClose}>
            Cancel
          </Button>
        ),
        <Button
          key="submit"
          type="primary"
          className="bg-appGreen hover:bg-appGreenLight rounded-full"
          onClick={() => form.submit()}
        >
          Invite
        </Button>,
      ]}
      closeIcon={showCloseIcon ? undefined : null} // Hide close icon based on showCloseIcon state
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter the email address" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
