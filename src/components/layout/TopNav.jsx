/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import AvatarImage from "@/assets/images/default_user.png";
import { SearchIcon, NotificationIcon, OpenSideNav } from "../Icon";

const TopNav = ({ onMenuClick }) => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

  const profilePicture = session?.user?.profilePicture;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        setSideNavOpen(false);
      }
    };

    if (sideNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sideNavOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="md:hidden p-2">
            <OpenSideNav />
          </button>
          <div className="hidden md:block w-64">
            <h2 className="text-xl font-semibold text-gray-800">BetaDay</h2>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <div className="h-10 bg-[#F0F2F5] rounded-lg flex items-center gap-2 px-4">
            <SearchIcon />
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search here..."
              className="w-full bg-transparent h-full outline-0 border-0 placeholder:text-[#667185] font-normal text-[14px]"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 relative">
            <NotificationIcon />
            <div className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center bg-[#475367] text-white text-xs">
              0
            </div>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={
                profilePicture && profilePicture !== "null"
                  ? profilePicture
                  : AvatarImage
              }
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#ff6600] hover:bg-red-600 text-white py-1.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
