/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchMeals,
  createMeal,
  updateMeal,
  deleteMeal,
} from "@/hooks/useMeals";
import { useSession } from "@/hooks/useSession";
import {
  Button,
  Card,
  Table,
  Space,
  Modal,
  Form,
  Input,
  message,
  Select,
  Upload,
  Tooltip,
  Tabs,
} from "antd";
import {
  Plus,
  Edit,
  Delete,
  Upload as UploadIcon,
  ArrowLeft,
} from "lucide-react";

const { Option } = Select;
const { TabPane } = Tabs;

export default function MealsPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const getMeals = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMeals(session?.token);
        console.log("Fetched meals:", data);
        setMeals(data);
      } catch (err) {
        message.error("Failed to fetch meals");
        console.error("Error fetching meals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      getMeals();
    }
  }, [session?.token]);

  const handleCreateMeal = async (values) => {
    try {
      const meal = await createMeal(values, session?.token);
      message.success("Meal created successfully");
      setIsCreateModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      setMeals([...meals, meal]);
    } catch (err) {
      message.error(err.message || "Failed to create meal");
    }
  };

  const handleEditMeal = async (values) => {
    try {
      console.log("Editing meal with values:", values);
      const updatedMeal = await updateMeal(selectedMeal.id, values, session?.token);
      console.log("Updated meal response:", updatedMeal);
      message.success("Meal updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      setMeals((prevMeals) =>
        prevMeals.map((m) => (m.id === updatedMeal.id ? updatedMeal : m))
      );
    } catch (err) {
      message.error(err.message || "Failed to update meal");
      console.error("Error in handleEditMeal:", err);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await deleteMeal(mealId, session?.token);
      message.success("Meal deleted successfully");
      setMeals(meals.filter((m) => m.id !== mealId));
    } catch (err) {
      message.error(err.message || "Failed to delete meal");
    }
  };

  const openEditModal = (meal) => {
    setSelectedMeal(meal);
    form.setFieldsValue({
      name: meal.name,
      description: meal.description,
      price: meal.price,
      type: meal.type,
      image: meal.image ? meal.image : null,
    });
    setImagePreview(meal.image);
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
    return false; // Prevent automatic upload
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
        <img
          src={image || "https://via.placeholder.com/50"}
          alt="Meal"
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-sm">{text}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <span className="text-sm">₦{price.toLocaleString()}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Meal">
            <Button
              type="text"
              icon={<Edit size={14} />}
              onClick={() => openEditModal(record)}
              className="text-xs"
            />
          </Tooltip>
          <Tooltip title="Delete Meal">
            <Button
              type="text"
              danger
              icon={<Delete size={14} />}
              onClick={() => handleDeleteMeal(record.id)}
              className="text-xs"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Filter meals by type
  const breakfastMeals = meals.filter((meal) => meal.type === "breakfast");
  const lunchMeals = meals.filter((meal) => meal.type === "lunch");

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

  console.log("Rendering meals:", meals); // Debug current state

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button icon={<ArrowLeft size={16} />} className="text-sm">
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Meals Management
          </h1>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateModalVisible(true)}
          className="text-sm bg-gray-900 hover:bg-[#ff6600]"
        >
          Add Meal
        </Button>
      </div>

      <Card>
        <Tabs defaultActiveKey="breakfast">
          <TabPane tab="Breakfast" key="breakfast">
            <Table
              columns={columns}
              dataSource={breakfastMeals}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} breakfast meals`,
              }}
              scroll={{ x: true }}
              size="small"
            />
          </TabPane>
          <TabPane tab="Lunch" key="lunch">
            <Table
              columns={columns}
              dataSource={lunchMeals}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} lunch meals`,
              }}
              scroll={{ x: true }}
              size="small"
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Create Meal Modal */}
      <Modal
        title="Create New Meal"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
          setImagePreview(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateMeal}>
          <Form.Item
            name="name"
            label="Meal Name"
            rules={[{ required: true, message: "Please enter a meal name" }]}
          >
            <Input placeholder="Enter meal name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea placeholder="Enter meal description" rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (₦)"
            rules={[{ required: true, message: "Please enter a price" }]}
          >
            <Input type="number" placeholder="Enter price" min={0} step={100} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select a meal type" }]}
          >
            <Select placeholder="Select meal type">
              <Option value="breakfast">Breakfast</Option>
              <Option value="lunch">Lunch</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label="Meal Image"
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
              Create Meal
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Meal Modal */}
      <Modal
        title="Edit Meal"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
          setImagePreview(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditMeal}>
          <Form.Item
            name="name"
            label="Meal Name"
            rules={[{ required: true, message: "Please enter a meal name" }]}
          >
            <Input placeholder="Enter meal name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea placeholder="Enter meal description" rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (₦)"
            rules={[{ required: true, message: "Please enter a price" }]}
          >
            <Input type="number" placeholder="Enter price" min={0} step={100} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select a meal type" }]}
          >
            <Select placeholder="Select meal type">
              <Option value="breakfast">Breakfast</Option>
              <Option value="lunch">Lunch</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label="Meal Image"
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
              Update Meal
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}