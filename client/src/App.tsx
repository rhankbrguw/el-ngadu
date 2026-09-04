import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import DocumentTitleHandler from "@/components/common/DocumentTitleHandler";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const CreateComplaintPage = lazy(() => import("@/pages/CreateComplaintPage"));
const ComplaintHistoryPage = lazy(() => import("@/pages/ComplaintHistoryPage"));
const ComplaintDetailPage = lazy(() => import("@/pages/ComplaintDetailPage"));
const ManageComplaintsPage = lazy(() => import("@/pages/ManageComplaintsPage"));
const ManageOfficersPage = lazy(() => import("@/pages/ManageOfficersPage"));
const ManageCitizensPage = lazy(() => import("@/pages/ManageCitizensPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh] w-full">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);


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

const PublicRoutes = () => (
  <Route element={<PublicAnimatedLayout />}>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

const DashboardRoutes = () => (
  <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
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
    
    <Route element={<ProtectedRoute allowedRoles={["petugas", "admin"]} />}>
      <Route path="manage-complaints" element={<ManageComplaintsPage />} />
      <Route path="complaints/:id" element={<ComplaintDetailPage />} />
      <Route path="reports" element={<ReportsPage />} />
    </Route>
    
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="manage-officers" element={<ManageOfficersPage />} />
      <Route path="manage-citizens" element={<ManageCitizensPage />} />
    </Route>
  </Route>
);

const AliasRoutes = () => (
  <>
    <Route path="/admin/dashboard" element={<Navigate to="/dashboard/manage-complaints" replace />} />
    <Route path="/admin/manage-complaints" element={<Navigate to="/dashboard/manage-complaints" replace />} />
    <Route path="/officers/manage-complaints" element={<Navigate to="/dashboard/manage-complaints" replace />} />
  </>
);

export default function App() {
  return (
    <>
      <DocumentTitleHandler />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {PublicRoutes()}
          {DashboardRoutes()}
          {AliasRoutes()}
        </Routes>
      </Suspense>
      <Toaster richColors position="top-right" />
    </>
  );
}

