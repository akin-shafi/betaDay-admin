/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiPackage,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { orderService } from "@/services/orderService";
import { useSession } from "@/hooks/useSession";
import { OrderDetailsSkeleton } from "@/components/skeletons/OrderDetailsSkeleton";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { message, Select, Timeline } from "antd";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await orderService.getOrderById(id, session?.token);
        setOrder(data.order);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.token && id) {
      fetchOrderDetails();
    }
  }, [id, session?.token]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus, session?.token);
      const data = await orderService.getOrderById(id, session?.token);
      setOrder(data.order);
      message.success("Order status updated successfully");
    } catch (error) {
      message.error(error.message);
    }
  };

  const orderTimeline = [
    {
      status: "Order Placed",
      time: order?.timeline.ordered,
      color: "blue",
    },
    {
      status: "Delivered",
      time: order?.timeline.delivered,
      color: "green",
    },
  ].filter((item) => item.time);

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          Order not found
        </h2>
        <p className="mt-2 text-gray-600">
          {`The order you're looking for doesn't exist.`}
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-[#ff6600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6600]"
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/orders")}
          className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Order #{order.id}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {format(new Date(order.createdAt), "PPP")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={order.status}
              onChange={handleStatusUpdate}
              className="min-w-[150px]"
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="accepted">Accepted</Select.Option>
              <Select.Option value="preparing">Preparing</Select.Option>
              <Select.Option value="ready_for_pickup">
                Ready for Pickup
              </Select.Option>
              <Select.Option value="picked_up">Picked Up</Select.Option>
              <Select.Option value="in_transit">In Transit</Select.Option>
              <Select.Option value="delivered">Delivered</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center text-gray-500 mb-2">
                  <FiClock className="mr-2" />
                  Delivery Time
                </div>
                <p className="text-lg font-medium text-gray-900">
                  {order.timeline.delivered
                    ? format(new Date(order.timeline.delivered), "PPP p")
                    : "Not delivered yet"}
                </p>
              </div>
              <div>
                <div className="flex items-center text-gray-500 mb-2">
                  <FiUser className="mr-2" />
                  Customer
                </div>
                <p className="text-lg font-medium text-gray-900">
                  {order.user.fullName}
                </p>
              </div>
              <div>
                <div className="flex items-center text-gray-500 mb-2">
                  <FiPackage className="mr-2" />
                  Total Items
                </div>
                <p className="text-lg font-medium text-gray-900">
                  {order.items?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center space-x-4 border-b border-gray-200 pb-4"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                      {item.specialInstructions && (
                        <span> • {item.specialInstructions}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₦{(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ₦{parseFloat(order.subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">
                    ₦{parseFloat(order.deliveryFee).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="text-gray-900">
                    ₦{parseFloat(order.serviceFee).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-medium text-gray-900">
                    ₦{parseFloat(order.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Customer Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiUser className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.user.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FiMail className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">{order.user.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiPhone className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">
                    {order.user.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    , {order.deliveryAddress.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Timeline
            </h2>
            <Timeline
              items={orderTimeline.map((item) => ({
                color: item.color,
                children: (
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.status}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(item.time), "PPP p")}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
