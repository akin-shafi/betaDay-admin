/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Button, Input, Form, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AssetModal = ({ visible, onClose, asset, onSubmit }) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(asset?.image || null);

  useEffect(() => {
    if (visible) {
      form.resetFields(); // Reset fields to avoid carrying over data
      if (asset) {
        form.setFieldsValue({
          caption: asset.caption,
          description: asset.description,
        });
        setPreviewImage(asset.image);
      } else {
        setPreviewImage(null);
      }
    }
  }, [visible, asset, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const assetData = { ...values, image: previewImage }; // Combine form values and image
        console.log("Submitting Asset Data:", assetData); // Debugging log
        onSubmit(assetData);
        onClose();
      })
      .catch((error) => {
        console.error("Validation Failed:", error);
        message.error("Please fill in all required fields.");
      });
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    return false; // Prevent upload
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {asset ? "Save Changes" : "Create Asset"}
        </Button>,
      ]}
      width={600}
    >
      <div className="flex flex-col md:flex-row items-center gap-4">
        {previewImage && (
          <img
            src={previewImage}
            alt="Asset Preview"
            className="w-full max-w-[200px] object-cover rounded-md mb-4 md:mb-0"
          />
        )}
        <Form
          form={form}
          layout="vertical"
          name="assetForm"
          initialValues={{
            caption: asset?.caption || "",
            description: asset?.description || "",
          }}
          className="w-full md:w-1/2"
        >
          <Form.Item
            label="Caption"
            name="caption"
            rules={[
              { required: true, message: "Please enter the asset caption!" },
            ]}
          >
            <Input placeholder="Enter asset caption" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter asset description" />
          </Form.Item>

          <Form.Item label="Upload Image">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleImageUpload}
            >
              {previewImage ? (
                <Button type="text">Replace Image</Button>
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AssetModal;
