/* eslint-disable react-hooks/exhaustive-deps */
"use client";

/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import DashboardLayout from "./layout/DashboardLayout";
import { message } from "antd";

// 5 minutes in milliseconds
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

export function ProtectedRoute({ children }) {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const inactivityTimer = useRef(null);

  // Reset the inactivity timer
  const resetTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      message.info("You have been logged out due to 5 minutes of inactivity.");
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  // Handle user activity
  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    if (!session) {
      localStorage.setItem("message", "Please login to access this page");
      navigate("/auth/login");
      return;
    }

    // Start the inactivity timer
    resetTimer();

    // Add event listeners for user activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup on unmount or when session changes
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [session, navigate, logout]);

  // If there's no session, don't render anything
  if (!session) {
    return null;
  }

  // Wrap the children with DashboardLayout for protected routes
  return <DashboardLayout>{children}</DashboardLayout>;
}
