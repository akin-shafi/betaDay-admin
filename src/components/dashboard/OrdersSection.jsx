import { useState } from "react";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiMapPin,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";

export function OrdersSection() {
  const [dateRange, setDateRange] = useState("7");
  const [orderStatus, setOrderStatus] = useState("all");
  const [businessType, setBusinessType] = useState("all");

  const orderStatusStats = [
    {
      status: "In Progress",
      count: 45,
      icon: <FiClock className="text-xl text-blue-500" />,
    },
    {
      status: "Completed",
      count: 156,
      icon: <FiCheckCircle className="text-xl text-green-500" />,
    },
    {
      status: "Cancelled",
      count: 12,
      icon: <FiXCircle className="text-xl text-red-500" />,
    },
    {
      status: "Out for Delivery",
      count: 28,
      icon: <FiTruck className="text-xl text-purple-500" />,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      business: "MedPlus Pharmacy",
      amount: "₦12,500",
      status: "In Progress",
      time: "10 mins ago",
      location: "Lekki Phase 1",
      items: "3 items",
      type: "Pharmacy",
    },
    {
      id: "ORD-002",
      customer: "Sarah Wilson",
      business: "Shoprite Supermarket",
      amount: "₦8,750",
      status: "Completed",
      time: "25 mins ago",
      location: "Victoria Island",
      items: "5 items",
      type: "Supermarket",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      business: "KFC Restaurant",
      amount: "₦5,200",
      status: "Pending",
      time: "45 mins ago",
      location: "Ikeja",
      items: "2 items",
      type: "Restaurant",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Orders Overview</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <FiCalendar className="text-gray-500" />
            <select
              className="border-none text-sm focus:outline-none"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <FiFilter className="text-gray-500" />
            <select
              className="border-none text-sm focus:outline-none"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="delivery">Out for Delivery</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <FiFilter className="text-gray-500" />
            <select
              className="border-none text-sm focus:outline-none"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            >
              <option value="all">All Business Types</option>
              <option value="restaurant">Restaurants</option>
              <option value="pharmacy">Pharmacies</option>
              <option value="supermarket">Supermarkets</option>
              <option value="laundry">Laundry</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {orderStatusStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:shadow-lg transition-all cursor-pointer"
          >
            {stat.icon}
            <div>
              <p className="text-sm text-gray-600">{stat.status}</p>
              <p className="text-2xl font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <button className="text-[#ff6600] text-sm hover:underline">
              View All Orders
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer border"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{order.id}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {order.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.business}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FiMapPin className="text-gray-400 text-xs" />
                    <span className="text-xs text-gray-500">
                      {order.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <p className="text-sm text-gray-600">{order.status}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                  <p className="text-xs text-gray-500">{order.items}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
