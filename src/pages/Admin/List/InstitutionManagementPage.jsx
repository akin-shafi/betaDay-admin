import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Input, Button, Pagination, message } from "antd";
import { useSession } from "@/hooks/useSession";
import {
  fetchInstitution,
  createInstitution,
  updateInstitution,
  // deleteInstitution,
} from "@/hooks/useAction";
import { SearchOutlined } from "@ant-design/icons";
import { InstitutionModal } from "@/components/modals/InstitutionModal";
import * as XLSX from "xlsx"; // Import xlsx library

export function InstitutionManagementPage() {
  const { session } = useSession();
  const token = session?.token;
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchInstitution(token);
        console.log(result);
        setInstitutions(result);
        setFilteredInstitutions(result);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
        message.error("Failed to load institutions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = institutions.filter((institution) =>
      institution.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInstitutions(filtered);
    setPage(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleCreateOrEditInstitution = async (institution) => {
    setLoading(true);
    try {
      if (selectedInstitution) {
        await updateInstitution(selectedInstitution.id, institution, token);
        message.success("Institution updated successfully");
      } else {
        await createInstitution(institution, token);
        message.success("Institution created successfully");
      }

      const result = await fetchInstitution(token);
      setInstitutions(result);
      setFilteredInstitutions(result);
    } catch (error) {
      console.error("Failed to save institution:", error);
      message.error("Failed to save institution");
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      setSelectedInstitution(null);
    }
  };

  // const handleDeleteInstitution = async (id) => {
  //   setLoading(true);
  //   try {
  //     await deleteInstitution(id, token);
  //     message.success("Institution deleted successfully");

  //     const result = await fetchInstitution(token);
  //     setInstitutions(result);
  //     setFilteredInstitutions(result);
  //   } catch (error) {
  //     console.error("Failed to delete institution:", error);
  //     message.error("Failed to delete institution");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleExport = () => {
    const wb = XLSX.utils.book_new(); // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(filteredInstitutions); // Convert JSON to sheet
    XLSX.utils.book_append_sheet(wb, ws, "Institutions"); // Append sheet to workbook
    XLSX.writeFile(wb, "institutions.xlsx"); // Write the file to disk
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, __, index) => (page - 1) * pageSize + index + 1, // Calculate serial number
    },
    {
      title: "Institution Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => `${record.name}, ${record.initial}`,
    },
    {
      title: "Equipment Status",
      dataIndex: "equipmentStatus",
      key: "equipmentStatus",
      render: (equipmentStatus) => (
        <span style={{ color: equipmentStatus ? "green" : "red" }}>
          {equipmentStatus ? "Submitted" : "Not Submitted"}
        </span>
      ),
    },
  ];

  const paginatedData = filteredInstitutions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between mb-10">
          <h2>Institution Management</h2>
          <div className="flex">
            <Button
              type="primary"
              className="bg-gray-900 hover:bg-[#ff6600] rounded-full"
              style={{ marginLeft: "auto" }}
              onClick={() => {
                setSelectedInstitution(null);
                setIsModalVisible(true);
              }}
            >
              Add Institution
            </Button>
            <Button
              type="default"
              className="ml-2 bg-white hover:bg-gray-200 rounded-full"
              onClick={handleExport}
            >
              Export All as Excel
            </Button>
          </div>
        </div>
        <Input
          placeholder="Search by institution name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "250px", marginBottom: "20px" }}
        />
        <Table
          columns={columns}
          dataSource={paginatedData} // Use paginatedData here
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredInstitutions.length}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          style={{ marginTop: 20 }}
        />
      </div>
      <InstitutionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateOrEditInstitution}
        institution={selectedInstitution}
      />
    </DashboardLayout>
  );
}
