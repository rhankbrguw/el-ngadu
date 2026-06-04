import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ComplaintActionProps {
 id: number;
}

export default function ComplaintAction({ id }: ComplaintActionProps) {
 return (
 <Button asChild variant="outline" size="sm" className="w-full">
 <Link to={`/dashboard/complaints/${id}`}>Lihat & Tanggapi</Link>
 </Button>
 );
}
