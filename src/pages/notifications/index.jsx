/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { Bell, Check, Trash2 } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function NotificationsPage() {
  const { session } = useSession();
  const token = session?.token;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Mock notifications data - replace with actual API call
  const mockNotifications = [
    {
      id: "1",
      title: "New Order Received",
      message: "Order #ORD-12345 has been placed by John Doe",
      type: "order",
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      priority: "high",
      actionUrl: "/orders/ORD-12345",
    },
    {
      id: "2",
      title: "Payment Successful",
      message: "Payment of ₦15,500 has been processed successfully",
      type: "payment",
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      priority: "medium",
      actionUrl: "/transactions/TRX-67890",
    },
    {
      id: "3",
      title: "New Business Registration",
      message: "KFC Restaurant has completed their registration",
      type: "business",
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: "low",
      actionUrl: "/businesses/BUS-11111",
    },
    {
      id: "4",
      title: "System Maintenance",
      message:
        "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM",
      type: "system",
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      actionUrl: null,
    },
    {
      id: "5",
      title: "Low Stock Alert",
      message: "MedPlus Pharmacy has 3 items running low on stock",
      type: "alert",
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      actionUrl: "/inventory/low-stock",
    },
  ];

  useEffect(() => {
    fetchNotifications();
  }, [token, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/api/notifications?filter=${filter}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();

      // Using mock data for now
      let filteredNotifications = mockNotifications;
      if (filter === "unread") {
        filteredNotifications = mockNotifications.filter((n) => !n.isRead);
      } else if (filter === "read") {
        filteredNotifications = mockNotifications.filter((n) => n.isRead);
      }

      setNotifications(filteredNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // API call to mark as read
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // API call to mark all as read
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // API call to delete notification
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteSelected = async () => {
    try {
      // API call to delete selected notifications
      setNotifications((prev) =>
        prev.filter((n) => !selectedNotifications.includes(n.id))
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error("Error deleting selected notifications:", error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "order":
        return (
          <div
            className={`${iconClass} bg-blue-100 text-blue-600 rounded-full p-1`}
          >
            📦
          </div>
        );
      case "payment":
        return (
          <div
            className={`${iconClass} bg-green-100 text-green-600 rounded-full p-1`}
          >
            💳
          </div>
        );
      case "business":
        return (
          <div
            className={`${iconClass} bg-purple-100 text-purple-600 rounded-full p-1`}
          >
            🏢
          </div>
        );
      case "system":
        return (
          <div
            className={`${iconClass} bg-orange-100 text-orange-600 rounded-full p-1`}
          >
            ⚙️
          </div>
        );
      case "alert":
        return (
          <div
            className={`${iconClass} bg-red-100 text-red-600 rounded-full p-1`}
          >
            ⚠️
          </div>
        );
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-600 text-sm">
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "All caught up!"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark All Read
            </button>
          )}
          {selectedNotifications.length > 0 && (
            <button
              onClick={deleteSelected}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected ({selectedNotifications.length})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "unread", "read"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              filter === filterType
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 ${getPriorityColor(
                notification.priority
              )} bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Selection checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedNotifications((prev) => [
                          ...prev,
                          notification.id,
                        ]);
                      } else {
                        setSelectedNotifications((prev) =>
                          prev.filter((id) => id !== notification.id)
                        );
                      }
                    }}
                    className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />

                  {/* Notification icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Notification content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3
                          className={`text-sm font-medium ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 w-2 h-2 bg-orange-600 rounded-full inline-block"></span>
                          )}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            notification.isRead
                              ? "text-gray-500"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action button for notifications with actionUrl */}
                    {notification.actionUrl && (
                      <button
                        onClick={() => {
                          // Navigate to the action URL
                          window.location.href = notification.actionUrl;
                          if (!notification.isRead) {
                            markAsRead(notification.id);
                          }
                        }}
                        className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        View Details →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load more button (if needed) */}
      {notifications.length > 0 && (
        <div className="text-center pt-4">
          <button className="px-6 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Load More Notifications
          </button>
        </div>
      )}
    </div>
  );
}
