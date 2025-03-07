/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  fetchBusinessById,
  updateBusiness,
  deleteBusiness,
} from "@/hooks/useBusiness";
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
} from "@/hooks/useProduct";
import { updateBusinessImage } from "@/hooks/useBusinessImage";
import { useSession } from "@/hooks/useSession";
import {
  Button,
  Card,
  Tag,
  Space,
  Descriptions,
  Divider,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Table,
  Image,
  Tooltip,
  InputNumber,
  Upload,
} from "antd";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Edit,
  Delete,
  Plus,
  Camera,
  Upload as UploadIcon,
} from "lucide-react";

// Update currency options to match backend format
const CURRENCY_OPTIONS = [
  { label: "Naira (₦)", value: "Naira" },
  { label: "Dollar ($)", value: "Dollar" },
  { label: "Euro (€)", value: "Euro" },
  { label: "Pound (£)", value: "Pound" },
];

export default function BusinessViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isProductEditModalVisible, setIsProductEditModalVisible] =
    useState(false);
  const [isProductDeleteModalVisible, setIsProductDeleteModalVisible] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const [selectedCurrency, setSelectedCurrency] = useState("Naira");
  const [isImageEditModalVisible, setIsImageEditModalVisible] = useState(false);
  const [imageForm] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const getBusiness = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchBusinessById(id, session?.token);
        setBusiness(response.business);
        // Set form values when business data is loaded
        form.setFieldsValue(response.business);
      } catch (err) {
        setError(err);
        console.error("Error fetching business:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token && id) {
      getBusiness();
    }
  }, [session?.token, id, form]);

  useEffect(() => {
    const getProducts = async () => {
      if (!id || !session?.token) return;

      try {
        setIsProductsLoading(true);
        const data = await fetchProducts(session.token, id);
        setProducts(data);
      } catch (err) {
        message.error("Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setIsProductsLoading(false);
      }
    };

    getProducts();
  }, [id, session?.token]);

  const handleEdit = async (values) => {
    try {
      await updateBusiness(id, values, session?.token);
      message.success("Business updated successfully");
      setIsEditModalVisible(false);
      // Refresh business data
      const response = await fetchBusinessById(id, session?.token);
      setBusiness(response.business);
    } catch (err) {
      message.error(err.message || "Failed to update business");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBusiness(id, session?.token);
      message.success("Business deleted successfully");
      navigate("/businesses");
    } catch (err) {
      message.error(err.message || "Failed to delete business");
    }
  };

  const handleEditProduct = async (values) => {
    try {
      await updateProduct(selectedProduct.id, values, session?.token);
      message.success("Product updated successfully");
      setIsProductEditModalVisible(false);
      // Refresh products list
      const data = await fetchProducts(session.token, id);
      setProducts(data);
    } catch (err) {
      message.error(err.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId, session?.token);
      message.success("Product deleted successfully");
      setIsProductDeleteModalVisible(false);
      // Refresh products list
      const data = await fetchProducts(session.token, id);
      setProducts(data);
    } catch (err) {
      message.error(err.message || "Failed to delete product");
    }
  };

  const openEditProductModal = (product) => {
    setSelectedProduct(product);
    // Set the selected currency when opening the modal
    setSelectedCurrency(product.currency || "Naira");
    productForm.setFieldsValue(product);
    setIsProductEditModalVisible(true);
  };

  const openDeleteProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductDeleteModalVisible(true);
  };

  const handleImageUpdate = async (values) => {
    try {
      console.log("Starting image update in component...");
      console.log("Form values:", values);

      await updateBusinessImage(id, values.image, session?.token);
      setIsImageEditModalVisible(false);
      setImagePreview(null);
      // Refresh business data
      const response = await fetchBusinessById(id, session?.token);
      setBusiness(response.business);
    } catch (err) {
      console.error("Error in handleImageUpdate:", err);
      message.error(err.message || "Failed to update business image");
    }
  };

  const beforeImageUpload = (file) => {
    console.log("Validating image file...");
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

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
    console.log("Image change event:", info);
    if (info.file) {
      const file = info.file;
      console.log("Selected file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      setImagePreview(URL.createObjectURL(file));
      imageForm.setFieldsValue({ image: file });
    }
  };

  // Products table columns
  const productColumns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image) => (
        <Image
          src={image || "https://via.placeholder.com/50"}
          alt="Product"
          width={50}
          height={50}
          className="rounded-md object-cover"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, record) => {
        const currencySymbol =
          CURRENCY_OPTIONS.find(
            (c) => c.value === record.currency
          )?.label.split(" ")[0] || "₦";
        return `${currencySymbol}${price.toFixed(2)}`;
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <Tag color={stock > 10 ? "success" : stock > 0 ? "warning" : "error"}>
          {stock}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Product">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => openEditProductModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Product">
            <Button
              type="text"
              danger
              icon={<Delete size={16} />}
              onClick={() => openDeleteProductModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">
            Error loading business: {error.message}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!business) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Business not found</div>
        </div>
      </DashboardLayout>
    );
  }

  // Convert delivery options string to array
  const deliveryOptions = business.deliveryOptions?.split(",") || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/businesses">
              <Button icon={<ArrowLeft size={16} />}>Back to Businesses</Button>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">
              Business Details
            </h1>
          </div>
          <Space>
            <Button type="primary" onClick={() => setIsEditModalVisible(true)}>
              Edit Business
            </Button>
            <Button danger onClick={() => setIsDeleteModalVisible(true)}>
              Delete Business
            </Button>
          </Space>
        </div>

        {/* Business Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information Card */}
          <Card className="lg:col-span-2">
            <div className="flex items-start space-x-6">
              <div className="relative group">
                <img
                  src={business.image || "https://via.placeholder.com/150"}
                  alt={business.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    type="text"
                    icon={<Camera size={24} className="text-white" />}
                    onClick={() => {
                      imageForm.setFieldsValue({ image: business.image });
                      setIsImageEditModalVisible(true);
                    }}
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    Change Image
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {business.name}
                </h2>
                <div className="flex items-center space-x-4 mb-4">
                  <Tag color={business.isActive ? "success" : "error"}>
                    {business.isActive ? "Active" : "Inactive"}
                  </Tag>
                  <div className="flex items-center text-gray-500">
                    <span className="mr-1">★</span>
                    <span>{business.avgRating}</span>
                    <span className="ml-1">
                      ({business.ratingCount} ratings)
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{business.description}</p>
                <div className="flex flex-wrap gap-2">
                  {business.categories?.map((category, index) => (
                    <Tag key={index} color="purple">
                      {category}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information Card */}
          <Card title="Contact Information">
            <Descriptions column={1}>
              <Descriptions.Item label="Phone">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  {business.contactNumber}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Website">
                <div className="flex items-center">
                  <Globe size={16} className="mr-2" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {business.website}
                  </a>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Operating Hours">
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  {business.openingTime} - {business.closingTime}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {business.address}
                  <br />
                  {business.city}, {business.state}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  {new Date(business.createdAt).toLocaleDateString()}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Delivery Options Card */}
          <Card title="Delivery Options" className="lg:col-span-2">
            <Space wrap>
              {deliveryOptions.map((option, index) => (
                <Tag key={index} color="blue">
                  {option}
                </Tag>
              ))}
            </Space>
          </Card>

          {/* Additional Information Card */}
          <Card title="Additional Information">
            <Descriptions column={1}>
              <Descriptions.Item label="Price Range">
                {business.priceRange || "Not specified"}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Time Range">
                {business.deliveryTimeRange || "Not specified"}
              </Descriptions.Item>
              <Descriptions.Item label="Average Rating">
                {business.avgRating} ({business.ratingCount} ratings)
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        {/* Statistics Section */}
        <Card title="Business Statistics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-semibold text-primary">
                {business.ratingCount || 0}
              </div>
              <div className="text-gray-500">Total Ratings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-primary">
                {deliveryOptions.length}
              </div>
              <div className="text-gray-500">Delivery Options</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-semibold text-primary">
                {business.categories?.length || 0}
              </div>
              <div className="text-gray-500">Categories</div>
            </div>
          </div>
        </Card>

        {/* Products Table Section */}
        <Card
          title={
            <div className="flex items-center justify-between">
              <span>Products</span>
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => navigate(`/products/create?businessId=${id}`)}
              >
                Add Product
              </Button>
            </div>
          }
        >
          <Table
            columns={productColumns}
            dataSource={products}
            rowKey="id"
            loading={isProductsLoading}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} products`,
            }}
            scroll={{ x: true }}
          />
        </Card>

        {/* Edit Modal */}
        <Modal
          title="Edit Business"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEdit}
            initialValues={business}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Business Name"
                rules={[
                  { required: true, message: "Please enter business name" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="contactNumber"
                label="Contact Number"
                rules={[
                  { required: true, message: "Please enter contact number" },
                ]}
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
                rules={[
                  { required: true, message: "Please enter opening time" },
                ]}
              >
                <Input type="time" />
              </Form.Item>

              <Form.Item
                name="closingTime"
                label="Closing Time"
                rules={[
                  { required: true, message: "Please enter closing time" },
                ]}
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
                rules={[
                  { required: true, message: "Please select categories" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select categories"
                  options={[
                    { label: "Restaurant", value: "Restaurant" },
                    { label: "Local Cuisine", value: "Local Cuisine" },
                    { label: "Fast Food", value: "Fast Food" },
                    { label: "Cafe", value: "Cafe" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Business"
          open={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
        >
          <p>
            Are you sure you want to delete this business? This action cannot be
            undone.
          </p>
        </Modal>

        {/* Product Edit Modal */}
        <Modal
          title="Edit Product"
          open={isProductEditModalVisible}
          onCancel={() => setIsProductEditModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            form={productForm}
            layout="vertical"
            onFinish={handleEditProduct}
            initialValues={selectedProduct}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Product Name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  placeholder="Select category"
                  options={[
                    { label: "Food", value: "Food" },
                    { label: "Beverages", value: "Beverages" },
                    { label: "Desserts", value: "Desserts" },
                    { label: "Snacks", value: "Snacks" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="currency"
                label="Currency"
                rules={[{ required: true, message: "Please select currency" }]}
                initialValue="Naira"
              >
                <Select
                  placeholder="Select currency"
                  options={CURRENCY_OPTIONS}
                  onChange={(value) => setSelectedCurrency(value)}
                />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  step={0.01}
                  formatter={(value) => {
                    const currencySymbol =
                      CURRENCY_OPTIONS.find(
                        (c) => c.value === selectedCurrency
                      )?.label.split(" ")[0] || "₦";
                    return `${currencySymbol} ${value}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    );
                  }}
                  parser={(value) => {
                    const currencySymbol =
                      CURRENCY_OPTIONS.find(
                        (c) => c.value === selectedCurrency
                      )?.label.split(" ")[0] || "₦";
                    return value.replace(
                      new RegExp(`\\${currencySymbol}\\s?|(,*)/g`),
                      ""
                    );
                  }}
                />
              </Form.Item>

              <Form.Item
                name="stock"
                label="Stock"
                rules={[{ required: true, message: "Please enter stock" }]}
              >
                <InputNumber className="w-full" min={0} />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true, message: "Please enter image URL" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button onClick={() => setIsProductEditModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Product Delete Modal */}
        <Modal
          title="Delete Product"
          open={isProductDeleteModalVisible}
          onOk={() => handleDeleteProduct(selectedProduct?.id)}
          onCancel={() => setIsProductDeleteModalVisible(false)}
        >
          <p>
            Are you sure you want to delete "{selectedProduct?.name}"? This
            action cannot be undone.
          </p>
        </Modal>

        {/* Image Edit Modal */}
        <Modal
          title="Update Business Image"
          open={isImageEditModalVisible}
          onCancel={() => {
            setIsImageEditModalVisible(false);
            setImagePreview(null);
          }}
          footer={null}
          width={500}
        >
          <Form
            form={imageForm}
            layout="vertical"
            onFinish={handleImageUpdate}
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
                      // This prevents the default upload behavior
                      onSuccess();
                    }}
                  >
                    <Button icon={<UploadIcon size={16} />}>
                      Select Image
                    </Button>
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
                        imageForm.setFieldsValue({ image: newUrl });
                      }
                    }}
                  />
                </div>
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={() => {
                  setIsImageEditModalVisible(false);
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
      </div>
    </DashboardLayout>
  );
}
