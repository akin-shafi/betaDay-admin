/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom"; // For programmatic navigation
import TopNav from "./TopNav";
import SideNav from "./SideNav";

const DashboardLayout = ({ children }) => {
  const { session } = useSession(); // Auth state: { user, token }
  const navigate = useNavigate(); // For programmatic navigation
  const userRole = session?.user?.role;
  // const isAssessor = userRole === "assessor";
  const isAssessorOrDataEntry =
    userRole === "assessor" || userRole === "data-entry";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);

  // Redirect to login if session is null
  useEffect(() => {
    if (!session) {
      navigate("/login"); // Redirect to login page if session is null
    }
  }, [session, navigate]);

  // Close SideNav when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show loading state until session is loaded
  if (session === undefined) {
    return <div>Loading...</div>; // Customize your loading spinner or component
  }

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
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto ml-64 p-6">
          <div className="container mx-auto px-4 py-4">
            <div className=" mt-10 bg-white rounded-[10px] border border-[#E4E7EC]  p-4 ">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
