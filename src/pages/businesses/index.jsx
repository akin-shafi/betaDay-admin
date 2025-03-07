import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchBusinesses } from "@/hooks/useBusiness";
import { Link } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { Table, Input, Space, Tag, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { session } = useSession();

  useEffect(() => {
    const getBusinesses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchBusinesses(session?.token);
        setBusinesses(data);
      } catch (err) {
        setError(err);
        console.error("Error fetching businesses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      getBusinesses();
    }
  }, [session?.token]);

  // Filter businesses based on search text
  const filteredBusinesses = businesses.filter((business) =>
    Object.values(business).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      title: "Business Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover mr-3"
            src={record.image || "https://via.placeholder.com/40"}
            alt={text}
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500 text-sm">
              {record.openingTime} - {record.closingTime}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Delivery Options",
      dataIndex: "deliveryOptions",
      key: "deliveryOptions",
      render: (deliveryOptions) => (
        <Space wrap>
          {deliveryOptions?.map((option, index) => (
            <Tag key={index} color="blue">
              {option}
            </Tag>
          ))}
        </Space>
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
      render: (_, record) => (
        <Space>
          <Link to={`/businesses/${record.id}`}>
            <Button type="link">View</Button>
          </Link>
          <Button type="link">Edit</Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading businesses...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">
            Error loading businesses: {error.message}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Businesses</h1>
          <Link to="/businesses/add">
            <Button type="primary">Add Business</Button>
          </Link>
        </div>

        {/* Search Input */}
        <div className="max-w-md">
          <Input
            placeholder="Search businesses..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-lg"
          />
        </div>

        {/* Business List Table */}
        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            dataSource={filteredBusinesses}
            rowKey="id"
            loading={isLoading}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} businesses`,
            }}
            className="overflow-x-auto"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
