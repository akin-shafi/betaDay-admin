import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSession } from "@/hooks/useSession";
import { vendorService } from "@/services/vendorService";
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiUser } from "react-icons/fi";

export default function VendorDetailsPageOld() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getVendorById(id, session?.token);
      setVendor(data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          Vendor not found
        </h2>
        <p className="mt-2 text-gray-600">
          The vendor you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/vendors")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-[#ff6600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6600]"
        >
          <FiArrowLeft className="mr-2" /> Back to Vendors
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate("/vendors")}
          className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" /> Back to Vendors
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {vendor.businessName}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Business Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiUser className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Owner Name
                  </p>
                  <p className="text-sm text-gray-600">{vendor.ownerName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiMail className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{vendor.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiPhone className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{vendor.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{vendor.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Business Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {vendor.totalOrders || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₦{(vendor.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Order Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₦{(vendor.averageOrderValue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Account Status
            </h2>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  vendor.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {vendor.status}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  /* Handle edit */
                }}
                className="w-full px-4 py-2 text-sm font-medium text-[#ff6600] bg-white border border-[#ff6600] rounded-md hover:bg-[#fff5eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6600]"
              >
                Edit Vendor
              </button>
              <button
                onClick={() => {
                  /* Handle status toggle */
                }}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-[#ff6600] border border-transparent rounded-md hover:bg-[#ff8533] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6600]"
              >
                {vendor.status === "active" ? "Deactivate" : "Activate"} Vendor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
