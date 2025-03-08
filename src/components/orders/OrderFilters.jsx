import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import { DatePicker, Select } from "antd";
const { RangePicker } = DatePicker;

export function OrderFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onExport,
  loading,
}) {
  return (
    <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#ff6600] focus:border-[#ff6600] sm:text-sm"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Date Range */}
        <div className="w-full sm:w-auto">
          <RangePicker
            className="w-full sm:w-auto"
            onChange={onDateRangeChange}
            value={dateRange}
            placeholder={["Start Date", "End Date"]}
          />
        </div>
      </div>

      <div className="flex gap-4">
        {/* Status Filter */}
        <Select
          className="min-w-[150px]"
          value={filterStatus}
          onChange={onStatusChange}
          placeholder="Filter by status"
        >
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="processing">Processing</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6600] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiDownload className="-ml-1 mr-2 h-5 w-5" />
          Export
        </button>
      </div>
    </div>
  );
}
