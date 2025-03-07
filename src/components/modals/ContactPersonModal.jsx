/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Modal, Button, Input, Form, message } from "antd";

const ContactPersonModal = ({
  visible,
  mode, // "create" or "edit"
  contact,
  onClose,
  onSave,
  designatedBy,
  institutionId,
}) => {
  const [form] = Form.useForm();

  // Set or reset form values based on the mode
  useEffect(() => {
    if (visible) {
      if (mode === "edit" && contact) {
        form.setFieldsValue({
          fullName: contact.fullName,
          email: contact.email,
          phone: contact.phone,
          designation: contact.designation,
        });
      } else if (mode === "create") {
        form.resetFields();
      }
    }
  }, [visible, mode, contact, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const contactData = {
          ...values,
          createdBy: designatedBy,
          institutionId,
        };

        onSave(contactData)
          .then(() => {
            message.success(
              mode === "edit"
                ? "Contact updated successfully"
                : "Contact added successfully"
            );
            onClose();
          })
          .catch((error) => {
            console.error("Failed to save contact:", error);
            message.error("Failed to save contact");
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="bg-appGreen hover:bg-appGreenLight"
          onClick={handleSubmit}
        >
          {mode === "edit" ? "Save Changes" : "Add Contact"}
        </Button>,
      ]}
      width={600}
      title={
        mode === "edit"
          ? `Edit Contact: ${contact?.fullName}`
          : "Add New Contact"
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="contactForm"
        initialValues={{
          fullName: contact?.fullName || "",
          email: contact?.email || "",
          phone: contact?.phone || "",
          designation: contact?.designation || "",
        }}
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter the name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter an email address!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter a phone number!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Designation"
          name="designation"
          rules={[{ required: true, message: "Please enter designation!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactPersonModal;
