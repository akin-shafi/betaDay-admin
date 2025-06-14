"use client";

import { useState, useEffect } from "react";
import { getSession, setSession, clearSession } from "../utils/session";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

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
  };
}
