import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import DashboardLayout from "./layout/DashboardLayout";

export function ProtectedRoute({ children }) {
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      localStorage.setItem("message", "Please login to access this page");
      navigate("/auth/login");
    }
  }, [session, navigate]);

  // If there's no session, don't render anything
  if (!session) {
    return null;
  }

  // Wrap the children with DashboardLayout for protected routes
  return <DashboardLayout>{children}</DashboardLayout>;
}
