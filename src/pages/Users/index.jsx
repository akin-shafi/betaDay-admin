import { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Input, message, Tabs } from "antd";
import { useSession } from "@/hooks/useSession";
import { fetchUsers } from "@/hooks/useAction";
import { FiEye, FiSearch } from "react-icons/fi";
import { UserModal } from "@/components/modals/UserModal";

const { TabPane } = Tabs;

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    fetchUsersList();
  }, []);

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers(session?.token);
      // No filtering here; include all roles
      setUsers(response?.users || []);
    } catch (error) {
      message.error(error.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = (role) => {
    if (!Array.isArray(users)) {
      return [];
    }
    return users
      .filter((user) => user.role.toLowerCase() === role.toLowerCase())
      .filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          (user.phoneNumber &&
            user.phoneNumber.toLowerCase().includes(searchText.toLowerCase()))
      );
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "red";
      case "user":
        return "green";
      case "vendor":
        return "blue"; // Added color for vendors
      default:
        return "default";
    }
  };

  // Columns for Customers tab
  const customerColumns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span className="font-medium">{text}</span>,
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName) || 0,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["sm"],
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => phoneNumber || "N/A",
      responsive: ["md"],
    },
    {
      title: "Profile Image",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (profileImage) =>
        profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => address || "N/A",
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<FiEye />}
            onClick={() => {
              setSelectedUser(record);
              setModalVisible(true);
            }}
            className="bg-gray-900 hover:bg-[#ff6600]"
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  // Columns for Admins tab
  const adminColumns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span className="font-medium">{text}</span>,
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName) || 0,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["sm"],
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => phoneNumber || "N/A",
      responsive: ["md"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={getRoleColor(role)} className="text-xs uppercase">
          {role}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<FiEye />}
            onClick={() => {
              setSelectedUser(record);
              setModalVisible(true);
            }}
            className="bg-gray-900 hover:bg-[#ff6600]"
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  // Columns for Vendors tab
  const vendorColumns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span className="font-medium">{text}</span>,
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName) || 0,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["sm"],
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => phoneNumber || "N/A",
      responsive: ["md"],
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => address || "N/A",
      responsive: ["lg"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={getRoleColor(role)} className="text-xs uppercase">
          {role}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<FiEye />}
            onClick={() => {
              setSelectedUser(record);
              setModalVisible(true);
            }}
            className="bg-gray-900 hover:bg-[#ff6600]"
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and monitor customers, admins, and vendors
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search users by name, email, or phone number..."
            prefix={<FiSearch className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs default PacificKey="customers">
          <TabPane tab="Customers" key="customers">
            <Table
              columns={customerColumns}
              dataSource={getFilteredUsers("user")} // Matches backend "user" role
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} customers`,
              }}
            />
          </TabPane>
          <TabPane tab="Admins" key="admins">
            <Table
              columns={adminColumns}
              dataSource={getFilteredUsers("admin")}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} admins`,
              }}
            />
          </TabPane>
          <TabPane tab="Vendors" key="vendors">
            <Table
              columns={vendorColumns}
              dataSource={getFilteredUsers("vendor")}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} vendors`,
              }}
            />
          </TabPane>
        </Tabs>
      </div>

      {/* User Modal */}
      <UserModal
        visible={modalVisible}
        user={selectedUser}
        onClose={() => setModalVisible(false)}
        token={session?.token}
        onUserUpdated={fetchUsersList}
      />
    </div>
  );
}