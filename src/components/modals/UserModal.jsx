/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col } from "antd";
import { fetchRoles, fetchInstitution } from "@/hooks/useAction";

export function UserModal({
  visible,
  onClose,
  onSubmit,
  user = null,
  showCloseIcon = true,
}) {
  const [form] = Form.useForm();
  const isEdit = Boolean(user);
  const [roles, setRoles] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    if (visible) {
      const getRoles = async () => {
        try {
          const rolesData = await fetchRoles();
          setRoles(rolesData);
        } catch (error) {
          console.error("Failed to fetch roles", error);
        }
      };

      const getInstitutions = async () => {
        try {
          const institutionsData = await fetchInstitution();
          const institutionOptions = institutionsData.map((institution) => ({
            value: institution.id,
            label: `${institution.name} (${institution.initial})`,
          }));
          setInstitutions(institutionOptions);

          // Pre-populate tags for edit mode
          if (isEdit && user?.tags) {
            const existingTags = user.tags.map((tagId) => tagId);
            form.setFieldsValue({ ...user, tags: existingTags });
          } else {
            form.resetFields();
          }
        } catch (error) {
          console.error("Failed to fetch institutions", error);
        }
      };

      getRoles();
      getInstitutions();
    }
  }, [form, isEdit, user, visible]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      tags: values.tags.map((tag) => tag), // Ensure tags are IDs
      createdBy: "admin",
      role: values.role || "admin",
    };
    onSubmit(payload);
    form.resetFields();
  };

  // Generate group options dynamically
  const groupOptions = Array.from({ length: 11 }, (_, i) => ({
    value: `Group ${i + 1}`,
    label: `Group ${i + 1}`,
  }));

  return (
    <Modal
      open={visible}
      title={isEdit ? "Edit Member" : "Create New Member"}
      onCancel={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showCloseIcon && (
            <Button key="cancel" className="rounded-full" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            key="submit"
            type="primary"
            className="bg-appGreen hover:bg-appGreenLight rounded-full"
            onClick={() => form.submit()}
          >
            {isEdit ? "Save Changes" : "Submit"}
          </Button>
        </div>
      }
      closeIcon={showCloseIcon ? undefined : null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ tags: [] }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter the full name" },
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter a valid email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            placeholder="Select role"
            options={roles.map((role) => ({ value: role, label: role }))}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          rules={[
            { required: true, message: "Please select at least one tag" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select tags"
            allowClear
            showSearch
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            }
            options={institutions}
          />
        </Form.Item>

        <Form.Item
          name="group"
          label="Group"
          rules={[{ required: true, message: "Please select a group" }]}
        >
          <Select placeholder="Select group" options={groupOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
