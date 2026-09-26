import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/common/PageLoader";
import { AccessDenied } from "@/components/common/AccessDenied";
import { CreateComplaintForm } from "@/components/complaints/CreateComplaintForm";
import { PenLine } from "lucide-react";
import { PENGADUAN_STRINGS } from "@/lib/constants/complaints";

/**
 * Page component for creating a new pengaduan.
 * Ensures the user is authenticated and authorized before rendering the form.
 */
const CreateComplaintHeader = () => (
  <div className="flex items-center gap-4 mb-2">
    <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
      <PenLine className="h-6 w-6 text-primary flex-shrink-0" />
    </div>
    <div className="space-y-0.5">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
        {PENGADUAN_STRINGS.FORM_TITLE}
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground">
        {PENGADUAN_STRINGS.FORM_DESCRIPTION}
      </p>
    </div>
  </div>
);

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
    <div className="space-y-4 max-w-4xl mx-auto">
      <CreateComplaintHeader />
      <CreateComplaintForm />
    </div>
  );
}
