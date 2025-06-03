export interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  totalAmount: number
  deliveryFee: number
  serviceFee: number
  finalAmount: number
  paymentMethod: "wallet" | "gateway"
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  orderStatus: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  deliveryAddress: string
  deliveryInstructions?: string
  estimatedDeliveryTime?: string
  gatewayReference?: string
  gatewayStatus?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  specialInstructions?: string
}

export interface OrderAnalytics {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  averageOrderValue: number
  todayOrders: number
  todayRevenue: number
  recentOrders: Order[]
}

export interface OrderFilters {
  status?: string
  paymentMethod?: string
  paymentStatus?: string
  dateRange?: {
    from: string
    to: string
  }
  search?: string
}
