/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom";
import TopNav from "./TopNav";
import SideNav from "./SideNav";

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
      setIsMobile(width < 1024);
      if (width < 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to login if session is null
  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  // Close SideNav when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMobile
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Top Navigation */}
      <TopNav
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <SideNav
          ref={sidebarRef}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isAssessor={isAssessorOrDataEntry}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen && !isMobile ? "lg:ml-64" : "ml-0"
          }`}
        >
          <div className="h-full p-6">
            <div className="container mx-auto">
              <div className="border mt-20 bg-white rounded-[10px] border border-[#E4E7EC] p-6">
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
