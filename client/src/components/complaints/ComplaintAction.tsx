import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { APP_MESSAGES } from "@/lib/constants/messages";

interface ComplaintActionProps {
  id: number;
}

export default function ComplaintAction({ id }: ComplaintActionProps) {
  const { user } = useAuth();
  const isOfficerOrAdmin = user?.userType === "petugas";
  const actionLabel = isOfficerOrAdmin
    ? APP_MESSAGES.COMPLAINT.VIEW_RESPOND
    : APP_MESSAGES.COMPLAINT.VIEW_DETAIL;
  const detailUrl = isOfficerOrAdmin
    ? `/dashboard/complaints/${id}`
    : `/dashboard/history/${id}`;

  return (
    <Button asChild variant="outline" size="sm" className="w-full">
      <Link to={detailUrl}>{actionLabel}</Link>
    </Button>
  );
}

