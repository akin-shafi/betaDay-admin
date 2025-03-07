import { useState, useEffect } from "react";
import { getSession, setSession, clearSession } from "../utils/session";
import { useNavigate } from "react-router-dom"; // Assuming you use react-router-dom

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use Vite environment variable

export function useSession() {
  const [session, setSessionState] = useState(getSession());
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    // Redirect to login if session is empty
    if (!session) {
      localStorage.setItem("message", "Please login");
      navigate("/login"); // Redirect to login page
      return;
    }

    // Set a timeout to automatically log out after 1 hour
    const sessionTimeout = setTimeout(() => {
      localStorage.setItem("message", "Session timed out due to inactivity.");
      logout(); // Clear session and redirect
    }, 3600000); // 1-hour session timeout

    return () => clearTimeout(sessionTimeout);
  }, [session, navigate]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const userSession = { ...data, email }; // Assuming response contains user data
      // console.log("userSession", userSession);
      // Save session in storage and update state
      setSession(userSession);
      setSessionState(userSession);

      // Return the user data with role and other details for redirection
      return { success: true, data: userSession.user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Invalid credentials. Please try again.",
      };
    }
  };

  const logout = () => {
    clearSession(); // Clear session from storage
    setSessionState(null); // Clear state
    window.location.href = "/login"; // Redirect to login
  };

  return {
    session,
    login,
    logout,
    setSession: (user) => {
      setSession(user);
      setSessionState(user);
    },
    clearSession: logout,
  };
}
