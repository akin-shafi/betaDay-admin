/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";

export function InstitutionModal({
  visible,
  onClose,
  onSubmit,
  institution = null,
}) {
  const [form] = Form.useForm();
  const isEdit = Boolean(institution); // Determines if editing or creating

  // Reset the form when the modal visibility or institution changes
  useEffect(() => {
    if (visible) {
      isEdit ? form.setFieldsValue(institution) : form.resetFields();
    }
  }, [form, isEdit, institution, visible]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields(); // Clear the form after submitting
  };

  return (
    <Modal
      open={visible}
      title={isEdit ? "Edit Institution" : "Create New Institution"}
      onCancel={onClose}
      footer={[
        <Button key="cancel" className="rounded-full" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="bg-appGreen hover:bg-appGreenLight rounded-full"
          onClick={() => form.submit()}
        >
          {isEdit ? "Save Changes" : "Create Institution"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              label="Institution Name"
              rules={[
                {
                  required: true,
                  message: "Please enter the institution name",
                },
              ]}
            >
              <Input placeholder="Enter institution name" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="initial"
              label="Institution Initial"
              rules={[
                {
                  required: true,
                  message: "Please enter the institution initial",
                },
              ]}
            >
              <Input placeholder="Enter institution initial" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please enter the address" }]}
            >
              <Input placeholder="Enter address" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please enter the city" }]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please enter the state" }]}
            >
              <Input placeholder="Enter state" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please enter the country" }]}
            >
              <Input placeholder="Enter country" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { required: true, message: "Please enter the phone number" },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter the email" }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
