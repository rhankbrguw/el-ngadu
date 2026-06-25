import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PetugasSchema, type PetugasPayload } from "@/lib/validators";
import {
 createPetugasService,
 updatePetugasService,
} from "@/services/officerService";
import type { Petugas } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PETUGAS_DIALOG_STRINGS } from "@/lib/constants/admin";
import { OfficerDialogHeader } from "./OfficerDialogHeader";
import { OfficerDialogForm } from "./OfficerDialogForm";

/**
 * Props for the OfficerDialog component.
 */
interface OfficerDialogProps {
 /** The petugas data to edit, or null if adding a new one */
 petugasToEdit?: Petugas | null;
 /** Indicates whether the dialog is open */
 isOpen: boolean;
 /** Callback fired when the dialog's open state changes */
 onOpenChange: (open: boolean) => void;
 /** Callback fired upon successful form submission */
 onSuccess: () => void;
}

/**
 * Dialog component for adding or editing a Petugas.
 */
export default function OfficerDialog({
 petugasToEdit,
 isOpen,
 onOpenChange,
 onSuccess,
}: OfficerDialogProps) {
 const isEditMode = !!petugasToEdit;

 const form = useForm<PetugasPayload>({
 resolver: zodResolver(PetugasSchema),
 defaultValues: {
 nama_petugas: "",
 username: "",
 email: "",
 password: "",
 telp: "",
 level: "petugas",
 },
 });

 useEffect(() => {
 if (isOpen) {
 form.clearErrors();
 if (isEditMode && petugasToEdit) {
 form.reset({
 nama_petugas: petugasToEdit.nama_petugas,
 username: petugasToEdit.username,
 email: petugasToEdit.email || "",
 telp: petugasToEdit.telp,
 level: petugasToEdit.level,
 password: "",
 });
 } else {
 form.reset({
 nama_petugas: "",
 username: "",
 email: "",
 password: "",
 telp: "",
 level: "petugas",
 });
 }
 }
 }, [isOpen, petugasToEdit, isEditMode, form]);

 const onSubmit = async (data: PetugasPayload) => {
 try {
 const payload = { ...data };
 if (isEditMode && !payload.password) {
 delete payload.password;
 }

 if (isEditMode && petugasToEdit) {
 await updatePetugasService(petugasToEdit.id_petugas, payload);
 toast.success(PETUGAS_DIALOG_STRINGS.SUCCESS_EDIT);
 } else {
 await createPetugasService(payload);
 toast.success(PETUGAS_DIALOG_STRINGS.SUCCESS_ADD);
 }
 onSuccess();
 onOpenChange(false);
 } catch (error) {
 const errorMessage =
 error instanceof Error ? error.message : PETUGAS_DIALOG_STRINGS.ERROR_GENERAL;
 toast.error(errorMessage);
 form.setError("root", { type: "server", message: errorMessage });
 }
 };

 return (
 <Dialog open={isOpen} onOpenChange={onOpenChange}>
 <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
 <OfficerDialogHeader isEditMode={isEditMode} />
 <OfficerDialogForm
 form={form}
 onSubmit={onSubmit}
 isEditMode={isEditMode}
 />
 </DialogContent>
 </Dialog>
 );
}
