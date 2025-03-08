import { useState, useEffect } from "react";
import { Table, Tag, Space, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { fetchBusinesses } from "@/hooks/useBusiness";
import { FiEye } from "react-icons/fi";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    fetchBusinessList();
  }, []);

  const fetchBusinessList = async () => {
    try {
      setLoading(true);
      const data = await fetchBusinesses(session?.token);
      setBusinesses(data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Business Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
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
          <Button
            type="primary"
            icon={<FiEye />}
            onClick={() => navigate(`/businesses/${record.id}`)}
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
          <h1 className="text-2xl font-semibold text-gray-900">Businesses</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and monitor all businesses
          </p>
        </div>
        <Button
          type="primary"
          onClick={() => navigate("/businesses/add")}
          className="bg-gray-900 hover:bg-[#ff6600]"
        >
          Add Business
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={businesses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} businesses`,
          }}
        />
      </div>
    </div>
  );
}
