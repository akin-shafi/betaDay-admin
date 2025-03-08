import { useState } from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiFilter,
  FiCalendar,
  FiStar,
} from "react-icons/fi";

export function BusinessPerformanceSection() {
  const [dateRange, setDateRange] = useState("7");
  const [businessType, setBusinessType] = useState("all");
  const [sortBy, setSortBy] = useState("revenue");

  const businessStats = [
    {
      title: "Restaurants",
      count: "156",
      trend: "+12 new",
      icon: <FiTrendingUp className="text-xl" />,
      revenue: "₦5.2M",
      avgOrderValue: "₦3,500",
      topPerformers: ["KFC", "Chicken Republic", "Domino's"],
      orderCount: "856",
      avgDeliveryTime: "35 mins",
      customerSatisfaction: "4.8",
    },
    {
      title: "Pharmacies",
      count: "48",
      trend: "+3 new",
      icon: <FiShoppingBag className="text-xl" />,
      revenue: "₦3.8M",
      avgOrderValue: "₦12,500",
      topPerformers: ["MedPlus", "HealthPlus", "Pharmacy Plus"],
      orderCount: "234",
      avgDeliveryTime: "45 mins",
      customerSatisfaction: "4.7",
    },
    {
      title: "Supermarkets",
      count: "89",
      trend: "+5 new",
      icon: <FiShoppingBag className="text-xl" />,
      revenue: "₦8.5M",
      avgOrderValue: "₦15,000",
      topPerformers: ["Shoprite", "SPAR", "Market Square"],
      orderCount: "567",
      avgDeliveryTime: "50 mins",
      customerSatisfaction: "4.6",
    },
    {
      title: "Laundry",
      count: "34",
      trend: "+2 new",
      icon: <FiShoppingBag className="text-xl" />,
      revenue: "₦1.2M",
      avgOrderValue: "₦4,500",
      topPerformers: ["WashDay", "CleanPro", "LaundryKing"],
      orderCount: "189",
      avgDeliveryTime: "24 hrs",
      customerSatisfaction: "4.5",
    },
  ];

  const topVendors = [
    {
      name: "Shoprite",
      type: "Supermarket",
      orders: "1.2k",
      rating: 4.8,
      revenue: "₦2.5M",
      growth: "+15%",
      topItems: ["Groceries", "Home Essentials"],
      customerRetention: "85%",
      avgDeliveryTime: "45 mins",
    },
    {
      name: "MedPlus",
      type: "Pharmacy",
      orders: "856",
      rating: 4.7,
      revenue: "₦1.8M",
      growth: "+12%",
      topItems: ["Medications", "Personal Care"],
      customerRetention: "90%",
      avgDeliveryTime: "40 mins",
    },
    {
      name: "KFC",
      type: "Restaurant",
      orders: "923",
      rating: 4.6,
      revenue: "₦1.2M",
      growth: "+18%",
      topItems: ["Chicken Bucket", "Burgers"],
      customerRetention: "78%",
      avgDeliveryTime: "30 mins",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Business Performance
        </h2>
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

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <FiTrendingUp className="text-gray-500" />
            <select
              className="border-none text-sm focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="revenue">Sort by Revenue</option>
              <option value="orders">Sort by Orders</option>
              <option value="rating">Sort by Rating</option>
              <option value="growth">Sort by Growth</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {businessStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{stat.title}</h4>
                <p className="text-2xl font-bold mt-2">{stat.count}</p>
                <p className="text-sm text-gray-500">{stat.trend}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">{stat.icon}</div>
            </div>
            <div className="space-y-2 pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="text-sm font-medium">{stat.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Order</span>
                <span className="text-sm font-medium">
                  {stat.avgOrderValue}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Satisfaction</span>
                <span className="text-sm font-medium">
                  ⭐ {stat.customerSatisfaction}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Top Performing Vendors</h3>
            <button className="text-[#ff6600] text-sm hover:underline">
              View All Vendors
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {topVendors.map((vendor, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{vendor.name}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                        {vendor.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <FiStar className="text-yellow-400" />
                      <span className="text-sm">{vendor.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({vendor.orders} orders)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{vendor.revenue}</p>
                    <p className="text-sm text-green-600">{vendor.growth}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Top Items</p>
                    <p className="text-sm">{vendor.topItems.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer Retention</p>
                    <p className="text-sm">{vendor.customerRetention}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg. Delivery Time</p>
                    <p className="text-sm">{vendor.avgDeliveryTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
