/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { message, Modal, Form, Input, InputNumber, Select, Button } from "antd";
import { useSession } from "@/hooks/useSession";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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
      baseFee: parseFloat(config.baseFee) || 0,
      perKmRate: parseFloat(config.perKmRate) || 0,
      itemSurcharge: parseFloat(config.itemSurcharge) || 0,
      serviceFeeRate: parseFloat(config.serviceFeeRate) || 0,
      minServiceFee: parseFloat(config.minServiceFee) || 0,
      surgeHours: config.surgeHours || [],
      surgeRate: parseFloat(config.surgeRate) || 0,
      createdAt: config.createdAt || "",
      updatedAt: config.updatedAt || "",
    };
  };

  // Fetch states from API
  const fetchStates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/delivery-locations/states`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }

      const { data } = await response.json();
      setStates(data || []);
      // Set default state to Lagos
      const lagosState = (data || []).find((state) => state.name.toLowerCase() === "lagos");
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

      const response = await fetch(`${API_BASE_URL}/api/zone-configs?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
        throw new Error(`Failed to ${editingConfig ? "update" : "create"} zone configuration`);
      }

      await fetchZoneConfigs();
      message.success(`Zone configuration ${editingConfig ? "updated" : "created"} successfully`);
      setIsModalVisible(false);
      setEditingConfig(null);
      form.resetFields();
    } catch (error) {
      console.error(`Error ${editingConfig ? "updating" : "creating"} zone configuration:`, error);
      message.error(`Failed to ${editingConfig ? "update" : "create"} zone configuration`);
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
      setFilteredZoneConfigs((prev) => prev.filter((config) => config.id !== id));
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
    const state = states.find((s) => s.id === config.localGovernment.stateId) || { name: "Lagos" };
    setSelectedStateName(state.name);
    setSelectedStateId(config.localGovernment.stateId || states.find((s) => s.name.toLowerCase() === "lagos")?.id);
    updateLocalGovernments(state.name);
    form.setFieldsValue({
      ...config,
      localGovernmentId: config.localGovernment.id,
      surgeHours: config.surgeHours.join(", "),
      stateName: state.name,
    });
    setIsModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "Local Government",
      dataIndex: ["localGovernment", "name"],
      key: "localGovernment",
      sorter: (a, b) => a.localGovernment.name?.localeCompare(b.localGovernment.name || "") || 0,
    },
    {
      title: "Base Fee",
      dataIndex: "baseFee",
      key: "baseFee",
      sorter: (a, b) => a.baseFee - b.baseFee,
      render: (value) => `₦${value.toFixed(2)}`,
    },
    {
      title: "Per Km Rate",
      dataIndex: "perKmRate",
      key: "perKmRate",
      sorter: (a, b) => a.perKmRate - b.perKmRate,
      render: (value) => `₦${value.toFixed(2)}`,
    },
    {
      title: "Service Fee Rate",
      dataIndex: "serviceFeeRate",
      key: "serviceFeeRate",
      sorter: (a, b) => a.serviceFeeRate - b.serviceFeeRate,
      render: (value) => `${(value * 100).toFixed(2)}%`, // Display as percentage
    },
    {
      title: "Surge Hours",
      dataIndex: "surgeHours",
      key: "surgeHours",
      render: (hours) => hours.join(", ") || "None",
    },
    {
      title: "Surge Rate",
      dataIndex: "surgeRate",
      key: "surgeRate",
      sorter: (a, b) => a.surgeRate - b.surgeRate,
      render: (value) => `x${value.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditZoneConfig(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteZoneConfig(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "0" }}>
          Rate Management
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0" }}>
          Manage delivery-zone rates
        </p>
      </div>

      <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
        <Button
          type="primary"
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
            form.setFieldsValue({ localGovernmentId: undefined }); // Reset LG selection
          }}
          style={{ width: 200 }}
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
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ width: 200 }}
        />
      </div>

      <ErrorBoundary>
        <Table
          columns={columns}
          dataSource={filteredZoneConfigs}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </ErrorBoundary>

      <Modal
        title={editingConfig ? "Edit Zone Configuration" : "Create Zone Configuration"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingConfig(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveZoneConfig}
          initialValues={{ surgeHours: "", stateName: selectedStateName }}
        >
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
                form.setFieldsValue({ localGovernmentId: undefined }); // Reset LG selection
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
            rules={[{ required: true, message: "Please select a local government" }]}
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
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="perKmRate"
            label="Per Km Rate (₦)"
            rules={[{ required: true, message: "Please enter per km rate" }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="itemSurcharge"
            label="Item Surcharge (₦)"
            rules={[{ required: true, message: "Please enter item surcharge" }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="serviceFeeRate"
            label="Service Fee Rate"
            rules={[{ required: true, message: "Please enter service fee rate" }]}
          >
            <InputNumber min={0} max={1} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="minServiceFee"
            label="Minimum Service Fee (₦)"
            rules={[{ required: true, message: "Please enter minimum service fee" }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="surgeHours"
            label="Surge Hours (comma-separated, e.g., 12:00-14:00,18:00-21:00)"
          >
            <Input placeholder="e.g., 12:00-14:00,18:00-21:00" />
          </Form.Item>
          <Form.Item
            name="surgeRate"
            label="Surge Rate"
            rules={[{ required: true, message: "Please enter surge rate" }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingConfig ? "Update" : "Create"}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setIsModalVisible(false);
                setEditingConfig(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default RateConfigManagement;