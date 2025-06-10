"use client";

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
      icon: <FiDollarSign className="text-xl text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Vendor Payouts",
      amount: "₦12.4M",
      trend: "85% of revenue",
      icon: <FiArrowUpRight className="text-xl text-orange-600" />,
      bgColor: "bg-orange-50",
    },
    {
      title: "Platform Fees",
      amount: "₦2.8M",
      trend: "15% of revenue",
      icon: <FiArrowDownLeft className="text-xl text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Settlements",
      amount: "₦950K",
      trend: "Processing time: 24hrs",
      icon: <FiRefreshCw className="text-xl text-yellow-600" />,
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
    <div className="space-y-4">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Transactions Overview
        </h2>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg border text-xs">
            <FiCalendar className="text-gray-500" />
            <select
              className="border-none focus:outline-none bg-transparent"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg border text-xs">
            <FiFilter className="text-gray-500" />
            <select
              className="border-none focus:outline-none bg-transparent"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="order_payment">Order Payments</option>
              <option value="vendor_payout">Vendor Payouts</option>
              <option value="platform_fee">Platform Fees</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg border text-xs">
            <FiCreditCard className="text-gray-500" />
            <select
              className="border-none focus:outline-none bg-transparent"
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

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {transactionStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} p-3 rounded-xl cursor-pointer hover:shadow-md transition-all`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-xs">{stat.title}</p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {stat.amount}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded-xl border hover:shadow-md transition-all"
          >
            <h4 className="font-medium text-sm text-gray-900">
              {method.method}
            </h4>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Transactions</span>
                <span className="text-xs font-medium">{method.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Volume</span>
                <span className="text-xs font-medium">{method.volume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Growth</span>
                <span
                  className={`text-xs font-medium ${
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

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="text-base font-semibold">Recent Transactions</h3>
          <button className="text-[#ff6600] text-xs hover:underline">
            View All
          </button>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden">
          <div className="divide-y">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium">{transaction.id}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100">
                        {transaction.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {transaction.vendor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{transaction.amount}</p>
                    <p className="text-xs text-gray-600">
                      {transaction.status}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-2 border-t text-xs">
                  <div className="text-gray-500">
                    {transaction.paymentMethod}
                  </div>
                  <div className="text-gray-500">{transaction.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View - Cards with more details */}
        <div className="hidden lg:block p-3">
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 rounded-lg border"
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
