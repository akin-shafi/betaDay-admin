/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import {
  Input,
  Select,
  Button,
  Badge,
  Space,
  Collapse,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";

const { Text } = Typography;
const { Panel } = Collapse;

export function OrderFiltersComponent({
  filters,
  onFiltersChange,
  onExport,
  onRefresh,
  totalOrders,
  filteredOrders,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      status: "all",
      paymentMethod: "all",
      paymentStatus: "all",
      dateRange: null,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const debouncedHandleFilterChange = debounce((key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  }, 300);

  const activeFiltersCount = Object.values(localFilters).filter(
    (value) => value && value !== "all" && value !== null
  ).length;

  // Mobile view uses a collapsible panel for filters
  const renderMobileFilters = () => (
    <div className="lg:hidden mb-4">
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="bg-gray-50"
      >
        <Panel
          header={
            <Space>
              <FilterOutlined />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge
                  count={activeFiltersCount}
                  size="small"
                  className="bg-blue-500"
                />
              )}
            </Space>
          }
          key="1"
        >
          <div className="space-y-3">
            <Input
              placeholder="Search orders, customers..."
              prefix={<SearchOutlined />}
              value={localFilters.search || ""}
              onChange={(e) =>
                debouncedHandleFilterChange("search", e.target.value)
              }
              size="large"
            />

            <Select
              placeholder="Order Status"
              className="w-full"
              value={localFilters.status || "all"}
              onChange={(value) => handleFilterChange("status", value)}
              size="large"
            >
              <Select.Option value="all">All Statuses</Select.Option>
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

            <Select
              placeholder="Payment Method"
              className="w-full"
              value={localFilters.paymentMethod || "all"}
              onChange={(value) => handleFilterChange("paymentMethod", value)}
              size="large"
            >
              <Select.Option value="all">All Payment Methods</Select.Option>
              <Select.Option value="wallet">Wallet</Select.Option>
              <Select.Option value="cash">Cash on Delivery</Select.Option>
              <Select.Option value="paystack_card">
                Card (Paystack)
              </Select.Option>
              <Select.Option value="paystack_bank">
                Bank Transfer (Paystack)
              </Select.Option>
              <Select.Option value="paystack_ussd">
                USSD (Paystack)
              </Select.Option>
              <Select.Option value="opay_card">Card (Opay)</Select.Option>
              <Select.Option value="opay_bank">
                Bank Transfer (Opay)
              </Select.Option>
              <Select.Option value="opay_wallet">Opay Wallet</Select.Option>
              <Select.Option value="opay_ussd">USSD (Opay)</Select.Option>
            </Select>

            <Select
              placeholder="Payment Status"
              className="w-full"
              value={localFilters.paymentStatus || "all"}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
              size="large"
            >
              <Select.Option value="all">All Payment Statuses</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="processing">Processing</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
              <Select.Option value="refunded">Refunded</Select.Option>
            </Select>

            {activeFiltersCount > 0 && (
              <Button
                type="default"
                icon={<FilterOutlined />}
                onClick={clearFilters}
                block
              >
                Clear All Filters ({activeFiltersCount})
              </Button>
            )}
          </div>
        </Panel>
      </Collapse>
    </div>
  );

  return (
    <div className="mb-4">
      {/* Mobile View Stats and Actions */}
      <div className="lg:hidden mb-3">
        <div className="flex justify-between items-center">
          <Badge
            count={`${filteredOrders} of ${totalOrders}`}
            className="bg-blue-500"
            overflowCount={9999}
          />
          <Space>
            <Button icon={<ReloadOutlined />} onClick={onRefresh} size="middle">
              Refresh
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={onExport}
              size="middle"
            >
              Export
            </Button>
          </Space>
        </div>
      </div>

      {/* Mobile Filters */}
      {renderMobileFilters()}

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-3 items-center mb-3">
          <div className="col-span-4">
            <Input
              placeholder="Search orders, customers, or order IDs..."
              prefix={<SearchOutlined />}
              value={localFilters.search || ""}
              onChange={(e) =>
                debouncedHandleFilterChange("search", e.target.value)
              }
            />
          </div>

          <div className="col-span-2">
            <Select
              placeholder="Order Status"
              className="w-full"
              value={localFilters.status || "all"}
              onChange={(value) => handleFilterChange("status", value)}
            >
              <Select.Option value="all">All Statuses</Select.Option>
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

          <div className="col-span-2">
            <Select
              placeholder="Payment Method"
              className="w-full"
              value={localFilters.paymentMethod || "all"}
              onChange={(value) => handleFilterChange("paymentMethod", value)}
            >
              <Select.Option value="all">All Methods</Select.Option>
              <Select.Option value="wallet">Wallet</Select.Option>
              <Select.Option value="cash">Cash on Delivery</Select.Option>
              <Select.Option value="paystack_card">
                Card (Paystack)
              </Select.Option>
              <Select.Option value="paystack_bank">
                Bank Transfer (Paystack)
              </Select.Option>
              <Select.Option value="paystack_ussd">
                USSD (Paystack)
              </Select.Option>
              <Select.Option value="opay_card">Card (Opay)</Select.Option>
              <Select.Option value="opay_bank">
                Bank Transfer (Opay)
              </Select.Option>
              <Select.Option value="opay_wallet">Opay Wallet</Select.Option>
              <Select.Option value="opay_ussd">USSD (Opay)</Select.Option>
            </Select>
          </div>

          <div className="col-span-2">
            <Select
              placeholder="Payment Status"
              className="w-full"
              value={localFilters.paymentStatus || "all"}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
            >
              <Select.Option value="all">All Payments</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="processing">Processing</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
              <Select.Option value="refunded">Refunded</Select.Option>
            </Select>
          </div>

          <div className="col-span-2">
            <Space>
              {activeFiltersCount > 0 && (
                <Button icon={<FilterOutlined />} onClick={clearFilters}>
                  Clear ({activeFiltersCount})
                </Button>
              )}
              <Badge
                count={`${filteredOrders} of ${totalOrders}`}
                className="bg-blue-500"
                overflowCount={9999}
              />
            </Space>
          </div>
        </div>

        <div className="flex justify-end">
          <Space>
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>
              Refresh
            </Button>
            <Button icon={<DownloadOutlined />} onClick={onExport}>
              Export
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
