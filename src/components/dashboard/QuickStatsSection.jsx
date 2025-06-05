import { FiTrendingUp, FiShoppingCart, FiUsers, FiTruck } from "react-icons/fi"

export function QuickStatsSection({ analytics, token }) {
  const stats = [
    {
      title: "Total Revenue",
      value: analytics?.totalRevenue ? `₦${(analytics.totalRevenue / 1000000).toFixed(1)}M` : "₦0",
      icon: FiTrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders?.toLocaleString() || "0",
      icon: FiShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: "12.5K", // This would come from user analytics
      icon: FiUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Riders",
      value: "234", // This would come from rider analytics
      icon: FiTruck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="bg-white p-6 rounded-xl border">
      <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor} mr-3`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-gray-600">{stat.title}</span>
            </div>
            <span className="font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
