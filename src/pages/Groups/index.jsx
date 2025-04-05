/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchGroups,
  createGroup,
  updateGroup,
  deactivateGroup,
} from "@/hooks/useGroups";
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
} from "antd";
import {
  Plus,
  Edit,
  Delete,
  Camera,
  Upload as UploadIcon,
  Eye,
} from "lucide-react";

export default function GroupsPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const getGroups = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGroups(session?.token);
        setGroups(data);
      } catch (err) {
        message.error("Failed to fetch groups");
        console.error("Error fetching groups:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      getGroups();
    }
  }, [session?.token]);

  const handleCreateGroup = async (values) => {
    try {
      const group = await createGroup(
        { name: values.name, image: values.image },
        session?.token
      );
      message.success("Group created successfully");
      setIsCreateModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      setGroups([...groups, group]);
    } catch (err) {
      message.error(err.message || "Failed to create group");
    }
  };

  const handleEditGroup = async (values) => {
    try {
      const updatedGroup = await updateGroup(
        selectedGroup.id,
        { name: values.name, image: values.image },
        session?.token
      );
      message.success("Group updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      setGroups(
        groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
      );
    } catch (err) {
      message.error(err.message || "Failed to update group");
    }
  };

  const handleDeactivateGroup = async (groupId) => {
    try {
      await deactivateGroup(groupId, session?.token);
      message.success("Group deactivated successfully");
      setGroups(groups.filter((g) => g.id !== groupId));
    } catch (err) {
      message.error(err.message || "Failed to deactivate group");
    }
  };

  const openEditModal = (group) => {
    setSelectedGroup(group);
    form.setFieldsValue({ name: group.name, image: group.image });
    setImagePreview(group.image);
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
          alt="Group"
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
      title: "Subgroups",
      dataIndex: "subGroups",
      key: "subGroups",
      render: (subGroups, record) => (
        <Link to={`/groups/${record.id}/subgroups`}>
          <span className="text-sm text-blue-600 hover:underline">
            {subGroups.length} (View)
          </span>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span className={`text-sm ${isActive ? "text-green-600" : "text-red-600"}`}>
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
          <Tooltip title="Edit Group">
            <Button
              type="text"
              icon={<Edit size={14} />}
              onClick={() => openEditModal(record)}
              className="text-xs"
            />
          </Tooltip>
          <Tooltip title="Deactivate Group">
            <Button
              type="text"
              danger
              icon={<Delete size={14} />}
              onClick={() => handleDeactivateGroup(record.id)}
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
                  {[1, 2, 3, 4, 5].map((i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    {[1, 2, 3, 4, 5].map((cell) => (
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
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Groups Management
        </h1>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateModalVisible(true)}
          className="text-sm bg-gray-900 hover:bg-[#ff6600]"
        >
          Add Group
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={groups}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} groups`,
          }}
          scroll={{ x: true }}
          size="small"
        />
      </Card>

      {/* Create Group Modal */}
      <Modal
        title="Create New Group"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
          setImagePreview(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateGroup}>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: "Please enter a group name" }]}
          >
            <Input placeholder="Enter group name" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Group Image"
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
              Create Group
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Group Modal */}
      <Modal
        title="Edit Group"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
          setImagePreview(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditGroup}>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: "Please enter a group name" }]}
          >
            <Input placeholder="Enter group name" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Group Image"
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
              Update Group
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}