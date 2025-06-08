/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { fetchBusinesses, createBusiness } from "@/hooks/useBusiness";
import {
  Search,
  Plus,
  MapPin,
  Phone,
  Clock,
  Eye,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { message } from "antd";
import AddBusinessModal from "@/components/modals/AddBusinessModal";

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for vendors data management
const useVendorsData = () => {
  const { session } = useSession();
  const [state, setState] = useState({
    businesses: [],
    total: 0,
    businessTypes: ["All"],
    isLoading: true,
    error: null,
    isFetching: false,
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    activeTab: "All",
    search: "",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  // Single data fetching function
  const fetchData = useCallback(
    async (shouldFetchTypes = false) => {
      if (!session?.token) return;

      // Prevent multiple simultaneous calls
      if (state.isFetching) return;

      try {
        setState((prev) => ({
          ...prev,
          isFetching: true,
          error: null,
          isLoading: shouldFetchTypes ? true : prev.isLoading,
        }));

        const businessType =
          filters.activeTab === "All" ? null : filters.activeTab;
        const search = debouncedSearch || null;

        // Fetch businesses
        const data = await fetchBusinesses(
          session.token,
          filters.page,
          filters.limit,
          businessType,
          search
        );

        // Extract business types if needed
        let types = state.businessTypes;
        if (shouldFetchTypes) {
          const uniqueTypes = [
            ...new Set(
              data.businesses.map((b) => b.businessType).filter(Boolean)
            ),
          ];
          types = ["All", ...uniqueTypes];
        }

        setState((prev) => ({
          ...prev,
          businesses: data.businesses,
          total: data.total,
          businessTypes: types,
          isLoading: false,
          isFetching: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
          isFetching: false,
        }));
      }
    },
    [
      session?.token,
      filters,
      debouncedSearch,
      state.isFetching,
      state.businessTypes,
    ]
  );

  // Initial load - fetch data and types only once
  useEffect(() => {
    if (session?.token && state.isLoading && state.businessTypes.length === 1) {
      fetchData(true);
    }
  }, [session?.token]);

  // Subsequent loads - only fetch data when filters change
  useEffect(() => {
    if (session?.token && !state.isLoading && state.businessTypes.length > 1) {
      fetchData(false);
    }
  }, [filters.page, filters.activeTab, debouncedSearch]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refreshData = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    ...state,
    filters,
    updateFilters,
    refreshData,
    session,
  };
};

export default function VendorsPage() {
  const {
    businesses,
    total,
    businessTypes,
    isLoading,
    error,
    isFetching,
    filters,
    updateFilters,
    refreshData,
    session,
  } = useVendorsData();

  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(total / filters.limit);
  const startItem = (filters.page - 1) * filters.limit + 1;
  const endItem = Math.min(filters.page * filters.limit, total);

  const handleAddBusiness = async (values) => {
    try {
      await createBusiness(values, session?.token);
      message.success("Business created successfully");
      setIsAddModalVisible(false);
      refreshData();
    } catch (err) {
      message.error(err.message || "Failed to create business");
    }
  };

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
  };

  const handleTabChange = (tab) => {
    updateFilters({ activeTab: tab, page: 1 });
  };

  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value, page: 1 });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Business card component
  const BusinessCard = ({ business }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 relative">
        <img
          src={business.image || "/placeholder.svg?height=200&width=300"}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              business.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {business.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">
          {business.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{business.contactNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>
              {business.openingTime} - {business.closingTime}
            </span>
          </div>
        </div>

        {business.deliveryOptions && business.deliveryOptions.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {business.deliveryOptions.slice(0, 2).map((option, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                >
                  {option}
                </span>
              ))}
              {business.deliveryOptions.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{business.deliveryOptions.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            to={`/vendors/${business.id}`}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  // Business list item component
  const BusinessListItem = ({ business }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={business.image || "/placeholder.svg?height=80&width=80"}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 truncate">
              {business.name}
            </h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ml-2 ${
                business.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {business.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{business.address}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{business.contactNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {business.openingTime} - {business.closingTime}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            {business.deliveryOptions &&
              business.deliveryOptions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {business.deliveryOptions.slice(0, 3).map((option, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              )}

            <Link
              to={`/vendors/${business.id}`}
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading vendors</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-1">Manage your business vendors</p>
        </div>
        <button
          onClick={() => setIsAddModalVisible(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {!isMobile && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Business Type Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {businessTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTabChange(type)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                filters.activeTab === type
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {startItem}-{endItem} of {total} vendors
        </span>
        {isFetching && <span className="text-orange-600">Loading...</span>}
      </div>

      {/* Business Grid/List */}
      {businesses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No vendors found</div>
          <div className="text-gray-400 text-sm">
            Try adjusting your search or filters
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-4"
          }
        >
          {businesses.map((business) =>
            viewMode === "grid" ? (
              <BusinessCard key={business.id} business={business} />
            ) : (
              <BusinessListItem key={business.id} business={business} />
            )
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(1, filters.page - 2) + i;
              if (pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    pageNum === filters.page
                      ? "bg-orange-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Business Modal */}
      <AddBusinessModal
        isVisible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onFinish={handleAddBusiness}
      />
    </div>
  );
}
