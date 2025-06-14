/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Dropdown,
  Modal,
  Select,
  Input,
  Descriptions,
  message,
  Space,
  Typography,
  Drawer,
  List,
  Avatar,
} from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
  ShoppingOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Text } = Typography;

export function OrderTable({
  orders,
  onUpdateStatus,
  onDeleteOrder,
  onRefundOrder,
  onBulkAction,
  loading,
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "orange", label: "Pending" },
      processing: { color: "blue", label: "Processing" },
      accepted: { color: "cyan", label: "Accepted" },
      preparing: { color: "purple", label: "Preparing" },
      ready_for_pickup: { color: "geekblue", label: "Ready for Pickup" },
      delivered: { color: "green", label: "Delivered" },
      cancelled: { color: "red", label: "Cancelled" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getPaymentStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "orange", label: "Pending" },
      processing: { color: "blue", label: "Processing" },
      paid: { color: "green", label: "Paid" },
      failed: { color: "red", label: "Failed" },
      cancelled: { color: "purple", label: "Cancelled" },
      refunded: { color: "purple", label: "Refunded" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const handleUpdateStatus = () => {
    if (editOrder && newStatus) {
      onUpdateStatus(editOrder.id, newStatus, statusNotes);
      setEditOrder(null);
      setNewStatus("");
      setStatusNotes("");
      message.success("Order status updated successfully");
    }
  };

  const showOrderDrawer = (order) => {
    setActiveOrder(order);
    setDrawerVisible(true);
  };

  const getActionMenu = (record) => ({
    items: [
      {
        key: "view",
        icon: <EyeOutlined />,
        label: "View Details",
        onClick: () => showOrderDrawer(record),
      },
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Update Status",
        onClick: () => setEditOrder(record),
      },
      { type: "divider" },
      {
        key: "call",
        icon: <PhoneOutlined />,
        label: "Call Customer",
        onClick: () => window.open(`tel:${record.customerPhone}`),
      },
      {
        key: "email",
        icon: <MailOutlined />,
        label: "Email Customer",
        onClick: () => window.open(`mailto:${record.customerEmail}`),
      },
      { type: "divider" },
      {
        key: "refund",
        icon: <ReloadOutlined />,
        label: "Process Refund",
        onClick: () => onRefundOrder(record.id),
      },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete Order",
        danger: true,
        onClick: () => onDeleteOrder(record.id),
      },
    ],
  });

  // Desktop columns
  const desktopColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <div>
          <div className="font-medium text-sm">
            <span className="font-mono text-sm">#{id.slice(-8)}</span>
          </div>
          <div className="text-xs text-gray-500 truncate max-w-32">
            {record.businessName}
          </div>
        </div>
        // <span className="font-mono text-sm">#{id.slice(-8)}</span>
      ),
      width: 100,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm">{record.customerName}</div>
          <div className="text-xs text-gray-500 truncate max-w-32">
            {record.customerEmail}
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <span className="text-sm">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      ),
      width: 80,
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <div>
          <div className="font-medium text-sm">
            {formatCurrency(record.finalAmount)}
          </div>
          <div className="text-xs text-gray-500">
            {record.paymentMethod === "wallet"
              ? "Wallet"
              : record.paymentMethod === "cash"
              ? "Cash"
              : record.paymentMethod.startsWith("paystack")
              ? "Paystack"
              : record.paymentMethod.startsWith("opay")
              ? "Opay"
              : record.paymentMethod}
          </div>
        </div>
      ),
      width: 120,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => getPaymentStatusTag(status),
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => getStatusTag(status),
      width: 120,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <span className="text-xs">{formatDate(date)}</span>,
      width: 120,
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
      width: 50,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Render order details in drawer for mobile view
  const renderOrderDrawer = () => {
    if (!activeOrder) return null;

    return (
      <Drawer
        title={`Order #${activeOrder.id.slice(-8)}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={window.innerWidth < 768 ? "100%" : 520}
        footer={
          <div className="flex justify-between">
            <Button
              onClick={() => {
                setDrawerVisible(false);
                setEditOrder(activeOrder);
              }}
              type="primary"
            >
              Update Status
            </Button>
            <Button
              onClick={() => {
                setDrawerVisible(false);
                onRefundOrder(activeOrder.id);
              }}
              danger
            >
              Process Refund
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <Text strong className="block mb-2">
              Customer Information
            </Text>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name">
                {activeOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <div className="flex items-center justify-between">
                  <span className="truncate">{activeOrder.customerEmail}</span>
                  <Button
                    type="link"
                    size="small"
                    icon={<MailOutlined />}
                    onClick={() =>
                      window.open(`mailto:${activeOrder.customerEmail}`)
                    }
                  />
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <div className="flex items-center justify-between">
                  <span>{activeOrder.customerPhone}</span>
                  <Button
                    type="link"
                    size="small"
                    icon={<PhoneOutlined />}
                    onClick={() =>
                      window.open(`tel:${activeOrder.customerPhone}`)
                    }
                  />
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <Text strong className="block mb-2">
              Order Information
            </Text>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Text type="secondary">Status</Text>
                <div>{getStatusTag(activeOrder.orderStatus)}</div>
              </div>
              <div>
                <Text type="secondary">Payment</Text>
                <div>{getPaymentStatusTag(activeOrder.paymentStatus)}</div>
              </div>
              <div>
                <Text type="secondary">Method</Text>
                <div className="text-xs">
                  {activeOrder.paymentMethod === "wallet"
                    ? "Wallet"
                    : activeOrder.paymentMethod === "cash"
                    ? "Cash on Delivery"
                    : activeOrder.paymentMethod.startsWith("paystack")
                    ? `Paystack`
                    : activeOrder.paymentMethod.startsWith("opay")
                    ? `Opay`
                    : activeOrder.paymentMethod}
                </div>
              </div>
              <div>
                <Text type="secondary">Date</Text>
                <div className="text-xs">
                  {formatDate(activeOrder.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <Text strong className="block mb-2">
              Order Items
            </Text>
            <List
              size="small"
              dataSource={activeOrder.items}
              renderItem={(item) => (
                <List.Item className="px-0">
                  <List.Item.Meta
                    avatar={<Avatar size="small" icon={<ShoppingOutlined />} />}
                    title={
                      <span className="text-sm">
                        {item.name} x{item.quantity}
                      </span>
                    }
                    description={
                      item.specialInstructions && (
                        <span className="text-xs">
                          Note: {item.specialInstructions}
                        </span>
                      )
                    }
                  />
                  <div className="font-medium text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </List.Item>
              )}
            />
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <Text strong className="block mb-2">
              Order Summary
            </Text>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(activeOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{formatCurrency(activeOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee:</span>
                <span>{formatCurrency(activeOrder.serviceFee)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(activeOrder.finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    );
  };

  return (
    <div>
      {selectedRowKeys.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <div className="flex justify-between items-center">
            <Text strong className="text-sm">
              {selectedRowKeys.length} orders selected
            </Text>
            <Space wrap>
              <Button
                size="small"
                onClick={() => onBulkAction(selectedRowKeys, "confirm")}
              >
                Confirm
              </Button>
              <Button
                size="small"
                onClick={() => onBulkAction(selectedRowKeys, "cancel")}
                danger
              >
                Cancel
              </Button>
              <Button
                size="small"
                onClick={() => onBulkAction(selectedRowKeys, "export")}
                icon={<DollarOutlined />}
              >
                Export
              </Button>
            </Space>
          </div>
        </div>
      )}

      {/* Mobile View List */}
      <div className="lg:hidden">
        <List
          dataSource={orders}
          loading={loading}
          renderItem={(item) => (
            <List.Item className="p-0 mb-2">
              <div className="w-full bg-gray-50 rounded p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1" onClick={() => showOrderDrawer(item)}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Text strong className="text-sm">
                        #{item.id.slice(-8)}
                      </Text>
                      {getStatusTag(item.orderStatus)}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {item.customerName}
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Text strong>{formatCurrency(item.finalAmount)}</Text>
                      <Text type="secondary">•</Text>
                      <Text type="secondary">{item.items.length} items</Text>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <Dropdown
                    menu={getActionMenu(item)}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              </div>
            </List.Item>
          )}
          pagination={{
            pageSize: 10,
            size: "small",
            showSizeChanger: false,
          }}
        />
      </div>

      {/* Desktop View Table */}
      <div className="hidden lg:block">
        <Table
          rowSelection={rowSelection}
          columns={desktopColumns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`,
          }}
          scroll={{ x: 800 }}
          size="small"
        />
      </div>

      {/* Edit Status Modal */}
      <Modal
        title={`Update Order Status - #${editOrder?.id.slice(-8)}`}
        open={!!editOrder}
        onOk={handleUpdateStatus}
        onCancel={() => setEditOrder(null)}
        okButtonProps={{ disabled: !newStatus }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">New Status</label>
            <Select
              className="w-full"
              placeholder="Select new status"
              value={newStatus}
              onChange={setNewStatus}
              size="large"
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="processing">Processing</Select.Option>
              <Select.Option value="accepted">Accepted</Select.Option>
              <Select.Option value="preparing">Preparing</Select.Option>
              <Select.Option value="ready_for_pickup">
                Ready for Pickup
              </Select.Option>
              <Select.Option value="delivered">Delivered</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes (Optional)
            </label>
            <TextArea
              placeholder="Add any notes about this status change..."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </Modal>

      {/* Order Details Drawer */}
      {renderOrderDrawer()}
    </div>
  );
}
