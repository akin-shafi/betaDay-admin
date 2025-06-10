"use client";

import { useState, useEffect } from "react";
import {
  getSession,
  setSession,
  clearSession,
  updateLastActivity,
  checkInactivity,
} from "../utils/session";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function useSession() {
  const [session, setSessionState] = useState(getSession());
  const navigate = useNavigate();
  const location = useLocation();

  // Check session on mount and path change
  useEffect(() => {
    const currentSession = getSession();
    setSessionState(currentSession);

    if (!currentSession && !location.pathname.startsWith("/auth/")) {
      localStorage.setItem("message", "Please login to continue");
      navigate("/auth/login");
    }
  }, [navigate, location.pathname]);

  // Set up inactivity checker
  useEffect(() => {
    if (!session) return;

    // Update activity on user interactions
    const handleActivity = () => updateLastActivity();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    // Check for inactivity periodically
    const inactivityChecker = setInterval(() => {
      if (checkInactivity(INACTIVITY_TIMEOUT)) {
        clearSession();
        setSessionState(null);
        localStorage.setItem("message", "Session expired due to inactivity");
        navigate("/auth/login");
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearInterval(inactivityChecker);
    };
  }, [session, navigate]);

  const login = async (identifier, password, rememberMe = false) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const userSession = { ...data, identifier };

      // Save session with remember me preference
      const sessionWithExpiry = setSession(userSession, rememberMe);
      setSessionState(sessionWithExpiry);

      return { success: true, data: sessionWithExpiry.user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Invalid credentials. Please try again.",
      };
    }
  };

  const logout = () => {
    clearSession();
    setSessionState(null);
    navigate("/auth/login");
  };

  return {
    session,
    login,
    logout,
    setSession: (user, rememberMe = false) => {
      const sessionWithExpiry = setSession(user, rememberMe);
      setSessionState(sessionWithExpiry);
      return sessionWithExpiry;
    },
    clearSession: logout,
    updateActivity: updateLastActivity,
  };
}
