export function FeesCard({ title, data, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <div className="h-8 mt-2 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl border">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-sm text-red-500 mt-2">Error loading data</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="text-2xl font-bold text-gray-900 mt-2">
        ₦{data?.total ? Number(data.total).toLocaleString() : "0"}
      </p>
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-gray-500">Orders: {data?.count || 0}</span>
        <span className="text-gray-500">Avg: ₦{data?.average ? Number(data.average).toLocaleString() : "0"}</span>
      </div>
    </div>
  )
}
