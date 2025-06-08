/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { fetchBusinessById, updateBusiness, deleteBusiness } from "@/hooks/useBusiness"
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
  createSingleProduct,
  createMultipleProducts,
  updateProductImage, // Declared the variable here
} from "@/hooks/useProduct"
import { updateBusinessImage } from "@/hooks/useBusinessImage"
import { useSession } from "@/hooks/useSession"
import { Form } from "antd"
import {
  ArrowLeft,
  Globe,
  MapPin,
  Clock,
  Phone,
  Edit,
  Delete,
  Plus,
  Camera,
  Search,
  Star,
  Users,
  Package,
  TrendingUp,
  Grid,
  List,
  MoreVertical,
} from "lucide-react"
import { message } from "antd"
import EditBusinessModal from "@/components/modals/EditBusinessModal"
import DeleteBusinessModal from "@/components/modals/DeleteBusinessModal"
import BusinessImageModal from "@/components/modals/BusinessImageModal"
import EditProductModal from "@/components/modals/EditProductModal"
import DeleteProductModal from "@/components/modals/DeleteProductModal"
import ProductImageModal from "@/components/modals/ProductImageModal"
import AddSingleProductModal from "@/components/modals/AddSingleProductModal"
import AddMultipleProductsModal from "@/components/modals/AddMultipleProductsModal"

const CURRENCY_OPTIONS = [
  { label: "Naira (₦)", value: "Naira" },
  { label: "Dollar ($)", value: "Dollar" },
  { label: "Euro (€)", value: "Euro" },
  { label: "Pound (£)", value: "Pound" },
]

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Custom hook for vendor data management
const useVendorData = (id) => {
  const { session } = useSession()
  const [state, setState] = useState({
    business: null,
    products: [],
    isLoading: true,
    isProductsLoading: false,
    error: null,
    isFetching: false,
  })

  const fetchBusinessData = useCallback(async () => {
    if (!session?.token || !id) return

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      const response = await fetchBusinessById(id, session.token)
      setState((prev) => ({ ...prev, business: response.business, isLoading: false }))
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message, isLoading: false }))
    }
  }, [session?.token, id])

  const fetchProductsData = useCallback(async () => {
    if (!session?.token || !id) return

    try {
      setState((prev) => ({ ...prev, isProductsLoading: true }))
      const data = await fetchProducts(session.token, id)
      const filteredProducts = Array.isArray(data) ? data.filter((product) => product.businessId === id) : []
      setState((prev) => ({ ...prev, products: filteredProducts, isProductsLoading: false }))
    } catch (error) {
      message.error("Failed to fetch products")
      setState((prev) => ({ ...prev, isProductsLoading: false }))
    }
  }, [session?.token, id])

  useEffect(() => {
    fetchBusinessData()
  }, [fetchBusinessData])

  useEffect(() => {
    fetchProductsData()
  }, [fetchProductsData])

  const refreshData = useCallback(() => {
    fetchBusinessData()
    fetchProductsData()
  }, [fetchBusinessData, fetchProductsData])

  return {
    ...state,
    refreshData,
    session,
  }
}

export default function VendorDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { business, products, isLoading, isProductsLoading, error, refreshData, session } = useVendorData(id)

  // Form instances
  const [businessForm] = Form.useForm()
  const [productForm] = Form.useForm()
  const [imageForm] = Form.useForm()
  const [productImageForm] = Form.useForm()
  const [addSingleProductForm] = Form.useForm()
  const [addMultipleProductsForm] = Form.useForm()

  // UI State
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [viewMode, setViewMode] = useState("grid")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Modal States
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isImageEditModalVisible, setIsImageEditModalVisible] = useState(false)
  const [isProductEditModalVisible, setIsProductEditModalVisible] = useState(false)
  const [isProductDeleteModalVisible, setIsProductDeleteModalVisible] = useState(false)
  const [isProductImageEditModalVisible, setIsProductImageEditModalVisible] = useState(false)
  const [isAddSingleProductModalVisible, setIsAddSingleProductModalVisible] = useState(false)
  const [isAddMultipleProductsModalVisible, setIsAddMultipleProductsModalVisible] = useState(false)

  // Product Filters
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState("Naira")

  // Preview states
  const [imagePreview, setImagePreview] = useState(null)
  const [productImagePreview, setProductImagePreview] = useState(null)

  const debouncedSearch = useDebounce(searchText, 300)

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize business form when business data is loaded
  useEffect(() => {
    if (business) {
      businessForm.setFieldsValue({
        ...business,
        deliveryOptions: business.deliveryOptions || [],
        businessType: business.businessType || "",
        categories: business.categories || [],
        priceRange: business.priceRange || "",
        deliveryTimeRange: business.deliveryTimeRange || "",
        rating: business.rating || "0.0",
        totalRatings: business.totalRatings || 0,
      })
    }
  }, [business, businessForm])

  // Business handlers
  const handleEdit = async (values) => {
    try {
      await updateBusiness(id, values, session?.token)
      message.success("Business updated successfully")
      setIsEditModalVisible(false)
      refreshData()
    } catch (err) {
      message.error(err.message || "Failed to update business")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBusiness(id, session?.token)
      message.success("Business deleted successfully")
      navigate("/vendors")
    } catch (err) {
      message.error(err.message || "Failed to delete business")
    }
  }

  const handleImageUpdate = async (values) => {
    try {
      await updateBusinessImage(id, values.image, session?.token)
      setIsImageEditModalVisible(false)
      setImagePreview(null)
      refreshData()
      message.success("Business image updated successfully")
    } catch (err) {
      message.error(err.message || "Failed to update business image")
    }
  }

  // Product handlers
  const openEditProductModal = (product) => {
    setSelectedProduct(product)
    setSelectedCurrency(product.currency || "Naira")
    productForm.setFieldsValue({
      ...product,
      categories: product.categories?.map((cat) => cat.id) || [],
      options: product.options ? JSON.stringify(product.options) : "",
    })
    setIsProductEditModalVisible(true)
  }

  const openDeleteProductModal = (product) => {
    setSelectedProduct(product)
    setIsProductDeleteModalVisible(true)
  }

  const openProductImageEditModal = (product) => {
    setSelectedProduct(product)
    setProductImagePreview(product.image)
    productImageForm.setFieldsValue({ image: product.image })
    setIsProductImageEditModalVisible(true)
  }

  const handleEditProduct = async (values) => {
    try {
      await updateProduct(selectedProduct.id, values, session?.token)
      message.success("Product updated successfully")
      setIsProductEditModalVisible(false)
      refreshData()
    } catch (err) {
      message.error(err.message || "Failed to update product")
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId, session?.token)
      message.success("Product deleted successfully")
      setIsProductDeleteModalVisible(false)
      refreshData()
    } catch (err) {
      message.error(err.message || "Failed to delete product")
    }
  }

  const handleProductImageUpdate = async (values) => {
    try {
      await updateProductImage(selectedProduct.id, values.image, session?.token)
      setIsProductImageEditModalVisible(false)
      setProductImagePreview(null)
      refreshData()
      message.success("Product image updated successfully")
    } catch (err) {
      message.error(err.message || "Failed to update product image")
    }
  }

  const handleAddSingleProduct = async (values) => {
    try {
      const data = { ...values, businessId: id }
      await createSingleProduct(data, values.image, session?.token)
      message.success("Product created successfully")
      setIsAddSingleProductModalVisible(false)
      addSingleProductForm.resetFields()
      setProductImagePreview(null)
      refreshData()
    } catch (err) {
      message.error(err.message || "Failed to create product")
    }
  }

  const handleAddMultipleProducts = async (values) => {
    try {
      const products = values.products.map((product) => ({ ...product, businessId: id }))
      const images = values.products.map((product) => product.image || null)
      await createMultipleProducts(products, images, session?.token)
      message.success("Products created successfully")
      setIsAddMultipleProductsModalVisible(false)
      addMultipleProductsForm.resetFields()
      setProductImagePreview(null)
      refreshData()
    } catch (err) {
      message.error(err.message || "Failed to create products")
    }
  }

  // Filter products
  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory =
        !selectedCategory ||
        (Array.isArray(product.categories) && product.categories.some((cat) => cat.name === selectedCategory))
      const matchesPrice =
        Number.parseFloat(product.price) >= priceRange.min && Number.parseFloat(product.price) <= priceRange.max
      return matchesSearch && matchesCategory && matchesPrice
    })
  }

  const getUniqueCategories = () => {
    const allCategories = products
      .flatMap((product) => (Array.isArray(product.categories) ? product.categories.map((cat) => cat.name) : []))
      .filter(Boolean)
    return [...new Set(allCategories)]
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )

  // Helper function to generate initials from product name
  const getInitials = (name) => {
    if (!name) return "P"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        {product.image ? (
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-orange-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-orange-600">{getInitials(product.name)}</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs rounded-full ${product.isActive ? "Active" : "Inactive"}`}>
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <button
          onClick={() => openProductImageEditModal(product)}
          className="absolute bottom-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-orange-600">₦{Number.parseFloat(product.price).toFixed(2)}</span>
          <span
            className={`px-2 py-1 text-xs rounded ${
              product.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {product.isAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {product.categories && product.categories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.categories.slice(0, 2).map((category, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {category.name}
                </span>
              ))}
              {product.categories.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{product.categories.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => openEditProductModal(product)}
            className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => openDeleteProductModal(product)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
          >
            <Delete className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )

  // Product List Item Component
  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
          {product.image ? (
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-orange-100 flex items-center justify-center">
              <span className="text-xl font-bold text-orange-600">{getInitials(product.name)}</span>
            </div>
          )}
          <button
            onClick={() => openProductImageEditModal(product)}
            className="absolute bottom-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
          >
            <Camera className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => openEditProductModal(product)}
                className="p-1 text-orange-600 hover:text-orange-700"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => openDeleteProductModal(product)} className="p-1 text-red-600 hover:text-red-700">
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-orange-600">₦{Number.parseFloat(product.price).toFixed(2)}</span>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  product.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {product.isAvailable ? "In Stock" : "Out of Stock"}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {product.categories && product.categories.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {product.categories.map((category, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading vendor</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Vendor not found</div>
      </div>
    )
  }

  const filteredProducts = getFilteredProducts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/vendors">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Vendors</span>
            </button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Vendor Details</h1>
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalVisible(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setIsDeleteModalVisible(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Delete className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Mobile Actions Menu */}
      {isMobile && showMobileMenu && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="space-y-2">
            <button
              onClick={() => {
                setIsEditModalVisible(true)
                setShowMobileMenu(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg"
            >
              <Edit className="w-4 h-4" />
              Edit Vendor
            </button>
            <button
              onClick={() => {
                setIsDeleteModalVisible(true)
                setShowMobileMenu(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Delete className="w-4 h-4" />
              Delete Vendor
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Business Image */}
            <div className="relative group mx-auto md:mx-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={business.image || "/placeholder.svg?height=160&width=160"}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setIsImageEditModalVisible(true)}
                className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            {/* Business Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{business.name}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        business.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {business.isActive ? "Active" : "Inactive"}
                    </span>

                    {business.deliveryOptions && business.deliveryOptions.length > 0 && (
                      <>
                        {business.deliveryOptions.map((option, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {option}
                          </span>
                        ))}
                      </>
                    )}

                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{business.rating || "0.0"}</span>
                      <span className="ml-1">({business.totalRatings || 0})</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 text-sm sm:text-base">{business.description}</p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{business.contactNumber}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {business.openingTime} - {business.closingTime}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{business.address}</span>
                </div>
                {business.website && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 truncate"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{business.rating || "0.0"}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{business.totalRatings || 0}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{getUniqueCategories().length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          {/* Products Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Products ({products.length})</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsAddSingleProductModalVisible(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
              <button
                onClick={() => setIsAddMultipleProductsModalVisible(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Bulk Add
              </button>
            </div>
          </div>

          {/* Products Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {!isMobile && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Category Filter */}
            {getUniqueCategories().length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3 py-1 text-sm rounded-full ${
                    !selectedCategory ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  All Categories
                </button>
                {getUniqueCategories().map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedCategory === category ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Products Grid/List */}
          {isProductsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500 mb-2">No products found</div>
              <div className="text-gray-400 text-sm">Try adjusting your search or add some products</div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) =>
                viewMode === "grid" ? (
                  <ProductCard key={product.id} product={product} />
                ) : (
                  <ProductListItem key={product.id} product={product} />
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditBusinessModal
        isVisible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onFinish={handleEdit}
        business={business}
        form={businessForm}
      />

      <DeleteBusinessModal
        isVisible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        businessName={business?.name}
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
          setIsAddSingleProductModalVisible(false)
          addSingleProductForm.resetFields()
          setProductImagePreview(null)
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
          setIsAddMultipleProductsModalVisible(false)
          addMultipleProductsForm.resetFields()
          setProductImagePreview(null)
        }}
        onFinish={handleAddMultipleProducts}
        form={addMultipleProductsForm}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
      />
    </div>
  )
}
