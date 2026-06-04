import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PETUGAS_DIALOG_STRINGS } from "@/lib/constants/admin";

/**
 * Props for the OfficerDialogHeader component.
 */
interface OfficerDialogHeaderProps {
  /** Indicates whether the dialog is in edit mode */
  isEditMode: boolean;
}

/**
 * Header component for the Petugas dialog.
 */
export function OfficerDialogHeader({ isEditMode }: OfficerDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {isEditMode
          ? PETUGAS_DIALOG_STRINGS.TITLE_EDIT
          : PETUGAS_DIALOG_STRINGS.TITLE_ADD}
      </DialogTitle>
    </DialogHeader>
  );
}
