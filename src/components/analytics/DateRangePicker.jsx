/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

export function DateRangePicker({ onChange }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = () => {
    onChange({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
    setIsExpanded(false);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onChange({});
    setIsExpanded(false);
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
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      onChange({ startDate: start, endDate: end });
    } else {
      handleReset();
    }
    setIsExpanded(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-3 lg:hidden">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Date Filter</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-orange-500 text-sm font-medium"
        >
          {isExpanded ? "Close" : "Open"}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center space-x-2 p-3 border-b border-gray-100">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Date Range Filter
        </span>
      </div>

      {/* Content */}
      <div
        className={`${isExpanded ? "block" : "hidden"} lg:block p-3 space-y-4`}
      >
        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Apply Filter
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Quick Select */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Quick Select:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { key: "today", label: "Today" },
              { key: "yesterday", label: "Yesterday" },
              { key: "this-week", label: "This Week" },
              { key: "this-month", label: "This Month" },
              { key: "last-month", label: "Last Month" },
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => handleQuickSelect(period.key)}
                className="px-3 py-1 bg-gray-50 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
