/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import { useState } from "react"
import { Card, Row, Col, Input, Select, Button, Badge, DatePicker } from "antd"
import { SearchOutlined, FilterOutlined, DownloadOutlined, ReloadOutlined } from "@ant-design/icons"

const { RangePicker } = DatePicker

export function OrderFiltersComponent({ filters, onFiltersChange, onExport, onRefresh, totalOrders, filteredOrders }) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const activeFiltersCount = Object.values(localFilters).filter(Boolean).length

  return (
    <Card
      title="Order Management"
      style={{ marginBottom: "24px" }}
      extra={
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Badge count={`${filteredOrders} of ${totalOrders}`} showZero />
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            Export
          </Button>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Search orders, customers, or order IDs..."
            prefix={<SearchOutlined />}
            value={localFilters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </Col>

        <Col xs={24} md={4}>
          <Select
            placeholder="Order Status"
            style={{ width: "100%" }}
            value={localFilters.status || "all"}
            onChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
          >
            <Select.Option value="all">All Statuses</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="confirmed">Confirmed</Select.Option>
            <Select.Option value="preparing">Preparing</Select.Option>
            <Select.Option value="ready">Ready</Select.Option>
            <Select.Option value="out_for_delivery">Out for Delivery</Select.Option>
            <Select.Option value="delivered">Delivered</Select.Option>
            <Select.Option value="cancelled">Cancelled</Select.Option>
          </Select>
        </Col>

        <Col xs={24} md={4}>
          <Select
            placeholder="Payment Method"
            style={{ width: "100%" }}
            value={localFilters.paymentMethod || "all"}
            onChange={(value) => handleFilterChange("paymentMethod", value === "all" ? undefined : value)}
          >
            <Select.Option value="all">All Methods</Select.Option>
            <Select.Option value="wallet">Wallet</Select.Option>
            <Select.Option value="gateway">Gateway</Select.Option>
          </Select>
        </Col>

        <Col xs={24} md={4}>
          <Select
            placeholder="Payment Status"
            style={{ width: "100%" }}
            value={localFilters.paymentStatus || "all"}
            onChange={(value) => handleFilterChange("paymentStatus", value === "all" ? undefined : value)}
          >
            <Select.Option value="all">All Payments</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="failed">Failed</Select.Option>
            <Select.Option value="refunded">Refunded</Select.Option>
          </Select>
        </Col>

        <Col xs={24} md={4}>
          {activeFiltersCount > 0 && (
            <Button icon={<FilterOutlined />} onClick={clearFilters}>
              Clear ({activeFiltersCount})
            </Button>
          )}
        </Col>
      </Row>
    </Card>
  )
}
