import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPage } from "./pages/Admin";
import { UserManagementPage } from "./pages/Users/UserManagementPage";
import UserDetails from "./pages/Users/UserDetails"; // Import UserDetails component

import { ContactPage } from "./pages/Contact";
import ForgotPassword from "./pages/auth/forgot-password";

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
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/user/:id" element={<UserDetails />} />

        <Route path="/contact/:id" element={<ContactPage />} />

        {/* Business Routes */}
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/businesses/add" element={<BusinessAddPage />} />
        <Route path="/businesses/:id" element={<BusinessViewPage />} />

        {/* Orders Routes */}
        <Route path="/orders" element={<OrdersPage />} />

        {/* Riders Routes */}
        <Route path="/riders" element={<RidersPage />} />

        {/* Reports Routes */}
        <Route path="/reports" element={<ReportsPage />} />

        {/* Analytics Routes */}
        <Route path="/analytics" element={<AnalyticsPage />} />

        {/* Settings Routes */}
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
