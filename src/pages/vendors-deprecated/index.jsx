import { useState, useEffect } from "react";
import { Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { vendorService } from "@/services/vendorService";

export default function VendorsPageOld() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getAllVendors(session?.token);
      setVendors(data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
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
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/vendors/${record.id}`)}
            className="text-[#ff6600] hover:text-[#ff8533] font-medium"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and monitor all vendors
          </p>
        </div>
        <button
          onClick={() => navigate("/vendors/add")}
          className="px-4 py-2 bg-[#ff6600] text-white rounded-md hover:bg-[#ff8533] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6600]"
        >
          Add New Vendor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={vendors}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} vendors`,
          }}
        />
      </div>
    </div>
  );
}
