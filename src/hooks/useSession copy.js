import { useState, useEffect } from "react";
import { getSession, setSession, clearSession } from "../utils/session";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function useSession() {
  const [session, setSessionState] = useState(getSession());
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      localStorage.setItem("message", "Please login");
      navigate("/auth/login");
    }
  }, [session, navigate]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const userSession = { ...data, email };

      // Save session in storage and update state
      setSession(userSession);
      setSessionState(userSession);

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
    clearSession();
    setSessionState(null);
    window.location.href = "/auth/login";
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
