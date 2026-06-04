import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/common/PageLoader";
import { AccessDenied } from "@/components/common/AccessDenied";
import { CreateComplaintForm } from "@/components/complaints/CreateComplaintForm";

/**
 * Page component for creating a new pengaduan.
 * Ensures the user is authenticated and authorized before rendering the form.
 */
export default function CreateComplaintPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || user?.userType !== "masyarakat") {
    return <AccessDenied />;
  }

  return (
    <div className="p-4 md:p-4">
      <div className="mx-auto max-w-2xl">
        <CreateComplaintForm />
      </div>
    </div>
  );
}
