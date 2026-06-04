import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_MESSAGES } from "@/lib/constants/messages";


interface ComplaintActionProps {
 id: number;
}

export default function ComplaintAction({ id }: ComplaintActionProps) {
 return (
 <Button asChild variant="outline" size="sm" className="w-full">
 <Link to={`/dashboard/complaints/${id}`}>{APP_MESSAGES.COMPLAINT.VIEW_RESPOND}</Link>
 </Button>
 );
}
