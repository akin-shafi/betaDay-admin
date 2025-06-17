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
  Phone,
  MapPin,
  User,
  Shield,
  Store,
  Filter,
  RefreshCw,
  Plus,
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
  const [addModalVisible, setAddModalVisible] = useState(false);

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
        return "bg-red-100 text-red-700 border-red-200";
      case "user":
        return "bg-green-100 text-green-700 border-green-200";
      case "vendor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="w-3 h-3" />;
      case "user":
        return <User className="w-3 h-3" />;
      case "vendor":
        return <Store className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
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

  const handleAddUser = () => {
    setAddModalVisible(true);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse"
          >
            <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // User card component
  const UserCard = ({ user }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 touch-manipulation">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={
                    user.profileImage || "/placeholder.svg?height=40&width=40"
                  }
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate text-sm">
                {user.fullName}
              </h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${getRoleColor(
              user.role
            )}`}
          >
            {getRoleIcon(user.role)}
            <span className="hidden sm:inline">{user.role}</span>
          </span>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          {user.phoneNumber && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 flex-shrink-0 text-gray-400" />
              <span className="truncate">{user.phoneNumber}</span>
            </div>
          )}

          {user.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
              <span className="truncate">{user.address}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => handleViewUser(user)}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-xs font-medium transition-colors"
          >
            <Eye className="w-3 h-3" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  // User list item component (for mobile)
  const UserListItem = ({ user }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 touch-manipulation">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
          {user.profileImage ? (
            <img
              src={user.profileImage || "/placeholder.svg?height=48&width=48"}
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
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate text-sm">
                {user.fullName}
              </h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ml-2 ${getRoleColor(
                user.role
              )}`}
            >
              {getRoleIcon(user.role)}
              <span>{user.role}</span>
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            {user.phoneNumber && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Phone className="w-3 h-3" />
                <span className="truncate">{user.phoneNumber}</span>
              </div>
            )}
            <button
              onClick={() => handleViewUser(user)}
              className="text-orange-600 hover:text-orange-700 p-1 rounded-md transition-colors"
            >
              <Eye className="w-4 h-4" />
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
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <User className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-red-600 font-medium">Error loading users</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
            Users
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customers, admins, and vendors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Total Users
              </p>
              <p className="text-lg lg:text-xl font-bold text-gray-900 mt-1">
                {userCounts.all}
              </p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Customers
              </p>
              <p className="text-lg lg:text-xl font-bold text-green-600 mt-1">
                {userCounts.user}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Admins
              </p>
              <p className="text-lg lg:text-xl font-bold text-red-600 mt-1">
                {userCounts.admin}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Vendors
              </p>
              <p className="text-lg lg:text-xl font-bold text-blue-600 mt-1">
                {userCounts.vendor}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Role Filter Dropdown */}
          <div className="lg:hidden relative">
            <select
              value={filters.activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Users ({userCounts.all})</option>
              <option value="user">Customers ({userCounts.user})</option>
              <option value="admin">Admins ({userCounts.admin})</option>
              <option value="vendor">Vendors ({userCounts.vendor})</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View Mode Toggle - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Role Filter Tabs */}
      <div className="hidden lg:block">
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
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </span>
        {isFetching && (
          <div className="flex items-center gap-2 text-orange-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>

      {/* Users Grid/List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-gray-500 font-medium mb-1">No users found</div>
          <div className="text-gray-400 text-sm">
            Try adjusting your search or filters
          </div>
        </div>
      ) : (
        <>
          {/* Mobile List View */}
          <div className="sm:hidden space-y-3">
            {filteredUsers.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </div>

          {/* Desktop Grid/List View */}
          <div
            className={`hidden sm:block ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                : "space-y-3"
            }`}
          >
            {filteredUsers.map((user) =>
              viewMode === "grid" ? (
                <UserCard key={user.id} user={user} />
              ) : (
                <UserListItem key={user.id} user={user} />
              )
            )}
          </div>
        </>
      )}

      {/* View/Edit User Modal */}
      <UserModal
        visible={modalVisible}
        user={selectedUser}
        onClose={() => setModalVisible(false)}
        token={session?.token}
        onUserUpdated={refreshData}
      />

      {/* Add User Modal */}
      <UserModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        token={session?.token}
        onUserUpdated={refreshData}
      />
    </div>
  );
}