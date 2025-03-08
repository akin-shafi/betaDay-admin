export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <div className="flex space-x-4">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Custom Range</option>
          </select>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">$24,500</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">↑ 12%</span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">1,245</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">↑ 8%</span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        {/* Average Order Value Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Average Order Value
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">$19.68</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">↑ 4%</span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        {/* Customer Growth Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Customer Growth</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">+156</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">↑ 15%</span>
            <span className="text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Revenue Overview
          </h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Revenue chart will be displayed here
            </p>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Orders Overview
          </h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Orders chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
