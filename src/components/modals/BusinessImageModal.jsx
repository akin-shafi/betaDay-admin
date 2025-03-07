import { Modal, Form, Input, Button, Upload, message } from "antd";
import { Upload as UploadIcon } from "lucide-react";

export default function BusinessImageModal({
  isVisible,
  onCancel,
  onFinish,
  business,
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
      title="Update Business Image"
      open={isVisible}
      onCancel={() => {
        onCancel();
        setImagePreview(null);
      }}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ image: business?.image }}
      >
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <img
              src={
                imagePreview ||
                business?.image ||
                "https://via.placeholder.com/150"
              }
              alt="Preview"
              className="w-32 h-32 rounded-lg object-cover"
            />
          </div>
          <Form.Item
            name="image"
            label="Image"
            rules={[
              {
                required: true,
                message: "Please upload or enter an image URL",
              },
            ]}
          >
            <div className="space-y-4">
              <Upload
                name="image"
                listType="picture"
                className="image-uploader"
                showUploadList={false}
                beforeUpload={beforeImageUpload}
                onChange={handleImageChange}
                maxCount={1}
                customRequest={({ file, onSuccess }) => {
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
            Update Image
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
