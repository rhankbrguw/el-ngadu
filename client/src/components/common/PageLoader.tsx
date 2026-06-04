import { Loader2 } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";


export function PageLoader() {
 return (
 <div className="flex h-screen items-center justify-center">
 <div className="space-y-3 text-center">
 <Loader2 className="mx-auto h-8 w-8 animate-spin" />
 <p>{APP_MESSAGES.COMMON.WAIT}</p>
 </div>
 </div>
 );
}
