/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Table,
  Typography,
  Space,
  Drawer,
} from "antd";
import { useSession } from "@/hooks/useSession";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function RateConfigManagement() {
  const { session } = useSession();
  const token = session?.token;
  const [zoneConfigs, setZoneConfigs] = useState([]);
  const [filteredZoneConfigs, setFilteredZoneConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [form] = Form.useForm();
  const [states, setStates] = useState([]);
  const [localGovernments, setLocalGovernments] = useState([]);
  const [selectedStateName, setSelectedStateName] = useState("Lagos"); // Default to Lagos
  const [selectedStateId, setSelectedStateId] = useState(null); // Store stateId for API
  const [filters, setFilters] = useState({ search: "" });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeConfig, setActiveConfig] = useState(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  // Normalize zone config data for table
  const normalizeZoneConfig = (config) => {
    if (!config) {
      console.error("normalizeZoneConfig received invalid config:", config);
      return {};
    }
    const state = states.find((s) => s.id === config.localGovernment?.stateId);
    return {
      id: config.id || "",
      localGovernment: {
        id: config.localGovernment?.id || "",
        stateId: config.localGovernment?.stateId || null,
        stateName: state ? state.name : config.localGovernment?.stateName || "",
        name: config.localGovernment?.name || "",
      },
      baseFee: Number.parseFloat(config.baseFee) || 0,
      perKmRate: Number.parseFloat(config.perKmRate) || 0,
      itemSurcharge: Number.parseFloat(config.itemSurcharge) || 0,
      serviceFeeRate: Number.parseFloat(config.serviceFeeRate) || 0,
      minServiceFee: Number.parseFloat(config.minServiceFee) || 0,
      surgeHours: config.surgeHours || [],
      surgeRate: Number.parseFloat(config.surgeRate) || 0,
      createdAt: config.createdAt || "",
      updatedAt: config.updatedAt || "",
    };
  };

  // Fetch states from API
  const fetchStates = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/delivery-locations/states`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }

      const { data } = await response.json();
      setStates(data || []);
      // Set default state to Lagos
      const lagosState = (data || []).find(
        (state) => state.name.toLowerCase() === "lagos"
      );
      if (lagosState) {
        setSelectedStateId(lagosState.id);
        setSelectedStateName(lagosState.name);
        setLocalGovernments(lagosState.localGovernments || []);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      message.error("Failed to load states");
      setStates([]);
      setLocalGovernments([]);
    }
  };

  // Fetch zone configs from API
  const fetchZoneConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (selectedStateId) params.append("stateId", selectedStateId);

      const response = await fetch(
        `${API_BASE_URL}/api/zone-configs?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch zone configurations");
      }

      const data = await response.json();
      const normalizedConfigs = (data || []).map(normalizeZoneConfig);
      setZoneConfigs(normalizedConfigs);
      setFilteredZoneConfigs(normalizedConfigs);
      message.success("Zone configurations loaded successfully");
    } catch (error) {
      console.error("Error fetching zone configurations:", error);
      setError(error.message);
      message.error("Failed to load zone configurations");
      setZoneConfigs([]);
      setFilteredZoneConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  // Update local governments when state changes
  const updateLocalGovernments = (stateName) => {
    const state = states.find((s) => s.name === stateName);
    setLocalGovernments(state ? state.localGovernments || [] : []);
  };

  // Initial data fetch
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch zone configs and update local governments when state or filters change
  useEffect(() => {
    if (selectedStateId) {
      fetchZoneConfigs();
      updateLocalGovernments(selectedStateName);
    }
  }, [selectedStateId, selectedStateName, filters]);

  // Handle create or update zone config
  const handleSaveZoneConfig = async (values) => {
    setLoading(true);
    try {
      const url = editingConfig
        ? `${API_BASE_URL}/api/zone-configs/${editingConfig.id}`
        : `${API_BASE_URL}/api/zone-configs`;
      const method = editingConfig ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          surgeHours: values.surgeHours
            ? values.surgeHours.split(",").map((h) => h.trim())
            : [],
          stateId: selectedStateId, // Include stateId in the payload
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${editingConfig ? "update" : "create"} zone configuration`
        );
      }

      await fetchZoneConfigs();
      message.success(
        `Zone configuration ${
          editingConfig ? "updated" : "created"
        } successfully`
      );
      setIsModalVisible(false);
      setEditingConfig(null);
      form.resetFields();
    } catch (error) {
      console.error(
        `Error ${editingConfig ? "updating" : "creating"} zone configuration:`,
        error
      );
      message.error(
        `Failed to ${editingConfig ? "update" : "create"} zone configuration`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle delete zone config
  const handleDeleteZoneConfig = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/zone-configs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete zone configuration");
      }

      setZoneConfigs((prev) => prev.filter((config) => config.id !== id));
      setFilteredZoneConfigs((prev) =>
        prev.filter((config) => config.id !== id)
      );
      message.success("Zone configuration deleted successfully");
    } catch (error) {
      console.error("Error deleting zone configuration:", error);
      message.error("Failed to delete zone configuration");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit zone config
  const handleEditZoneConfig = (config) => {
    setEditingConfig(config);
    const state = states.find(
      (s) => s.id === config.localGovernment.stateId
    ) || { name: "Lagos" };
    setSelectedStateName(state.name);
    setSelectedStateId(
      config.localGovernment.stateId ||
        states.find((s) => s.name.toLowerCase() === "lagos")?.id
    );
    updateLocalGovernments(state.name);
    form.setFieldsValue({
      ...config,
      localGovernmentId: config.localGovernment.id,
      surgeHours: config.surgeHours.join(", "),
      stateName: state.name,
    });
    setIsModalVisible(true);
  };

  // Show config details in drawer (mobile)
  const showConfigDrawer = (config) => {
    setActiveConfig(config);
    setDrawerVisible(true);
  };

  // Desktop table columns
  const desktopColumns = [
    {
      title: "Local Government",
      dataIndex: ["localGovernment", "name"],
      key: "localGovernment",
      sorter: (a, b) =>
        a.localGovernment.name?.localeCompare(b.localGovernment.name || "") ||
        0,
      width: 150,
    },
    {
      title: "Base Fee",
      dataIndex: "baseFee",
      key: "baseFee",
      sorter: (a, b) => a.baseFee - b.baseFee,
      render: (value) => formatCurrency(value),
      width: 100,
    },
    {
      title: "Per Km Rate",
      dataIndex: "perKmRate",
      key: "perKmRate",
      sorter: (a, b) => a.perKmRate - b.perKmRate,
      render: (value) => formatCurrency(value),
      width: 100,
    },
    {
      title: "Service Fee Rate",
      dataIndex: "serviceFeeRate",
      key: "serviceFeeRate",
      sorter: (a, b) => a.serviceFeeRate - b.serviceFeeRate,
      render: (value) => `${(value * 100).toFixed(2)}%`,
      width: 120,
    },
    {
      title: "Surge Rate",
      dataIndex: "surgeRate",
      key: "surgeRate",
      sorter: (a, b) => a.surgeRate - b.surgeRate,
      render: (value) => `x${value.toFixed(2)}`,
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditZoneConfig(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteZoneConfig(record.id)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
      width: 120,
    },
  ];

  // Render config details drawer
  const renderConfigDrawer = () => {
    if (!activeConfig) return null;

    return (
      <Drawer
        title={`Rate Config - ${activeConfig.localGovernment.name}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={window.innerWidth < 768 ? "100%" : 400}
        footer={
          <div className="flex justify-between">
            <Button
              onClick={() => {
                setDrawerVisible(false);
                handleEditZoneConfig(activeConfig);
              }}
              type="primary"
              icon={<EditOutlined />}
            >
              Edit Config
            </Button>
            <Button
              onClick={() => {
                setDrawerVisible(false);
                handleDeleteZoneConfig(activeConfig.id);
              }}
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <Text strong className="block mb-2">
              Location Details
            </Text>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">State:</span>
                <span>{activeConfig.localGovernment.stateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Local Government:</span>
                <span>{activeConfig.localGovernment.name}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <Text strong className="block mb-2">
              Rate Configuration
            </Text>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Fee:</span>
                <span className="font-medium">
                  {formatCurrency(activeConfig.baseFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Per Km Rate:</span>
                <span className="font-medium">
                  {formatCurrency(activeConfig.perKmRate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Item Surcharge:</span>
                <span className="font-medium">
                  {formatCurrency(activeConfig.itemSurcharge)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee Rate:</span>
                <span className="font-medium">
                  {(activeConfig.serviceFeeRate * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Service Fee:</span>
                <span className="font-medium">
                  {formatCurrency(activeConfig.minServiceFee)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <Text strong className="block mb-2">
              Surge Configuration
            </Text>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Surge Rate:</span>
                <span className="font-medium">
                  x{activeConfig.surgeRate.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">Surge Hours:</span>
                <span className="text-xs bg-white px-2 py-1 rounded">
                  {activeConfig.surgeHours.length > 0
                    ? activeConfig.surgeHours.join(", ")
                    : "None"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <Title level={3} className="text-xl font-semibold m-0">
          Rate Management
        </Title>
        <Text type="secondary" className="text-sm">
          Manage delivery zone rates and configurations
        </Text>
      </div>

      {/* Mobile Controls */}
      <div className="lg:hidden space-y-3">
        <div className="flex justify-between items-center">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingConfig(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            size="large"
          >
            Create Config
          </Button>
          <Text className="text-sm text-gray-500">
            {filteredZoneConfigs.length} configs
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Select
            value={selectedStateName}
            onChange={(value) => {
              const state = states.find((s) => s.name === value);
              setSelectedStateName(value);
              setSelectedStateId(state ? state.id : null);
              updateLocalGovernments(value);
              form.setFieldsValue({ localGovernmentId: undefined });
            }}
            className="w-full"
            size="large"
            placeholder="Select State"
          >
            {states.map((state) => (
              <Select.Option key={state.name} value={state.name}>
                {state.name}
              </Select.Option>
            ))}
          </Select>

          <Input
            placeholder="Search by local government"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            size="large"
          />
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="hidden lg:flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingConfig(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Create Zone Configuration
          </Button>
          <Select
            value={selectedStateName}
            onChange={(value) => {
              const state = states.find((s) => s.name === value);
              setSelectedStateName(value);
              setSelectedStateId(state ? state.id : null);
              updateLocalGovernments(value);
              form.setFieldsValue({ localGovernmentId: undefined });
            }}
            className="w-48"
            placeholder="Select State"
          >
            {states.map((state) => (
              <Select.Option key={state.name} value={state.name}>
                {state.name}
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder="Search by local government"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-64"
          />
        </div>
        <Text className="text-sm text-gray-500">
          {filteredZoneConfigs.length} configurations
        </Text>
      </div>

      {/* Mobile List View */}
      <div className="lg:hidden">
        <div className="space-y-2">
          {filteredZoneConfigs.map((config) => (
            <div key={config.id} className="bg-gray-50 rounded p-3">
              <div className="flex justify-between items-start">
                <div
                  className="flex-1"
                  onClick={() => showConfigDrawer(config)}
                >
                  <div className="font-medium text-sm mb-1">
                    {config.localGovernment.name}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {config.localGovernment.stateName}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Base Fee:</span>
                      <div className="font-medium">
                        {formatCurrency(config.baseFee)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Per Km:</span>
                      <div className="font-medium">
                        {formatCurrency(config.perKmRate)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Service Fee:</span>
                      <div className="font-medium">
                        {(config.serviceFeeRate * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Surge:</span>
                      <div className="font-medium">
                        x{config.surgeRate.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditZoneConfig(config)}
                    size="small"
                    type="text"
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDeleteZoneConfig(config.id)}
                    size="small"
                    type="text"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <ErrorBoundary>
          <Table
            columns={desktopColumns}
            dataSource={filteredZoneConfigs}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} configurations`,
            }}
            scroll={{ x: 800 }}
            size="small"
          />
        </ErrorBoundary>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={
          editingConfig
            ? "Edit Zone Configuration"
            : "Create Zone Configuration"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingConfig(null);
          form.resetFields();
        }}
        footer={null}
        width={window.innerWidth < 768 ? "95%" : 600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveZoneConfig}
          initialValues={{ surgeHours: "", stateName: selectedStateName }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="stateName"
              label="State"
              rules={[{ required: true, message: "Please select a state" }]}
            >
              <Select
                placeholder="Select State"
                onChange={(value) => {
                  const state = states.find((s) => s.name === value);
                  setSelectedStateName(value);
                  setSelectedStateId(state ? state.id : null);
                  updateLocalGovernments(value);
                  form.setFieldsValue({ localGovernmentId: undefined });
                }}
              >
                {states.map((state) => (
                  <Select.Option key={state.name} value={state.name}>
                    {state.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="localGovernmentId"
              label="Local Government"
              rules={[
                { required: true, message: "Please select a local government" },
              ]}
            >
              <Select placeholder="Select Local Government">
                {localGovernments.map((lg) => (
                  <Select.Option key={lg.id} value={lg.id}>
                    {lg.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="baseFee"
              label="Base Fee (₦)"
              rules={[{ required: true, message: "Please enter base fee" }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>

            <Form.Item
              name="perKmRate"
              label="Per Km Rate (₦)"
              rules={[{ required: true, message: "Please enter per km rate" }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>

            <Form.Item
              name="itemSurcharge"
              label="Item Surcharge (₦)"
              rules={[
                { required: true, message: "Please enter item surcharge" },
              ]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>

            <Form.Item
              name="serviceFeeRate"
              label="Service Fee Rate (0-1)"
              rules={[
                { required: true, message: "Please enter service fee rate" },
              ]}
            >
              <InputNumber min={0} max={1} step={0.01} className="w-full" />
            </Form.Item>

            <Form.Item
              name="minServiceFee"
              label="Minimum Service Fee (₦)"
              rules={[
                { required: true, message: "Please enter minimum service fee" },
              ]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>

            <Form.Item
              name="surgeRate"
              label="Surge Rate"
              rules={[{ required: true, message: "Please enter surge rate" }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item
            name="surgeHours"
            label="Surge Hours (comma-separated, e.g., 12:00-14:00,18:00-21:00)"
          >
            <Input placeholder="e.g., 12:00-14:00,18:00-21:00" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingConfig(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingConfig ? "Update" : "Create"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Config Details Drawer */}
      {renderConfigDrawer()}
    </div>
  );
}

export default RateConfigManagement;
