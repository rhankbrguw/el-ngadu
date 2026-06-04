import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import CreateComplaintPage from "@/pages/CreateComplaintPage";
import ComplaintHistoryPage from "@/pages/ComplaintHistoryPage";
import ComplaintDetailPage from "@/pages/ComplaintDetailPage";
import ManageComplaintsPage from "@/pages/ManageComplaintsPage";
import ManageOfficersPage from "@/pages/ManageOfficersPage";
import ManageCitizensPage from "@/pages/ManageCitizensPage";
import ReportsPage from "@/pages/ReportsPage";
import SearchPage from "@/pages/SearchPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/ProfilePage";
import HelpPage from "@/pages/HelpPage";
import SettingsPage from "@/pages/SettingsPage";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="settings" element={<SettingsPage />} />{" "}
          {/* Tambahkan rute baru ini */}
          <Route element={<ProtectedRoute allowedRoles={["masyarakat"]} />}>
            <Route path="create-complaint" element={<CreateComplaintPage />} />
            <Route path="history" element={<ComplaintHistoryPage />} />
            <Route path="history/:id" element={<ComplaintDetailPage />} />
          </Route>
          <Route
            element={<ProtectedRoute allowedRoles={["petugas", "admin"]} />}
          >
            <Route path="manage-complaints" element={<ManageComplaintsPage />} />
            <Route path="complaints/:id" element={<ComplaintDetailPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="manage-officers" element={<ManageOfficersPage />} />
            <Route
              path="manage-citizens"
              element={<ManageCitizensPage />}
            />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>

        {/* Rute Alias / Fallback */}
        <Route
          path="/admin/dashboard"
          element={<Navigate to="/dashboard/manage-complaints" replace />}
        />
        <Route
          path="/admin/manage-complaints"
          element={<Navigate to="/dashboard/manage-complaints" replace />}
        />
        <Route
          path="/officers/manage-complaints"
          element={<Navigate to="/dashboard/manage-complaints" replace />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}
