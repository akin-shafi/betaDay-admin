/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect } from "react";
import {
  getRevenueByBusiness,
  getDeliveryFeesByBusiness,
  getServiceFeesByBusiness,
} from "@/hooks/useAnalytics";

export function BusinessPerformanceSection({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState("revenue");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchBusinessData();
  }, [token, activeMetric]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      let response;

      switch (activeMetric) {
        case "revenue":
          response = await getRevenueByBusiness(token);
          break;
        case "deliveryFees":
          response = await getDeliveryFeesByBusiness(token);
          break;
        case "serviceFees":
          response = await getServiceFeesByBusiness(token);
          break;
        default:
          response = await getRevenueByBusiness(token);
      }

      setData(response.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { id: "revenue", label: "Revenue", color: "text-green-600" },
    { id: "deliveryFees", label: "Delivery Fees", color: "text-blue-600" },
    { id: "serviceFees", label: "Service Fees", color: "text-purple-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6600]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metric Selector */}
      <div className="bg-white p-3 rounded-lg border overflow-x-auto">
        <div className="flex gap-2">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeMetric === metric.id
                  ? "bg-[#ff6600] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Business Performance Table/Cards */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h3 className="text-base font-semibold">
            Business Performance -{" "}
            {metrics.find((m) => m.id === activeMetric)?.label}
          </h3>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden">
          <div className="divide-y">
            {data?.map((business, index) => (
              <div key={business.businessId} className="p-3 hover:bg-gray-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 bg-[#fff0e6] rounded-full flex items-center justify-center">
                    <span className="text-[#ff6600] font-semibold text-xs">
                      {index + 1}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {business.businessName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-500">Total Amount</div>
                    <div className="font-semibold">
                      ₦{Number(business.total).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-500">Order Count</div>
                    <div className="font-semibold">{business.count}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded col-span-2">
                    <div className="text-gray-500">Average per Order</div>
                    <div className="font-semibold">
                      ₦{Number(business.average).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Count
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average per Order
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.map((business, index) => (
                <tr key={business.businessId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-7 h-7 bg-[#fff0e6] rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#ff6600] font-semibold text-xs">
                          {index + 1}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {business.businessName}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    ₦{Number(business.total).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {business.count}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    ₦{Number(business.average).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
