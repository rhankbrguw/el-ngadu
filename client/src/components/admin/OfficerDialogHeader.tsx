import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PETUGAS_DIALOG_STRINGS } from "@/lib/constants/admin";

interface OfficerDialogHeaderProps {
 isEditMode: boolean;
}
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
