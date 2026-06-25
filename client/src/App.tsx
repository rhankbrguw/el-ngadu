import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
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

const PublicAnimatedLayout = () => {
  const location = useLocation();
  return (
    <div className="grid w-full min-h-screen">
      <AnimatePresence>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 w-full min-h-screen"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
 return (
 <>
 <Routes>
 {/* Public Routes with Animation */}
 <Route element={<PublicAnimatedLayout />}>
   <Route path="/" element={<LandingPage />} />
   <Route path="/login" element={<LoginPage />} />
   <Route path="/register" element={<RegisterPage />} />
   <Route path="/forgot-password" element={<ForgotPasswordPage />} />
   <Route path="/reset-password" element={<ResetPasswordPage />} />
   <Route path="*" element={<NotFoundPage />} />
 </Route>

 {/* Protected Routes (Animations handled in DashboardLayout) */}
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
 <Route path="settings" element={<SettingsPage />} />
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
 <Route path="reports" element={<ReportsPage />} />
 </Route>
 <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
 <Route path="manage-officers" element={<ManageOfficersPage />} />
 <Route
 path="manage-citizens"
 element={<ManageCitizensPage />}
 />
 </Route>
  </Route>

 {/* Alias / Fallback Routes */}
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

 </Routes>
 <Toaster richColors position="top-right" />
 </>
 );
}
