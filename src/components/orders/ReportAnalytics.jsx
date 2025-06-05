import React, { useState } from "react";
import { Card, Row, Col, Statistic, Table, Spin, Alert, Input } from "antd";
import PropTypes from "prop-types";

function formatCurrency(amount) {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "₦0.00";
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
} 

export function ReportAnalytics({ analytics, loading, error }) {
  // Card data
  // const totalRevenue = analytics?.totalRevenue || 0;
  const totalDeliveryFees = analytics?.totalDeliveryFees || 0;
  const totalServiceFees = analytics?.totalServiceFees || 0;

  // Table data
  const revenueByBusiness = analytics?.revenueByBusiness || [];
  const deliveryFeesByBusiness = analytics?.deliveryFeesByBusiness || [];
  const serviceFeesByBusiness = analytics?.serviceFeesByBusiness || [];

  // Search state
  const [revenueSearch, setRevenueSearch] = useState("");
  const [deliverySearch, setDeliverySearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // Pagination state
  const [revenuePage, setRevenuePage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const pageSize = 5;

  // Filtered data
  const filteredRevenue = revenueByBusiness.filter((item) =>
    item.business.toLowerCase().includes(revenueSearch.toLowerCase())
  );
  const filteredDelivery = deliveryFeesByBusiness.filter((item) =>
    item.business.toLowerCase().includes(deliverySearch.toLowerCase())
  );
  const filteredService = serviceFeesByBusiness.filter((item) =>
    item.business.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Alert
          message="Error"
          description="Failed to load analytics data. Please try again later."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Card Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Revenue" value={formatCurrency(totalRevenue)} />
          </Card>
        </Col> */}
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Delivery Fees" value={formatCurrency(totalDeliveryFees)} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Service Fees" value={formatCurrency(totalServiceFees)} />
          </Card>
        </Col>
      </Row>

      {/* Revenue Table */}
      <Card title="Total Revenue by Business" style={{ marginBottom: 24 }}>
        <Input.Search
          placeholder="Search business..."
          allowClear
          style={{ width: 300, marginBottom: 16 }}
          value={revenueSearch}
          onChange={e => {
            setRevenueSearch(e.target.value);
            setRevenuePage(1);
          }}
        />
        <Table
          dataSource={filteredRevenue.slice((revenuePage-1)*pageSize, revenuePage*pageSize)}
          columns={[
            { title: "Business", dataIndex: "business", key: "business" },
            { title: "Revenue", dataIndex: "revenue", key: "revenue", render: formatCurrency },
          ]}
          rowKey="business"
          pagination={{
            current: revenuePage,
            pageSize,
            total: filteredRevenue.length,
            onChange: setRevenuePage,
            showSizeChanger: false,
          }}
        />
      </Card>

      {/* Delivery and Service Fees Tables Side by Side */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Delivery Fees by Business" style={{ marginBottom: 24 }}>
            <Input.Search
              placeholder="Search business..."
              allowClear
              style={{ width: 300, marginBottom: 16 }}
              value={deliverySearch}
              onChange={e => {
                setDeliverySearch(e.target.value);
                setDeliveryPage(1);
              }}
            />
            <Table
              dataSource={filteredDelivery.slice((deliveryPage-1)*pageSize, deliveryPage*pageSize)}
              columns={[
                { title: "Business", dataIndex: "business", key: "business" },
                { title: "Delivery Fees", dataIndex: "deliveryFee", key: "deliveryFee", render: formatCurrency },
              ]}
              rowKey="business"
              pagination={{
                current: deliveryPage,
                pageSize,
                total: filteredDelivery.length,
                onChange: setDeliveryPage,
                showSizeChanger: false,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Service Fees by Business" style={{ marginBottom: 24 }}>
            <Input.Search
              placeholder="Search business..."
              allowClear
              style={{ width: 300, marginBottom: 16 }}
              value={serviceSearch}
              onChange={e => {
                setServiceSearch(e.target.value);
                setServicePage(1);
              }}
            />
            <Table
              dataSource={filteredService.slice((servicePage-1)*pageSize, servicePage*pageSize)}
              columns={[
                { title: "Business", dataIndex: "business", key: "business" },
                { title: "Service Fees", dataIndex: "serviceFee", key: "serviceFee", render: formatCurrency },
              ]}
              rowKey="business"
              pagination={{
                current: servicePage,
                pageSize,
                total: filteredService.length,
                onChange: setServicePage,
                showSizeChanger: false,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

ReportAnalytics.propTypes = {
  analytics: PropTypes.shape({
    // totalRevenue: PropTypes.number,
    totalDeliveryFees: PropTypes.number,
    totalServiceFees: PropTypes.number,
    revenueByBusiness: PropTypes.arrayOf(
      PropTypes.shape({
        business: PropTypes.string,
        revenue: PropTypes.number,
      })
    ),
    deliveryFeesByBusiness: PropTypes.arrayOf(
      PropTypes.shape({
        business: PropTypes.string,
        deliveryFee: PropTypes.number,
      })
    ),
    serviceFeesByBusiness: PropTypes.arrayOf(
      PropTypes.shape({
        business: PropTypes.string,
        serviceFee: PropTypes.number,
      })
    ),
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
}; 