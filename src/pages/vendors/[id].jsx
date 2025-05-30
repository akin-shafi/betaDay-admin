/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchBusinessById,
  updateBusiness,
  deleteBusiness,
} from "@/hooks/useBusiness";
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
  createSingleProduct,
  createMultipleProducts,
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
  Search,
} from "lucide-react";
import { updateProductImage } from "@/hooks/useProduct";
import EditBusinessModal from "@/components/modals/EditBusinessModal";
import DeleteBusinessModal from "@/components/modals/DeleteBusinessModal";
import BusinessImageModal from "@/components/modals/BusinessImageModal";
import EditProductModal from "@/components/modals/EditProductModal";
import DeleteProductModal from "@/components/modals/DeleteProductModal";
import ProductImageModal from "@/components/modals/ProductImageModal";
import AddSingleProductModal from "@/components/modals/AddSingleProductModal";
import AddMultipleProductsModal from "@/components/modals/AddMultipleProductsModal";

const CURRENCY_OPTIONS = [
  { label: "Naira (₦)", value: "Naira" },
  { label: "Dollar ($)", value: "Dollar" },
  { label: "Euro (€)", value: "Euro" },
  { label: "Pound (£)", value: "Pound" },
];

export default function VendorDetailsPage() {
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
  const [isProductImageEditModalVisible, setIsProductImageEditModalVisible] =
    useState(false);
  const [productImageForm] = Form.useForm();
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [isAddSingleProductModalVisible, setIsAddSingleProductModalVisible] =
    useState(false);
  const [
    isAddMultipleProductsModalVisible,
    setIsAddMultipleProductsModalVisible,
  ] = useState(false);
  const [addSingleProductForm] = Form.useForm();
  const [addMultipleProductsForm] = Form.useForm();

  useEffect(() => {
    const getBusiness = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchBusinessById(id, session?.token);
        setBusiness(response.business);
        form.setFieldsValue({
          ...response.business,
          deliveryOptions: response.business.deliveryOptions || [],
          businessType: response.business.businessType || "",
          categories: response.business.categories || [],
          priceRange: response.business.priceRange || "",
          deliveryTimeRange: response.business.deliveryTimeRange || "",
          rating: response.business.rating || "0.0",
          totalRatings: response.business.totalRatings || 0,
        });
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
        // Fallback filter in case fetchProducts doesn't filter by businessId server-side
        const filteredProducts = Array.isArray(data)
          ? data.filter((product) => product.businessId === id)
          : [];
        setProducts(filteredProducts);
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
      navigate("/vendors");
    } catch (err) {
      message.error(err.message || "Failed to delete business");
    }
  };

  const handleEditProduct = async (values) => {
    try {
      await updateProduct(selectedProduct.id, values, session?.token);
      message.success("Product updated successfully");
      setIsProductEditModalVisible(false);
      const data = await fetchProducts(session.token, id);
      const filteredProducts = Array.isArray(data)
        ? data.filter((product) => product.businessId === id)
        : [];
      setProducts(filteredProducts);
    } catch (err) {
      message.error(err.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId, session?.token);
      message.success("Product deleted successfully");
      setIsProductDeleteModalVisible(false);
      const data = await fetchProducts(session.token, id);
      const filteredProducts = Array.isArray(data)
        ? data.filter((product) => product.businessId === id)
        : [];
      setProducts(filteredProducts);
    } catch (err) {
      message.error(err.message || "Failed to delete product");
    }
  };

  const openEditProductModal = (product) => {
    setSelectedProduct(product);
    setSelectedCurrency(product.currency || "Naira");
    productForm.setFieldsValue({
      ...product,
      categories: product.categories?.map((cat) => cat.id) || [],
      options: product.options ? JSON.stringify(product.options) : "",
    });
    setIsProductEditModalVisible(true);
  };

  const openDeleteProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductDeleteModalVisible(true);
  };

  const handleImageUpdate = async (values) => {
    try {
      await updateBusinessImage(id, values.image, session?.token);
      setIsImageEditModalVisible(false);
      setImagePreview(null);
      const response = await fetchBusinessById(id, session?.token);
      setBusiness(response.business);
      message.success("Business image updated successfully");
    } catch (err) {
      console.error("Error in handleImageUpdate:", err);
      message.error(err.message || "Failed to update business image");
    }
  };

  const beforeImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }
    return false;
  };

  const handleImageChange = (info) => {
    if (info.file) {
      const file = info.file;
      setImagePreview(URL.createObjectURL(file));
      imageForm.setFieldsValue({ image: file });
    }
  };

  const handleProductImageUpdate = async (values) => {
    try {
      await updateProductImage(
        selectedProduct.id,
        values.image,
        session?.token
      );
      setIsProductImageEditModalVisible(false);
      setProductImagePreview(null);
      const data = await fetchProducts(session.token, id);
      const filteredProducts = Array.isArray(data)
        ? data.filter((product) => product.businessId === id)
        : [];
      setProducts(filteredProducts);
      message.success("Product image updated successfully");
    } catch (err) {
      console.error("Error in handleProductImageUpdate:", err);
      message.error(err.message || "Failed to update product image");
    }
  };

  const beforeProductImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }
    return false;
  };

  const handleProductImageChange = (info) => {
    if (info.file) {
      const file = info.file;
      setProductImagePreview(URL.createObjectURL(file));
      productImageForm.setFieldsValue({ image: file });
    }
  };

  const openProductImageEditModal = (product) => {
    setSelectedProduct(product);
    setProductImagePreview(product.image);
    productImageForm.setFieldsValue({ image: product.image });
    setIsProductImageEditModalVisible(true);
  };

  const handleAddSingleProduct = async (values) => {
    try {
      const data = { ...values, businessId: id };
      await createSingleProduct(data, values.image, session?.token);
      message.success("Product created successfully");
      setIsAddSingleProductModalVisible(false);
      addSingleProductForm.resetFields();
      setProductImagePreview(null);
      const dataProducts = await fetchProducts(session.token, id);
      const filteredProducts = Array.isArray(dataProducts)
        ? dataProducts.filter((product) => product.businessId === id)
        : [];
      setProducts(filteredProducts);
    } catch (err) {
      message.error(err.message || "Failed to create product");
    }
  };

  const handleAddMultipleProducts = async (values) => {
    try {
      const products = values.products.map((product) => ({
        ...product,
        businessId: id,
      }));
      const images = values.products.map((product) => product.image || null);
      await createMultipleProducts(products, images, session?.token);
      message.success("Products created successfully");
      setIsAddMultipleProductsModalVisible(false);
      addMultipleProductsForm.resetFields();
      setProductImagePreview(null);
      const data = await fetchProducts(session.token, id);
      const filteredProducts = Array.isArray(data)
        ? data.filter((product) => product.businessId === id)
        : [];
      setProducts(filteredProducts);
    } catch (err) {
      message.error(err.message || "Failed to create products");
    }
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesCategory =
        !selectedCategory ||
        (Array.isArray(product.categories) &&
          product.categories.some((cat) => cat.name === selectedCategory));
      const matchesPrice =
        parseFloat(product.price) >= priceRange.min &&
        parseFloat(product.price) <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  const getUniqueCategories = () => {
    const allCategories = products
      .flatMap((product) =>
        Array.isArray(product.categories)
          ? product.categories.map((cat) => cat.name)
          : []
      )
      .filter(Boolean);
    return [...new Set(allCategories)];
  };

  const productColumns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image, record) => (
        <div className="flex flex-col items-center space-y-1">
          <Image
            src={image || "https://via.placeholder.com/50"}
            alt="Product"
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <Button
            type="text"
            size="small"
            icon={<Camera size={12} />}
            onClick={() => openProductImageEditModal(record)}
            className="text-xs"
          >
            Edit
          </Button>
        </div>
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
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => (
        <Space wrap>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <Tag
                key={category.id || category.name}
                color="blue"
                className="text-xs"
              >
                {category.name}
              </Tag>
            ))
          ) : (
            <Tag color="default" className="text-xs">
              None
            </Tag>
          )}
        </Space>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, record) => {
        const currencySymbol =
          CURRENCY_OPTIONS.find(
            (c) => c.value === selectedCurrency
          )?.label.split(" ")[0] || "₦";
        return (
          <span className="text-sm">
            {currencySymbol}
            {parseFloat(price).toFixed(2)}
          </span>
        );
      },
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: "Availability",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable) => (
        <Tag color={isAvailable ? "success" : "error"} className="text-xs">
          {isAvailable ? "In Stock" : "Out of Stock"}
        </Tag>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"} className="text-xs">
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Product">
            <Button
              type="text"
              icon={<Edit size={14} />}
              onClick={() => openEditProductModal(record)}
              className="text-xs"
            />
          </Tooltip>
          <Tooltip title="Delete Product">
            <Button
              type="text"
              danger
              icon={<Delete size={14} />}
              onClick={() => openDeleteProductModal(record)}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <th key={i} className="px-6 py-3">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
                      {[1, 2, 3, 4, 5, 6].map((cell) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          Error loading business: {error.message}
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Business not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/vendors">
            <Button icon={<ArrowLeft size={16} />} className="text-sm">
              Back to Businesses
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Business Details
          </h1>
        </div>
        <Space>
          <Button
            type="primary"
            onClick={() => setIsEditModalVisible(true)}
            className="text-sm bg-gray-900 hover:bg-[#ff6600]"
          >
            Edit Business
          </Button>
          <Button
            danger
            onClick={() => setIsDeleteModalVisible(true)}
            className="text-sm"
          >
            Delete Business
          </Button>
        </Space>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group mx-auto sm:mx-0">
              <img
                src={business.image || "https://via.placeholder.com/150"}
                alt={business.name}
                className="w-24 sm:w-32 h-24 sm:h-32 rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button
                  type="text"
                  icon={<Camera size={20} className="text-white" />}
                  onClick={() => {
                    imageForm.setFieldsValue({ image: business.image });
                    setIsImageEditModalVisible(true);
                  }}
                  className="text-white hover:text-white hover:bg-white/20 text-sm"
                >
                  Change Image
                </Button>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                {business.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4 mb-4">
                <Tag
                  color={business.isActive ? "success" : "error"}
                  className="text-xs"
                >
                  {business.isActive ? "Active" : "Inactive"}
                </Tag>
                <div className="flex items-center text-gray-500 text-sm">
                  <span className="mr-1">★</span>
                  <span>{business.rating || "0.0"}</span>
                  <span className="ml-1">
                    ({business.totalRatings || 0} ratings)
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                {business.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {business.categories ? (
                  <Tag color="purple" className="text-xs">
                    {business.categories}
                  </Tag>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
        <Card title="Contact Information">
          <Descriptions column={1}>
            <Descriptions.Item label="Phone">
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                {business.contactNumber}
              </div>
            </Descriptions.Item>
            {business.website && (
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
            )}
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
        <Card title="Delivery Options" className="lg:col-span-2">
          <Space wrap>
            {business.deliveryOptions?.map((option, index) => (
              <Tag key={index} color="blue">
                {option}
              </Tag>
            ))}
          </Space>
        </Card>
        <Card title="Additional Information">
          <Descriptions column={1}>
            <Descriptions.Item label="Price Range">
              {business.priceRange || "Not specified"}
            </Descriptions.Item>
            <Descriptions.Item label="Delivery Time Range">
              {business.deliveryTimeRange || "Not specified"}
            </Descriptions.Item>
            <Descriptions.Item label="Rating">
              {business.rating || "0.0"} ({business.totalRatings || 0} ratings)
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
      <Card title="Business Statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-semibold text-primary">
              {business.totalRatings || 0}
            </div>
            <div className="text-gray-500">Total Ratings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-primary">
              {business.deliveryOptions?.length || 0}
            </div>
            <div className="text-gray-500">Delivery Options</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-primary">
              {business.categories ? 1 : 0}
            </div>
            <div className="text-gray-500">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-primary">
              {products.length}
            </div>
            <div className="text-gray-500">Total Products</div>
          </div>
        </div>
      </Card>
      <Card
        title={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-lg sm:text-xl">Products</span>
            <Space>
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => setIsAddSingleProductModalVisible(true)}
                className="text-sm bg-gray-900 hover:bg-[#ff6600]"
              >
                Add Single Product
              </Button>
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => setIsAddMultipleProductsModalVisible(true)}
                className="text-sm bg-gray-900 hover:bg-[#ff6600]"
              >
                Add Multiple Products
              </Button>
            </Space>
          </div>
        }
      >
        <div className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search products..."
              prefix={<Search size={16} className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-xs"
            />
            <Select
              placeholder="Filter by category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
              style={{ width: "300px" }}
            >
              {getUniqueCategories().map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
            <div className="flex items-center gap-2">
              <InputNumber
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(value) =>
                  setPriceRange({ ...priceRange, min: value })
                }
                className="max-w-[120px]"
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
              <span className="text-gray-400">-</span>
              <InputNumber
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(value) =>
                  setPriceRange({ ...priceRange, max: value })
                }
                className="max-w-[120px]"
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
            </div>
            <Button
              onClick={() => {
                setSearchText("");
                setSelectedCategory("");
                setPriceRange({ min: 0, max: 1000000 });
              }}
              className="text-sm"
            >
              Reset Filters
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchText && (
              <Tag closable onClose={() => setSearchText("")}>
                Search: {searchText}
              </Tag>
            )}
            {selectedCategory && (
              <Tag closable onClose={() => setSelectedCategory("")}>
                Category: {selectedCategory}
              </Tag>
            )}
            {(priceRange.min > 0 || priceRange.max < 1000000) && (
              <Tag
                closable
                onClose={() => setPriceRange({ min: 0, max: 1000000 })}
              >
                Price: {priceRange.min} - {priceRange.max}
              </Tag>
            )}
          </div>
        </div>
        <Table
          columns={productColumns}
          dataSource={getFilteredProducts()}
          rowKey="id"
          loading={isProductsLoading}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} products`,
            responsive: true,
            size: "small",
          }}
          scroll={{ x: true }}
          size="small"
        />
      </Card>
      <EditBusinessModal
        isVisible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onFinish={handleEdit}
        business={business}
        form={form}
      />
      <DeleteBusinessModal
        isVisible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        businessName={business?.name}
      />
      <EditProductModal
        isVisible={isProductEditModalVisible}
        onCancel={() => setIsProductEditModalVisible(false)}
        onFinish={handleEditProduct}
        product={selectedProduct}
        form={productForm}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />
      <DeleteProductModal
        isVisible={isProductDeleteModalVisible}
        onCancel={() => setIsProductDeleteModalVisible(false)}
        onOk={() => handleDeleteProduct(selectedProduct?.id)}
        productName={selectedProduct?.name}
      />
      <BusinessImageModal
        isVisible={isImageEditModalVisible}
        onCancel={() => setIsImageEditModalVisible(false)}
        onFinish={handleImageUpdate}
        business={business}
        form={imageForm}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
      <ProductImageModal
        isVisible={isProductImageEditModalVisible}
        onCancel={() => setIsProductImageEditModalVisible(false)}
        onFinish={handleProductImageUpdate}
        product={selectedProduct}
        form={productImageForm}
        imagePreview={productImagePreview}
        setImagePreview={setProductImagePreview}
      />
      <AddSingleProductModal
        isVisible={isAddSingleProductModalVisible}
        onCancel={() => {
          setIsAddSingleProductModalVisible(false);
          addSingleProductForm.resetFields();
          setProductImagePreview(null);
        }}
        onFinish={handleAddSingleProduct}
        form={addSingleProductForm}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        imagePreview={productImagePreview}
        setImagePreview={setProductImagePreview}
      />
      <AddMultipleProductsModal
        isVisible={isAddMultipleProductsModalVisible}
        onCancel={() => {
          setIsAddMultipleProductsModalVisible(false);
          addMultipleProductsForm.resetFields();
          setProductImagePreview(null);
        }}
        onFinish={handleAddMultipleProducts}
        form={addMultipleProductsForm}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />
    </div>
  );
}
