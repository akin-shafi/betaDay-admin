/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom"; // Using react-router-dom instead of next/link and next/router
import {
  DashboardIcon,
  NewCandidateIcon,
  CloseIcon,
  SettingsIcon,
  AnnouncementIcon,
  CalendarIcon,
} from "../Icon";
import WhiteLogo from "../whiteLogo";

import UserAvatar from "../UserAvatar";

const SideNav = forwardRef(({ isOpen, onClose, isApplicant }, ref) => {
  const location = useLocation(); // Get the current location (path)
  const currentPath = location.pathname;

  // Function to determine the active link class
  const getLinkClass = (path) => {
    return currentPath === path
      ? "w-full h-[40px] rounded-[4px] bg-appGreen text-white group flex items-center gap-2 pl-4 transition-all duration-500 hover:bg-[#EBF1FD] hover:text-secondary"
      : "w-full h-[40px] rounded-[4px] bg-gray text-black group flex items-center gap-2 pl-4 transition-all duration-500 hover:bg-appGreen hover:text-secondary";
  };

  // Function to determine the icon class based on active path
  const getIconClass = (path) => {
    return currentPath === path
      ? "fill-secondary"
      : "fill-secondary group-hover:fill-secondary";
  };

  return (
    <aside
      ref={ref}
      className={`fixed top-0 left-0 h-full w-64 bg-[#032541] text-white transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:w-1/4 md:static md:translate-x-0 z-50 p-4`}
    >
      <div className="w-full h-full flex flex-col gap-3 justify-between">
        <div className="flex justify-between">
          <div className="text-center">
            <Link to="/">
              <WhiteLogo />
            </Link>
          </div>
          <button onClick={onClose} className="md:hidden p-2">
            <CloseIcon />
          </button>
        </div>
        <div className="w-full h-full flex flex-col gap-3">
          {isApplicant ? (
            // Applicant navigation links
            <>
              <Link to="/dashboard" className={getLinkClass("/dashboard")}>
                <DashboardIcon className={getIconClass("/dashboard")} />
                <span className="mt-1">Dashboard User</span>
              </Link>

              <Link
                to="/dashboard/job-offer"
                className={getLinkClass("/dashboard/job-offer")}
              >
                <AnnouncementIcon
                  className={getIconClass("/dashboard/job-offer")}
                />
                <span className="mt-1">Job offers</span>
              </Link>

              <Link
                to="/dashboard/schedule"
                className={getLinkClass("/dashboard/schedule")}
              >
                <CalendarIcon className={getIconClass("/dashboard/schedule")} />
                <span className="mt-1">Schedule</span>
              </Link>
              {/* Add more applicant-specific links here */}
            </>
          ) : (
            // Admin navigation links
            <>
              <Link to="/admin" className={getLinkClass("/admin")}>
                <DashboardIcon className={getIconClass("/admin")} />
                <span className="mt-1">Dashboard</span>
              </Link>

              <Link to="/all-users" className={getLinkClass("/all-users")}>
                <NewCandidateIcon className={getIconClass("/all-users")} />
                <span className="mt-1">All Users</span>
              </Link>

              <Link
                to="/all-institutions"
                className={getLinkClass("/all-institutions")}
              >
                <CalendarIcon className={getIconClass("/all-institutions")} />
                <span className="mt-1">Institutions</span>
              </Link>

              <Link
                to="/all-equipments"
                className={getLinkClass("/all-equipments")}
              >
                <CalendarIcon className={getIconClass("/all-equipments")} />
                <span className="mt-1">Equipments</span>
              </Link>

              {/* Add more admin-specific links here */}
            </>
          )}
          <hr className="bg-gray-600" />
        </div>
        <div className="w-full flex flex-col gap-3">
          {isApplicant ? (
            // Applicant settings links
            <>
              <Link
                to="/dashboard/settings"
                className={getLinkClass("/dashboard/settings")}
              >
                <SettingsIcon className={getIconClass("/dashboard/settings")} />
                <span className="mt-1">Settings</span>
              </Link>
              {/* Add more applicant-specific links here */}
            </>
          ) : (
            // Admin settings link
            <>
              <Link
                to="/admin/settings"
                className={getLinkClass("/admin/settings")}
              >
                <SettingsIcon className={getIconClass("/admin/settings")} />
                <span className="mt-1">Settings</span>
              </Link>
            </>
          )}
          <UserAvatar />
        </div>
      </div>
    </aside>
  );
});

export default SideNav;
