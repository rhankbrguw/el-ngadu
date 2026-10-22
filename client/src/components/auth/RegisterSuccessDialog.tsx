import { CheckCircle } from "lucide-react";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
 DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AUTH_STRINGS } from "@/lib/constants/auth";

interface RegisterSuccessDialogProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 onContinue: () => void;
}
export function RegisterSuccessDialog({
 open,
 onOpenChange,
 onContinue,
}: RegisterSuccessDialogProps) {
 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent
 className="sm:max-w-md"
 aria-describedby="register-success-description"
 >
 <DialogHeader>
 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/20 dark:bg-success/20">
 <CheckCircle className="h-6 w-6 text-success dark:text-success/80" />
 </div>
 <DialogTitle className="mt-4 text-center">
 {AUTH_STRINGS.SUCCESS_TITLE}
 </DialogTitle>
 <DialogDescription
 id="register-success-description"
 className="text-center"
 >
 {AUTH_STRINGS.SUCCESS_DESC}
 </DialogDescription>
 </DialogHeader>
 <DialogFooter className="sm:justify-center">
 <Button type="button" onClick={onContinue}>
 {AUTH_STRINGS.CONTINUE_TO_DASHBOARD}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 );
}
