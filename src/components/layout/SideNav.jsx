/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useState, useEffect, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import logoImage from "@/assets/images/logo-white.png";

import {
  LayoutDashboard,
  Users,
  Building2,
  ShoppingCart,
  Bike,
  FileText,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

const SideNav = forwardRef(({ isOpen, onClose }, ref) => {
  const location = useLocation();
  const { session } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const routes = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
    },
    {
      path: "/users",
      icon: Users,
      title: "Users",
    },
    {
      path: "/businesses",
      icon: Building2,
      title: "Businesses",
    },
    {
      path: "/orders",
      icon: ShoppingCart,
      title: "Orders",
    },
    {
      path: "/riders",
      icon: Bike,
      title: "Riders",
    },
    {
      path: "/reports",
      icon: FileText,
      title: "Reports",
    },
    {
      path: "/analytics",
      icon: BarChart3,
      title: "Analytics",
    },
    {
      path: "/settings",
      icon: Settings,
      title: "Settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={ref}
        className={`fixed top-0 left-0 h-screen w-64 bg-[#1A1A1A] text-white transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
          )}

          {/* Logo */}
          <div className="p-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img src={logoImage} alt="Logo" className="h-10 " />
              {/* <span className="text-xl font-bold">BetaDay</span> */}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto mt-8">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = location.pathname === route.path;

              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`flex items-center px-6 py-3 text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => isMobile && onClose()}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{route.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          {session?.user && (
            <div className="p-4 bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  {session.user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {session.user.fullName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {session.user.email}
                  </div>
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
