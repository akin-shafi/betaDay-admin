import { useState } from "react";
import { Area, Column, Pie, 
  // Line 
} from "@ant-design/plots";
import { FiDollarSign, FiShoppingBag, FiUsers, FiTruck } from "react-icons/fi";

export function OverviewSection() {
  const [dateRange, setDateRange] = useState("7");

  const quickStats = [
    {
      title: "Total Revenue",
      value: "₦18.7M",
      trend: "+23%",
      icon: <FiDollarSign className="text-2xl text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: "2,459",
      trend: "+15%",
      icon: <FiShoppingBag className="text-2xl text-[#ff6600]" />,
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Users",
      value: "12.5K",
      trend: "+18%",
      icon: <FiUsers className="text-2xl text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Riders",
      value: "234",
      trend: "+10%",
      icon: <FiTruck className="text-2xl text-purple-600" />,
      bgColor: "bg-purple-50",
    },
  ];

  // Revenue Trend Data
  const revenueTrendData = [
    { date: "2024-01", revenue: 1200000, orders: 1850 },
    { date: "2024-02", revenue: 1500000, orders: 2100 },
    { date: "2024-03", revenue: 1800000, orders: 2459 },
  ].map((item) => ({
    ...item,
    revenueM: `₦${(item.revenue / 1000000).toFixed(1)}M`,
  }));

  // Business Category Distribution
  const categoryData = [
    { type: "Restaurants", value: 156 },
    { type: "Supermarkets", value: 89 },
    { type: "Pharmacies", value: 48 },
    { type: "Laundry", value: 34 },
  ];

  // Order Status Distribution
  const orderStatusData = [
    { status: "Completed", count: 156 },
    { status: "In Progress", count: 45 },
    { status: "Out for Delivery", count: 28 },
    { status: "Cancelled", count: 12 },
  ];

  // Payment Methods Distribution
  const paymentMethodData = [
    { method: "Card Payments", amount: 8500000 },
    { method: "Bank Transfers", amount: 5200000 },
    { method: "Cash on Delivery", amount: 2800000 },
    { method: "Wallet Payments", amount: 1200000 },
  ].map((item) => ({
    ...item,
    amountM: `₦${(item.amount / 1000000).toFixed(1)}M`,
  }));

  const revenueConfig = {
    data: revenueTrendData,
    xField: "date",
    yField: "revenue",
    seriesField: "",
    color: "#ff6600",
    areaStyle: {
      fill: "l(270) 0:#ff660000 1:#ff6600",
    },
    xAxis: {
      title: { text: "Month" },
    },
    yAxis: {
      title: { text: "Revenue (₦)" },
      label: {
        formatter: (value) => `₦${(value / 1000000).toFixed(1)}M`,
      },
    },
    tooltip: {
      formatter: (data) => {
        return { name: "Revenue", value: data.revenueM };
      },
    },
  };

  const categoryConfig = {
    data: categoryData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name}: {percentage}",
    },
    interactions: [{ type: "element-active" }],
  };

  const orderStatusConfig = {
    data: orderStatusData,
    xField: "status",
    yField: "count",
    color: "#ff6600",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
  };

  const paymentConfig = {
    data: paymentMethodData,
    xField: "method",
    yField: "amount",
    color: "#ff6600",
    label: {
      formatter: (datum) => datum.amountM,
      style: { opacity: 0.6 },
    },
    xAxis: {
      label: { autoRotate: true },
    },
    yAxis: {
      label: {
        formatter: (value) => `₦${(value / 1000000).toFixed(1)}M`,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Platform Overview
        </h2>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
          <select
            className="border-none text-sm focus:outline-none"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <Area {...revenueConfig} height={300} />
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">
            Business Category Distribution
          </h3>
          <Pie {...categoryConfig} height={300} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">
            Order Status Distribution
          </h3>
          <Column {...orderStatusConfig} height={300} />
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <Column {...paymentConfig} height={300} />
        </div>
      </div>
    </div>
  );
}
