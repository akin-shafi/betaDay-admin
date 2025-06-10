"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { UserModal } from "@/components/modals/UserModal";
import { OrdersSection } from "@/components/dashboard/OrdersSection";
import { BusinessPerformanceSection } from "@/components/dashboard/BusinessPerformanceSection";
import { TransactionsSection } from "@/components/dashboard/TransactionsSection";
import { FiUsers } from "react-icons/fi";

export function AdminPage() {
  const { session } = useSession();
  const token = session?.token;
  const fullname = session?.user?.fullname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInviteSubmit = (values) => {
    console.log("Inviting member with values: ", values);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "business", label: "Business" },
    { id: "transactions", label: "Transactions" },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersSection token={token} />;
      case "business":
        return <BusinessPerformanceSection token={token} />;
      case "transactions":
        return <TransactionsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h5 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Dashboard
          </h5>
          <p className="text-gray-600 text-sm">Welcome back, {fullname}</p>
        </div>
        <button
          onClick={openModal}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-[#ff6600] hover:bg-[#ff8533] text-white rounded-lg flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
        >
          <FiUsers className="text-lg" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Banner */}
      <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="w-full md:w-2/3">
          <h6 className="text-xs sm:text-sm font-semibold text-gray-300">
            PLATFORM OVERVIEW
          </h6>
          <h2 className="text-xl sm:text-2xl font-bold mt-2">
            Multi-Vendor Marketplace Dashboard
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            Monitor orders, manage vendors, and track deliveries across
            different business categories.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b overflow-x-auto scrollbar-hide">
        <nav className="flex space-x-4 sm:space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-3 px-1 whitespace-nowrap inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-[#ff6600] text-[#ff6600]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Section Content */}
      {renderActiveSection()}

      {/* User Modal */}
      <UserModal
        visible={isModalOpen}
        onClose={closeModal}
        onSubmit={handleInviteSubmit}
        showCloseIcon={true}
      />
    </div>
  );
}

// Overview Section Component
function OverviewSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="text-base font-semibold mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Total Revenue</span>
              <span className="font-semibold">₦18.7M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Total Orders</span>
              <span className="font-semibold">2,459</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Active Users</span>
              <span className="font-semibold">12.5K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Active Riders</span>
              <span className="font-semibold">234</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <h3 className="text-base font-semibold mb-3">Recent Orders</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">In Progress</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Completed</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Out for Delivery</span>
              <span className="font-semibold">28</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Cancelled</span>
              <span className="font-semibold">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <h3 className="text-base font-semibold mb-3">Business Categories</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Restaurants</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Supermarkets</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Pharmacies</span>
              <span className="font-semibold">48</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Laundry</span>
              <span className="font-semibold">34</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <h3 className="text-base font-semibold mb-3">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Card Payments</span>
              <span className="font-semibold">₦8.5M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Bank Transfers</span>
              <span className="font-semibold">₦5.2M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Cash on Delivery</span>
              <span className="font-semibold">₦2.8M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Wallet Payments</span>
              <span className="font-semibold">₦1.2M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
