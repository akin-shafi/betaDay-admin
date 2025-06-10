/* eslint-disable no-unused-vars */
"use client";

/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom";
import TopNav from "./top-nav";
import SideNav from "./side-nav";

const DashboardLayout = ({ children }) => {
  const { session } = useSession();
  const navigate = useNavigate();
  const userRole = session?.user?.role;
  const isAssessorOrDataEntry =
    userRole === "assessor" || userRole === "data-entry";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      setIsMobile(mobile);

      // On mobile, sidebar should be closed by default
      // On desktop, maintain current state
      if (mobile && !isMobile) {
        setIsSidebarOpen(false);
      } else if (!mobile && isMobile) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Redirect to login if session is null
  useEffect(() => {
    if (!session) {
      navigate("/auth/login");
    }
  }, [session, navigate]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMobile &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isMobile && isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNav onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <SideNav
          ref={sidebarRef}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen && !isMobile ? "lg:ml-64" : "ml-0"
          }`}
        >
          <div className="pt-16 min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
