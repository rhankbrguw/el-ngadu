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

/**
 * Properties for the RegisterSuccessDialog component.
 */
interface RegisterSuccessDialogProps {
  /** Controls the visibility of the dialog */
  open: boolean;
  /** Callback to change the open state of the dialog */
  onOpenChange: (open: boolean) => void;
  /** Callback when the user clicks the continue button */
  onContinue: () => void;
}

/**
 * Displays a success dialog after a successful registration.
 *
 * @param props - The properties for the component.
 * @returns The rendered success dialog.
 */
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
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
            {AUTH_STRINGS.CONTINUE_TO_LOGIN}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
