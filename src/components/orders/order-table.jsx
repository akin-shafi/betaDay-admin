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
  Row,
  Col,
  Descriptions,
  message,
} from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

export function OrderTable({
  orders,
  onUpdateStatus,
  onDeleteOrder,
  onRefundOrder,
  onBulkAction,
  loading,
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");

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
      confirmed: { color: "blue", label: "Confirmed" },
      preparing: { color: "purple", label: "Preparing" },
      ready: { color: "cyan", label: "Ready" },
      out_for_delivery: { color: "geekblue", label: "Out for Delivery" },
      delivered: { color: "green", label: "Delivered" },
      cancelled: { color: "red", label: "Cancelled" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getPaymentStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "orange", label: "Pending" },
      completed: { color: "green", label: "Completed" },
      failed: { color: "red", label: "Failed" },
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

  const getActionMenu = (record) => ({
    items: [
      {
        key: "view",
        icon: <EyeOutlined />,
        label: "View Details",
        onClick: () => setViewOrder(record),
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

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <span style={{ fontFamily: "monospace" }}>#{id.slice(-8)}</span>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: "bold" }}>{record.customerName}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.customerEmail}
          </div>
        </div>
      ),
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <span>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: "bold" }}>
            {formatCurrency(record.finalAmount)}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.paymentMethod === "wallet" ? "Wallet" : "Gateway"}
          </div>
        </div>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => getPaymentStatusTag(status),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span style={{ fontSize: "12px" }}>{formatDate(date)}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      {selectedRowKeys.length > 0 && (
        <div
          style={{
            padding: "16px",
            background: "#f5f5f5",
            borderRadius: "6px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            {selectedRowKeys.length} orders selected
          </span>
          <Button
            size="small"
            onClick={() => onBulkAction(selectedRowKeys, "confirm")}
          >
            Confirm Selected
          </Button>
          <Button
            size="small"
            onClick={() => onBulkAction(selectedRowKeys, "cancel")}
          >
            Cancel Selected
          </Button>
          <Button
            size="small"
            onClick={() => onBulkAction(selectedRowKeys, "export")}
          >
            Export Selected
          </Button>
        </div>
      )}

      <Table
        rowSelection={rowSelection}
        columns={columns}
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
      />

      {/* View Order Modal */}
      <Modal
        title={`Order Details - #${viewOrder?.id.slice(-8)}`}
        open={!!viewOrder}
        onCancel={() => setViewOrder(null)}
        footer={null}
        width={800}
      >
        {viewOrder && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <h4 style={{ marginBottom: "16px" }}>Customer Information</h4>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Name">
                    {viewOrder.customerName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {viewOrder.customerEmail}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {viewOrder.customerPhone}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <h4 style={{ marginBottom: "16px" }}>Order Information</h4>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Status">
                    {getStatusTag(viewOrder.orderStatus)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment">
                    {getPaymentStatusTag(viewOrder.paymentStatus)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Method">
                    {viewOrder.paymentMethod}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    {formatDate(viewOrder.createdAt)}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <div style={{ marginTop: "24px" }}>
              <h4
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EnvironmentOutlined style={{ marginRight: "8px" }} />
                Delivery Information
              </h4>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Address">
                  {viewOrder.deliveryAddress}
                </Descriptions.Item>
                {viewOrder.deliveryInstructions && (
                  <Descriptions.Item label="Instructions">
                    {viewOrder.deliveryInstructions}
                  </Descriptions.Item>
                )}
                {viewOrder.estimatedDeliveryTime && (
                  <Descriptions.Item label="Estimated Time">
                    {viewOrder.estimatedDeliveryTime}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>

            <div style={{ marginTop: "24px" }}>
              <h4 style={{ marginBottom: "16px" }}>Order Items</h4>
              {viewOrder.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold" }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Qty: {item.quantity}
                    </div>
                    {item.specialInstructions && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Note: {item.specialInstructions}
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: "bold" }}>
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "24px",
                borderTop: "1px solid #d9d9d9",
                paddingTop: "16px",
              }}
            >
              <h4 style={{ marginBottom: "16px" }}>Order Summary</h4>
              <div style={{ fontSize: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>Subtotal:</span>
                  <span>{formatCurrency(viewOrder.totalAmount)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>Delivery Fee:</span>
                  <span>{formatCurrency(viewOrder.deliveryFee)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>Service Fee:</span>
                  <span>{formatCurrency(viewOrder.serviceFee)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    borderTop: "1px solid #d9d9d9",
                    paddingTop: "8px",
                    marginTop: "8px",
                  }}
                >
                  <span>Total:</span>
                  <span>{formatCurrency(viewOrder.finalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        title={`Update Order Status - #${editOrder?.id.slice(-8)}`}
        open={!!editOrder}
        onOk={handleUpdateStatus}
        onCancel={() => setEditOrder(null)}
        okButtonProps={{ disabled: !newStatus }}
      >
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            New Status
          </label>
          <Select
            style={{ width: "100%" }}
            placeholder="Select new status"
            value={newStatus}
            onChange={setNewStatus}
          >
            {/* [pending, processing, accepted, preparing, ready_for_pickup,
            delivered, cancelled] */}
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="processing">processing</Select.Option>
            {/* <Select.Option value="preparing">Preparing</Select.Option> */}
            {/* <Select.Option value="ready_for_pickup">Ready</Select.Option>
            <Select.Option value="out_for_delivery">
              Out for Delivery
            </Select.Option> */}
            <Select.Option value="delivered">Delivered</Select.Option>
            <Select.Option value="cancelled">Cancelled</Select.Option>
          </Select>
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Notes (Optional)
          </label>
          <TextArea
            placeholder="Add any notes about this status change..."
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
}
