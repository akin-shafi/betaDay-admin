import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPage } from "./pages/Admin";
import { UserManagementPage } from "./pages/Users/UserManagementPage";
import UserDetails from "./pages/Users/UserDetails"; // Import UserDetails component

import { ContactPage } from "./pages/Contact";
import ForgotPassword from "./pages/auth/forgot-password";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import Business Pages
import BusinessesPage from "./pages/businesses/index";
import BusinessViewPage from "./pages/businesses/view";
import BusinessAddPage from "./pages/businesses/add";

// Import Orders Pages
import OrdersPage from "./pages/orders/index";

// Import Riders Pages
import RidersPage from "./pages/riders/index";

// Import Reports Pages
import ReportsPage from "./pages/reports/index";

// Import Analytics Pages
import AnalyticsPage from "./pages/analytics/index";

// Import Settings Pages
import SettingsPage from "./pages/settings/index";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact/:id"
          element={
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          }
        />

        {/* Business Routes */}
        <Route
          path="/businesses"
          element={
            <ProtectedRoute>
              <BusinessesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/businesses/add"
          element={
            <ProtectedRoute>
              <BusinessAddPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/businesses/:id"
          element={
            <ProtectedRoute>
              <BusinessViewPage />
            </ProtectedRoute>
          }
        />

        {/* Orders Routes */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Riders Routes */}
        <Route
          path="/riders"
          element={
            <ProtectedRoute>
              <RidersPage />
            </ProtectedRoute>
          }
        />

        {/* Reports Routes */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Analytics Routes */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Settings Routes */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
