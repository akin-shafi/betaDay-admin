import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Generate Report
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales Report Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Sales Report
              </h2>
              <button className="text-primary hover:text-primary/80">
                <span className="sr-only">Download</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Monthly sales performance and revenue analysis
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Last updated: 2 hours ago
              </span>
              <button className="text-sm text-primary hover:text-primary/80">
                View Details
              </button>
            </div>
          </div>

          {/* Orders Report Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Orders Report
              </h2>
              <button className="text-primary hover:text-primary/80">
                <span className="sr-only">Download</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Order statistics and delivery performance
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Last updated: 1 day ago
              </span>
              <button className="text-sm text-primary hover:text-primary/80">
                View Details
              </button>
            </div>
          </div>

          {/* Customer Report Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Customer Report
              </h2>
              <button className="text-primary hover:text-primary/80">
                <span className="sr-only">Download</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Customer demographics and behavior analysis
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Last updated: 3 days ago
              </span>
              <button className="text-sm text-primary hover:text-primary/80">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
