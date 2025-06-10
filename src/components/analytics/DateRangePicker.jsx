/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Space,
  Typography,
  Divider,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export function DateRangePicker({ onChange }) {
  const [dateRange, setDateRange] = useState([]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      onChange({
        startDate: dates[0]?.toDate(),
        endDate: dates[1]?.toDate(),
      });
    } else {
      onChange({});
    }
  };

  const handleQuickSelect = (period) => {
    const now = new Date();
    let start, end;

    switch (period) {
      case "today":
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date();
        break;
      case "yesterday":
        start = new Date(now);
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case "this-week":
        start = new Date(now);
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        end = new Date();
        break;
      case "this-month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date();
        break;
      case "last-month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        break;
      default:
        start = undefined;
        end = undefined;
    }

    if (start && end) {
      const momentStart = moment(start);
      const momentEnd = moment(end);
      setDateRange([momentStart, momentEnd]);
      onChange({ startDate: start, endDate: end });
    } else {
      setDateRange([]);
      onChange({});
    }
  };

  const handleReset = () => {
    setDateRange([]);
    onChange({});
  };

  return (
    <Card bodyStyle={{ padding: "16px" }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={8}>
          <Space align="center">
            <CalendarOutlined style={{ color: "#1890ff" }} />
            <Text strong>Date Range Filter</Text>
          </Space>
        </Col>

        <Col xs={24} sm={24} md={16}>
          <Row gutter={[8, 8]} justify="start">
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                value={dateRange}
                onChange={handleDateChange}
                style={{ width: "100%" }}
                size="large"
                placeholder={["Start Date", "End Date"]}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                style={{ width: "100%" }}
                disabled={!dateRange || dateRange.length !== 2}
              >
                Apply
              </Button>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Button
                size="large"
                onClick={handleReset}
                style={{ width: "100%" }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Divider style={{ margin: "16px 0" }} />

      {/* Quick Select Buttons */}
      <Row gutter={[8, 8]} justify="start">
        <Col xs={24}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Quick Select:
          </Text>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Button
            size="small"
            onClick={() => handleQuickSelect("today")}
            style={{ width: "100%" }}
          >
            Today
          </Button>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Button
            size="small"
            onClick={() => handleQuickSelect("yesterday")}
            style={{ width: "100%" }}
          >
            Yesterday
          </Button>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Button
            size="small"
            onClick={() => handleQuickSelect("this-week")}
            style={{ width: "100%" }}
          >
            This Week
          </Button>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Button
            size="small"
            onClick={() => handleQuickSelect("this-month")}
            style={{ width: "100%" }}
          >
            This Month
          </Button>
        </Col>
        <Col xs={12} sm={6} md={3}>
          <Button
            size="small"
            onClick={() => handleQuickSelect("last-month")}
            style={{ width: "100%" }}
          >
            Last Month
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
