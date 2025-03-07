import { useState, useEffect } from "react";
import { fetchBusinesses, createBusiness } from "@/hooks/useBusiness";
import { Link } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { Table, Input, Space, Tag, Button, Form, message } from "antd";
import { Search, Plus } from "lucide-react";
import AddBusinessModal from "@/components/modals/AddBusinessModal";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleAddBusiness = async (values) => {
    try {
      await createBusiness(values, session?.token);
      message.success("Business created successfully");
      setIsAddModalVisible(false);
      form.resetFields();
      setImagePreview(null);
      // Refresh businesses list
      const data = await fetchBusinesses(session?.token);
      setBusinesses(data);
    } catch (err) {
      message.error(err.message || "Failed to create business");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-md">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow">
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

        {/* Pagination Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          Error loading businesses: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Businesses</h1>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsAddModalVisible(true)}
          className="bg-gray-900 hover:bg-[#ff6600]"
        >
          Add Business
        </Button>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          placeholder="Search businesses..."
          prefix={<Search size={16} className="text-gray-400" />}
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

      {/* Add Business Modal */}
      <AddBusinessModal
        isVisible={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
          setImagePreview(null);
        }}
        onFinish={handleAddBusiness}
        form={form}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
    </div>
  );
}
