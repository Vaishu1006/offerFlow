import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import Applications from "../pages/Applications";
import ApplicationDetail from "../pages/ApplicationDetail";
import Interviews from "../pages/Interviews";
import Wishlist from "../pages/Wishlist";
import Resumes from "../pages/Resumes";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PendingApplications from "../pages/admin/PendingApplications";
import AllUsers from "../pages/admin/AllUsers";
import CompanyManagement from "../pages/admin/CompanyManagement";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes — sidebar layout, any logged-in role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/companies" element={<CompanyManagement />} />
        </Route>
      </Route>

      {/* Shared route — both roles can access */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/pending-applications" element={<PendingApplications />} />
          <Route path="/admin/users" element={<AllUsers />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}