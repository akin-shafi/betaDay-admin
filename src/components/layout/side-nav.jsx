"use client";

/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import logoImage from "@/assets/images/logo-white.png";
import {
  LayoutDashboard,
  User,
  Users,
  Utensils,
  ShoppingCart,
  MapPin,
  Bike,
  FileText,
  BarChart3,
  Settings,
  Store,
  Tags,
  AlertCircle,
  Wallet,
  X,
} from "lucide-react";

const SideNav = forwardRef(({ isOpen, onClose, isMobile }, ref) => {
  const location = useLocation();
  const { session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const dashboardPath = isAdmin ? "/admin" : "/dashboard";

  const routes = [
    {
      path: dashboardPath,
      icon: LayoutDashboard,
      title: "Dashboard",
    },
    {
      path: "/analytics",
      icon: BarChart3,
      title: "Analytics",
      showFor: ["admin"],
    },
    {
      path: "/orders-mgt",
      icon: ShoppingCart,
      title: "Orders",
    },
    {
      path: "/rate-mgt",
      icon: MapPin,
      title: "Rate Mgt",
    },
    {
      path: "/users",
      icon: User,
      title: "Users",
      showFor: ["admin"],
    },
    {
      path: "/vendors",
      icon: Store,
      title: "Vendors",
      showFor: ["admin"],
    },
    {
      path: "/groups",
      icon: Users,
      title: "Business Types",
      showFor: ["admin"],
    },
    {
      path: "/meals",
      icon: Utensils,
      title: "Meal",
      showFor: ["admin"],
    },
    {
      path: "/categories",
      icon: Tags,
      title: "Categories",
      showFor: ["admin"],
    },
    {
      path: "/riders",
      icon: Bike,
      title: "Riders",
    },
    {
      path: "/transactions",
      icon: Wallet,
      title: "Transactions",
      showFor: ["admin"],
    },
    {
      path: "/reports",
      icon: FileText,
      title: "Reports",
      showFor: ["admin"],
    },
    {
      path: "/support",
      icon: AlertCircle,
      title: "Support",
    },
    {
      path: "/settings",
      icon: Settings,
      title: "Settings",
    },
  ];

  // Filter routes based on user role
  const filteredRoutes = routes.filter(
    (route) => !route.showFor || route.showFor.includes(session?.user?.role)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={ref}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${!isMobile ? "lg:translate-x-0" : ""}`}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link to={dashboardPath} className="flex items-center">
              <img
                src={logoImage || "/placeholder.svg"}
                alt="BetaDay Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>

            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-gray-800 transition-colors lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4" role="navigation">
            <ul className="space-y-1 px-3">
              {filteredRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = location.pathname === route.path;

                return (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-orange-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                      onClick={() => isMobile && onClose()}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{route.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile Section */}
          {session?.user && (
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                  {session.user.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user.fullName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.user.email}
                  </p>
                  <p className="text-xs text-orange-400 capitalize">
                    {session.user.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
});

SideNav.displayName = "SideNav";

export default SideNav;
