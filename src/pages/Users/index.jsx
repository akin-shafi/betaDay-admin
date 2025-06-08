/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/hooks/useSession";
import { fetchUsers } from "@/hooks/useAction";
import {
  Search,
  Grid,
  List,
  Eye,
  Mail,
  Phone,
  MapPin,
  User,
  Shield,
  Store,
} from "lucide-react";
import { UserModal } from "@/components/modals/UserModal";

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

// Custom hook for users data management
const useUsersData = () => {
  const { session } = useSession();
  const [state, setState] = useState({
    users: [],
    isLoading: true,
    error: null,
    isFetching: false,
  });

  const [filters, setFilters] = useState({
    activeTab: "all",
    search: "",
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  // Single data fetching function
  const fetchData = useCallback(async () => {
    if (!session?.token) return;

    // Prevent multiple simultaneous calls
    if (state.isFetching) return;

    try {
      setState((prev) => ({
        ...prev,
        isFetching: true,
        error: null,
      }));

      const response = await fetchUsers(session.token);
      const users = response?.users || [];

      setState((prev) => ({
        ...prev,
        users,
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
  }, [session?.token, state.isFetching]);

  // Initial load
  useEffect(() => {
    if (session?.token && state.isLoading) {
      fetchData();
    }
  }, [session?.token]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Filter users based on current filters
  const getFilteredUsers = useCallback(() => {
    if (!Array.isArray(state.users)) return [];

    return state.users.filter((user) => {
      // Role filter
      const roleMatch =
        filters.activeTab === "all" ||
        user.role?.toLowerCase() === filters.activeTab.toLowerCase();

      // Search filter
      const searchMatch =
        !debouncedSearch ||
        user.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(debouncedSearch.toLowerCase());

      return roleMatch && searchMatch;
    });
  }, [state.users, filters.activeTab, debouncedSearch]);

  return {
    ...state,
    filters,
    updateFilters,
    refreshData,
    filteredUsers: getFilteredUsers(),
    session,
  };
};

export function UsersPage() {
  const {
    users,
    filteredUsers,
    isLoading,
    error,
    isFetching,
    filters,
    updateFilters,
    refreshData,
    session,
  } = useUsersData();

  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  // Get user counts by role
  const getUserCounts = () => {
    if (!Array.isArray(users)) return { all: 0, user: 0, admin: 0, vendor: 0 };

    return {
      all: users.length,
      user: users.filter((u) => u.role?.toLowerCase() === "user").length,
      admin: users.filter((u) => u.role?.toLowerCase() === "admin").length,
      vendor: users.filter((u) => u.role?.toLowerCase() === "vendor").length,
    };
  };

  const userCounts = getUserCounts();

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "user":
        return "bg-green-100 text-green-800";
      case "vendor":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      case "vendor":
        return <Store className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const handleTabChange = (tab) => {
    updateFilters({ activeTab: tab });
  };

  const handleSearchChange = (e) => {
    updateFilters({ search: e.target.value });
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // User card component
  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage || "/placeholder.svg"}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.fullName}
              </h3>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getRoleColor(
              user.role
            )}`}
          >
            {getRoleIcon(user.role)}
            {user.role}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {user.phoneNumber && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{user.phoneNumber}</span>
            </div>
          )}

          {user.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{user.address}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => handleViewUser(user)}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  // User list item component
  const UserListItem = ({ user }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
          {user.profileImage ? (
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-orange-100 flex items-center justify-center">
              <User className="w-8 h-8 text-orange-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getRoleColor(
                user.role
              )}`}
            >
              {getRoleIcon(user.role)}
              {user.role}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            {user.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user.phoneNumber}</span>
              </div>
            )}

            {user.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user.address}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <button
              onClick={() => handleViewUser(user)}
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
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
          <div className="text-red-500 mb-2">Error loading users</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage customers, admins, and vendors
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {userCounts.all}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {userCounts.user}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-red-600">
                {userCounts.admin}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vendors</p>
              <p className="text-2xl font-bold text-blue-600">
                {userCounts.vendor}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
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

      {/* Role Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { key: "all", label: "All Users", count: userCounts.all },
            { key: "user", label: "Customers", count: userCounts.user },
            { key: "admin", label: "Admins", count: userCounts.admin },
            { key: "vendor", label: "Vendors", count: userCounts.vendor },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                filters.activeTab === tab.key
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {filteredUsers.length} users</span>
        {isFetching && <span className="text-orange-600">Loading...</span>}
      </div>

      {/* Users Grid/List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No users found</div>
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
          {filteredUsers.map((user) =>
            viewMode === "grid" ? (
              <UserCard key={user.id} user={user} />
            ) : (
              <UserListItem key={user.id} user={user} />
            )
          )}
        </div>
      )}

      {/* User Modal */}
      <UserModal
        visible={modalVisible}
        user={selectedUser}
        onClose={() => setModalVisible(false)}
        token={session?.token}
        onUserUpdated={refreshData}
      />
    </div>
  );
}
