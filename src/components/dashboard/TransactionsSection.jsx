import { useState } from "react";
import {
  FiDollarSign,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiFilter,
  FiCalendar,
  FiCreditCard,
  FiRefreshCw,
} from "react-icons/fi";

export function TransactionsSection() {
  const [dateRange, setDateRange] = useState("7");
  const [transactionType, setTransactionType] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");

  const transactionStats = [
    {
      title: "Total Revenue",
      amount: "₦18.7M",
      trend: "+23% from last week",
      icon: <FiDollarSign className="text-2xl text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Vendor Payouts",
      amount: "₦12.4M",
      trend: "85% of revenue",
      icon: <FiArrowUpRight className="text-2xl text-orange-600" />,
      bgColor: "bg-orange-50",
    },
    {
      title: "Platform Fees",
      amount: "₦2.8M",
      trend: "15% of revenue",
      icon: <FiArrowDownLeft className="text-2xl text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Settlements",
      amount: "₦950K",
      trend: "Processing time: 24hrs",
      icon: <FiRefreshCw className="text-2xl text-yellow-600" />,
      bgColor: "bg-yellow-50",
    },
  ];

  const recentTransactions = [
    {
      id: "TRX-001",
      type: "Order Payment",
      amount: "₦12,500",
      status: "Completed",
      time: "10 mins ago",
      customer: "John Doe",
      vendor: "MedPlus Pharmacy",
      paymentMethod: "Card Payment",
      reference: "REF123456",
    },
    {
      id: "TRX-002",
      type: "Vendor Payout",
      amount: "₦45,750",
      status: "Processing",
      time: "2 hrs ago",
      customer: "System",
      vendor: "Shoprite",
      paymentMethod: "Bank Transfer",
      reference: "REF123457",
    },
    {
      id: "TRX-003",
      type: "Platform Fee",
      amount: "₦2,500",
      status: "Completed",
      time: "5 hrs ago",
      customer: "System",
      vendor: "KFC Restaurant",
      paymentMethod: "Automatic Deduction",
      reference: "REF123458",
    },
  ];

  const paymentMethods = [
    {
      method: "Card Payments",
      count: "1,234",
      volume: "₦8.5M",
      trend: "+15%",
    },
    {
      method: "Bank Transfers",
      count: "567",
      volume: "₦5.2M",
      trend: "+8%",
    },
    {
      method: "Cash on Delivery",
      count: "345",
      volume: "₦2.8M",
      trend: "-5%",
    },
    {
      method: "Wallet Payments",
      count: "189",
      volume: "₦1.2M",
      trend: "+25%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Transactions Overview
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
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="order_payment">Order Payments</option>
              <option value="vendor_payout">Vendor Payouts</option>
              <option value="platform_fee">Platform Fees</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <FiCreditCard className="text-gray-500" />
            <select
              className="border-none text-sm focus:outline-none"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="all">All Payment Methods</option>
              <option value="card">Card Payments</option>
              <option value="transfer">Bank Transfers</option>
              <option value="cash">Cash on Delivery</option>
              <option value="wallet">Wallet Payments</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {transactionStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.amount}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border hover:shadow-lg transition-all"
          >
            <h4 className="font-medium text-gray-900">{method.method}</h4>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transactions</span>
                <span className="text-sm font-medium">{method.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Volume</span>
                <span className="text-sm font-medium">{method.volume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Growth</span>
                <span
                  className={`text-sm font-medium ${
                    method.trend.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {method.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <button className="text-[#ff6600] text-sm hover:underline">
              View All Transactions
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{transaction.id}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                        {transaction.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {transaction.vendor}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.customer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.status}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t text-sm">
                  <div className="text-gray-500">
                    Payment Method:{" "}
                    <span className="text-gray-900">
                      {transaction.paymentMethod}
                    </span>
                  </div>
                  <div className="text-gray-500">
                    Ref:{" "}
                    <span className="text-gray-900">
                      {transaction.reference}
                    </span>
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
