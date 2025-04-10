import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/auth/login";
import { SignupPage } from "./pages/auth/signup";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPage } from "./pages/Admin";
// import { ContactPage } from "./pages/Contact";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";

import { ProtectedRoute } from "./components/ProtectedRoute";

import { UsersPage } from "./pages/Users";
// import UserDetailsPage from "./pages/Users/[id]"; // Import UserDetailsPage component

// Import Vendor Pages
import VendorsPage from "./pages/vendors";
import VendorDetailsPage from "./pages/vendors/[id]";

import BusinessesPage from "./pages/businesses";
import BusinessViewPage from "./pages/businesses/view";

// Import Orders Pages
import OrdersPage from "@/pages/orders";
import OrderDetailsPage from "@/pages/orders/[id]";

// Import Riders Pages
import RidersPage from "./pages/riders/index";

// Import Reports Pages
import ReportsPage from "./pages/reports/index";

// Import Analytics Pages
import AnalyticsPage from "./pages/analytics/index";

// Import Settings Pages
import SettingsPage from "./pages/settings/index";
import GroupsPage from "./pages/Groups/index";
import SubGroupsPage from "./pages/Groups/[groupId]";
import MealsPage from "./pages/MealsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

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
              <UsersPage />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/contact/:id"
          element={
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          }
        /> */}

        {/* Vendor Routes */}
        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <VendorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors/:id"
          element={
            <ProtectedRoute>
              <VendorDetailsPage />
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
        {/* <Route
          path="/businesses/add"
          element={
            <ProtectedRoute>
              <BusinessAddPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/businesses/:id"
          element={
            <ProtectedRoute>
              <BusinessViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupsPage />{" "}
            </ProtectedRoute>
          }
        />

        <Route
          path="/meals"
          element={
            <ProtectedRoute>
              <MealsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/subgroups"
          element={
            <ProtectedRoute>
              <SubGroupsPage />
            </ProtectedRoute>
          }
        />

        {/* Business Routes */}
        {/* <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <VendorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors/:id"
          element={
            <ProtectedRoute>
              <VendorDetailsPage />
            </ProtectedRoute>
          }
        /> */}

        {/* Orders Routes */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
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
