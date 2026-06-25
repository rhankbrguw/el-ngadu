import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
 MasyarakatEditSchema,
 type MasyarakatEditPayload,
} from "@/lib/validators/profile";
import { updateMasyarakatService } from "@/services/citizenService";
import type { Masyarakat } from "@/types";
import { Button } from "@/components/ui/button";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogFooter,
} from "@/components/ui/dialog";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";


interface CitizenDialogProps {
 masyarakatToEdit: Masyarakat | null;
 isOpen: boolean;
 onOpenChange: (open: boolean) => void;
 onSuccess: () => void;
}

export default function CitizenDialog({
 masyarakatToEdit,
 isOpen,
 onOpenChange,
 onSuccess,
}: CitizenDialogProps) {
 const form = useForm<MasyarakatEditPayload>({
 resolver: zodResolver(MasyarakatEditSchema),
 defaultValues: { nama: "", username: "", telp: "" },
 });

 useEffect(() => {
 if (isOpen && masyarakatToEdit) {
 form.reset({
 nama: masyarakatToEdit.nama,
 username: masyarakatToEdit.username,
 telp: masyarakatToEdit.telp,
 });
 }
 }, [isOpen, masyarakatToEdit, form]);

 const onSubmit = async (data: MasyarakatEditPayload) => {
 if (!masyarakatToEdit) return;

 try {
 await updateMasyarakatService(masyarakatToEdit.nik, data);
 toast.success("Data masyarakat berhasil diperbarui!");
 onSuccess();
 onOpenChange(false);
 } catch (error) {
 const errorMessage =
 error instanceof Error ? error.message : "Terjadi kesalahan";
 toast.error(errorMessage);
 form.setError("root", { type: "server", message: errorMessage });
 }
 };

 return (
 <Dialog open={isOpen} onOpenChange={onOpenChange}>
 <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
 <DialogHeader>
 <DialogTitle>Ubah Data Masyarakat</DialogTitle>
 </DialogHeader>
 <Form {...form}>
 <form
 onSubmit={form.handleSubmit(onSubmit)}
 className="space-y-3 pt-4"
 >
 <FormField
 control={form.control}
 name="nama"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{APP_MESSAGES.AUTH.NAME_LABEL}</FormLabel>
 <FormControl>
 <Input {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="username"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{APP_MESSAGES.AUTH.USERNAME}</FormLabel>
 <FormControl>
 <Input {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="telp"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{APP_MESSAGES.AUTH.TELP_LABEL}</FormLabel>
 <FormControl>
 <Input {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 {form.formState.errors.root && (
 <p className="text-sm font-medium text-destructive">
 {form.formState.errors.root.message}
 </p>
 )}
 <DialogFooter>
 <Button type="submit" disabled={form.formState.isSubmitting}>
 {form.formState.isSubmitting && (
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 )}
 Simpan Perubahan
 </Button>
 </DialogFooter>
 </form>
 </Form>
 </DialogContent>
 </Dialog>
 );
}
