/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchSubGroups,
  createSubGroup,
  updateSubGroup,
  deactivateSubGroup,
} from "@/hooks/useSubGroups";
import { useSession } from "@/hooks/useSession";
import {
  Button,
  Card,
  Table,
  Space,
  Spin,
  Modal,
  Form,
  Input,
  message,
  Image,
  Tooltip,
  Upload,
  Switch,
} from "antd";
import {
  Plus,
  Edit,
  Delete,
  Upload as UploadIcon,
  ArrowLeft,
} from "lucide-react";

export default function SubGroupsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const [subGroups, setSubGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSubGroup, setSelectedSubGroup] = useState(null);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const getSubGroups = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSubGroups(groupId, session?.token);
        setSubGroups(data);
      } catch (err) {
        message.error("Failed to fetch subgroups");
        console.error("Error fetching subgroups:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token && groupId) {
      getSubGroups();
    }
  }, [session?.token, groupId]);

  const handleCreateSubGroup = async (values) => {
    try {
      const subGroup = await createSubGroup(
        groupId,
        { name: values.name, image: values.image },
        session?.token
      );
      message.success("Subgroup created successfully");
      setIsCreateModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      setSubGroups([...subGroups, subGroup]);
    } catch (err) {
      message.error(err.message || "Failed to create subgroup");
    }
  };

  const handleEditSubGroup = async (values) => {
    try {
      const updatedSubGroup = await updateSubGroup(
        selectedSubGroup.id,
        { name: values.name, image: values.image, isActive: values.isActive },
        session?.token
      );
      message.success("Subgroup updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      setSubGroups(
        subGroups.map((sg) =>
          sg.id === updatedSubGroup.id ? updatedSubGroup : sg
        )
      );
    } catch (err) {
      message.error(err.message || "Failed to update subgroup");
    }
  };

  const handleDeactivateSubGroup = async (subGroupId) => {
    try {
      await deactivateSubGroup(subGroupId, session?.token);
      message.success("Subgroup deactivated successfully");
      setSubGroups(subGroups.filter((sg) => sg.id !== subGroupId));
    } catch (err) {
      message.error(err.message || "Failed to deactivate subgroup");
    }
  };

  const openEditModal = (subGroup) => {
    setSelectedSubGroup(subGroup);
    form.setFieldsValue({
      name: subGroup.name,
      image: subGroup.image,
      isActive: subGroup.isActive,
    });
    setImagePreview(subGroup.image);
    setIsEditModalVisible(true);
  };

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
    return false;
  };

  const handleImageChange = (info) => {
    if (info.file) {
      const file = info.file;
      setImagePreview(URL.createObjectURL(file));
      form.setFieldsValue({ image: file });
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image) => (
        <Image
          src={image || "https://via.placeholder.com/50"}
          alt="Subgroup"
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="text-sm">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span
          className={`text-sm ${isActive ? "text-green-600" : "text-red-600"}`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Subgroup">
            <Button
              type="text"
              icon={<Edit size={14} />}
              onClick={() => openEditModal(record)}
              className="text-xs"
            />
          </Tooltip>
          <Tooltip title="Deactivate Subgroup">
            <Button
              type="text"
              danger
              icon={<Delete size={14} />}
              onClick={() => handleDeactivateSubGroup(record.id)}
              className="text-xs"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[1, 2, 3, 4].map((i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    {[1, 2, 3, 4].map((cell) => (
                      <td key={cell} className="px-6 py-4">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/groups">
            <Button icon={<ArrowLeft size={16} />} className="text-sm">
              Back to Groups
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Subgroups Management
          </h1>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateModalVisible(true)}
          className="text-sm bg-gray-900 hover:bg-[#ff6600]"
        >
          Add Subgroup
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={subGroups}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} subgroups`,
          }}
          scroll={{ x: true }}
          size="small"
        />
      </Card>

      {/* Create Subgroup Modal */}
      <Modal
        title="Create New Subgroup"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
          setImagePreview(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubGroup}>
          <Form.Item
            name="name"
            label="Subgroup Name"
            rules={[
              { required: true, message: "Please enter a subgroup name" },
            ]}
          >
            <Input placeholder="Enter subgroup name" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Subgroup Image"
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              listType="picture"
              beforeUpload={beforeImageUpload}
              onChange={handleImageChange}
              maxCount={1}
              showUploadList={false}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <Button icon={<UploadIcon size={16} />}>Upload Image</Button>
              )}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-gray-900 hover:bg-[#ff6600]"
            >
              Create Subgroup
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Subgroup Modal */}
      <Modal
        title="Edit Subgroup"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
          setImagePreview(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubGroup}>
          <Form.Item
            name="name"
            label="Subgroup Name"
            rules={[
              { required: true, message: "Please enter a subgroup name" },
            ]}
          >
            <Input placeholder="Enter subgroup name" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Subgroup Image"
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              listType="picture"
              beforeUpload={beforeImageUpload}
              onChange={handleImageChange}
              maxCount={1}
              showUploadList={false}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <Button icon={<UploadIcon size={16} />}>Upload Image</Button>
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              className="bg-gray-200"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-gray-900 hover:bg-[#ff6600]"
            >
              Update Subgroup
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
