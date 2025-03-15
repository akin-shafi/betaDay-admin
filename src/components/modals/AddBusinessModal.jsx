/* eslint-disable react/prop-types */
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Upload,
  message,
} from "antd";
import { Upload as UploadIcon } from "lucide-react";

export default function AddBusinessModal({
  isVisible,
  onCancel,
  onFinish,
  form,
  imagePreview,
  setImagePreview,
}) {
  const beforeImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    return false; // Prevent default upload behavior
  };

  const handleImageChange = (info) => {
    if (info.file) {
      setImagePreview(URL.createObjectURL(info.file));
      form.setFieldsValue({ image: info.file });
    }
  };

  return (
    <Modal
      title="Add New Business"
      open={isVisible}
      onCancel={() => {
        onCancel();
        setImagePreview(null);
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isActive: true,
          deliveryOptions: [],
          categories: [],
        }}
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

          <Form.Item
            name="image"
            label="Business Image"
            rules={[
              {
                required: true,
                message: "Please upload or enter an image URL",
              },
            ]}
          >
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <img
                  src={imagePreview || "https://via.placeholder.com/150"}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
              <Upload
                name="image"
                listType="picture"
                className="image-uploader"
                showUploadList={false}
                beforeUpload={beforeImageUpload}
                onChange={handleImageChange}
                maxCount={1}
                customRequest={({ onSuccess }) => {
                  onSuccess();
                }}
              >
                <Button icon={<UploadIcon size={16} />}>Select Image</Button>
              </Upload>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              <Input
                placeholder="Enter image URL"
                onChange={(e) => {
                  const newUrl = e.target.value;
                  if (newUrl) {
                    setImagePreview(newUrl);
                    form.setFieldsValue({ image: newUrl });
                  }
                }}
              />
            </div>
          </Form.Item>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={() => {
              onCancel();
              setImagePreview(null);
            }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Create Business
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
