/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message, Upload } from "antd";
import { updateUser, deleteUser } from "../../hooks/useAction";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

export const UserModal = ({ visible, user, onClose, token, onUserUpdated }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user?.role || "user");

  const isAddMode = !user;

  const initialValues = isAddMode
    ? { role: "user" }
    : {
        fullName: user?.fullName,
        email: user?.email,
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        profileImage: user?.profileImage || "",
        role: user?.role,
        business: user?.business?.id,
      };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/businesses/names`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch businesses");
        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        message.error(error.message || "Could not load businesses");
      }
    };

    if (visible) {
      fetchBusinesses();
      form.setFieldsValue(initialValues);
      setSelectedRole(user?.role || "user");
    }
  }, [visible, token, form, user]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleAdd = async (values) => {
    try {
      setLoading(true);
      const newUserData = { ...values };

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
      onUserUpdated();
      form.resetFields();
      setFileList([]);
      onClose();
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

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append("profileImage", fileList[0].originFileObj);
        updatedValues.profileImage = formData.get("profileImage");
      }

      await updateUser(user.id, updatedValues, token);
      message.success("User updated successfully");
      onUserUpdated();
      setIsEditing(false);
      setFileList([]);
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
      onUserUpdated();
      onClose();
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

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    if (value !== "vendor") {
      form.setFieldsValue({ business: undefined });
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
        setSelectedRole("user");
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
      className="user-modal"
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
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                },
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
              beforeUpload={() => false}
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
            <Select onChange={handleRoleChange}>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="vendor">Vendor</Option>
            </Select>
          </Form.Item>
          {selectedRole === "vendor" && (
            <Form.Item
              name="business"
              label="Business"
              rules={[{ required: true, message: "Please select a business" }]}
            >
              <Select placeholder="Select a business">
                {businesses.map((biz) => (
                  <Option key={biz.id} value={biz.id}>
                    {biz.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      ) : (
        <div>
          <p>
            <strong>Full Name:</strong> {user?.fullName || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
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
            <strong>Role:</strong> {user?.role || "N/A"}
          </p>
          <p>
            <strong>Business:</strong> {user?.business?.name || "N/A"}
          </p>
        </div>
      )}
    </Modal>
  );
};
