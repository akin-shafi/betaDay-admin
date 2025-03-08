/* eslint-disable react/prop-types */
// component/modals/UserModal.jsx
import { useState } from "react";
import { Modal, Form, Input, Select, Button, message, Upload } from "antd";
import { updateUser, deleteUser } from "../../hooks/useAction";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

export const UserModal = ({ visible, user, onClose, token, onUserUpdated }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Determine if we're in "add" mode (no user provided) or "view/edit" mode
  const isAddMode = !user;

  // Pre-fill form with user data in edit mode; empty in add mode
  const initialValues = isAddMode
    ? { role: "user" } // Default role for new users
    : {
        fullName: user?.fullName,
        email: user?.email,
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        profileImage: user?.profileImage || "",
        role: user?.role,
      };

  // Handle file upload for profile image
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleAdd = async (values) => {
    try {
      setLoading(true);
      const newUserData = { ...values };

      // If a profile image is uploaded, include it
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        Object.keys(newUserData).forEach((key) => {
          formData.append(key, newUserData[key]);
        });
        formData.append("profileImage", fileList[0].originFileObj);

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add user");
        }
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newUserData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add user");
        }
      }

      message.success("User added successfully");
      onUserUpdated(); // Trigger refresh in parent component
      form.resetFields();
      setFileList([]);
      onClose(); // Close modal after adding
    } catch (error) {
      message.error(error.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const updatedValues = { ...values };

      // If a new profile image is uploaded, include it
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append("profileImage", fileList[0].originFileObj);
        updatedValues.profileImage = formData.get("profileImage");
      }

      await updateUser(user.id, updatedValues, token);
      message.success("User updated successfully");
      onUserUpdated(); // Trigger refresh in parent component
      setIsEditing(false);
      setFileList([]); // Clear file list after successful update
    } catch (error) {
      message.error(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUser(user.id, token);
      message.success("User deleted successfully");
      onUserUpdated(); // Trigger refresh in parent component
      onClose(); // Close modal after deletion
    } catch (error) {
      message.error(error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/forget-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to initiate password reset"
        );
      }

      message.success("Password reset email sent successfully");
    } catch (error) {
      message.error(error.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isAddMode ? "Add New User" : isEditing ? "Edit User" : "View User"}
      open={visible}
      onCancel={() => {
        setIsEditing(false);
        setFileList([]);
        form.resetFields();
        onClose();
      }}
      footer={
        isAddMode
          ? [
              <Button key="cancel" onClick={onClose}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={() => form.submit()}
              >
                Add User
              </Button>,
            ]
          : isEditing
          ? [
              <Button key="cancel" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={() => form.submit()}
              >
                Save
              </Button>,
            ]
          : [
              <Button key="edit" onClick={() => setIsEditing(true)}>
                Edit
              </Button>,
              <Button
                key="reset"
                type="default"
                loading={loading}
                onClick={handleForgetPassword}
              >
                Reset Password
              </Button>,
              <Button
                key="delete"
                type="danger"
                loading={loading}
                onClick={handleDelete}
              >
                Delete
              </Button>,
              <Button key="close" onClick={onClose}>
                Close
              </Button>,
            ]
      }
    >
      {isAddMode || isEditing ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={isAddMode ? handleAdd : handleUpdate}
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
          {isAddMode && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="profileImage" label="Profile Image">
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto-upload
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload New Image</Button>
            </Upload>
            {!isAddMode && user?.profileImage && !fileList.length && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={user.profileImage}
                  alt="Current Profile"
                  style={{ width: 100, height: 100, borderRadius: "50%" }}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="vendor">Vendor</Option>
            </Select>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>Full Name:</strong> {user?.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {user?.phoneNumber || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {user?.address || "N/A"}
          </p>
          <p>
            <strong>Profile Image:</strong>{" "}
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                style={{ width: 100, height: 100, borderRadius: "50%" }}
              />
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>
      )}
    </Modal>
  );
};
