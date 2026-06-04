import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
 ChangePasswordSchema,
 type ChangePasswordPayload,
} from "@/lib/validators/profile";
import { motion } from "framer-motion";
import { changePasswordService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/common/PasswordInput";
import { Loader2 } from "lucide-react";

export default function PasswordChangeForm() {
 const form = useForm<ChangePasswordPayload>({
 resolver: zodResolver(ChangePasswordSchema),
 defaultValues: {
 old_password: "",
 new_password: "",
 confirm_password: "",
 },
 });

 const onSubmit = async (data: ChangePasswordPayload) => {
 try {
 await changePasswordService({
 old_password: data.old_password,
 new_password: data.new_password,
 });
 toast.success("Kata sandi berhasil diperbarui!");
 form.reset();
 } catch (error) {
 const errorMessage =
 error instanceof Error ? error.message : "Terjadi kesalahan";
 toast.error(errorMessage);
 form.setError("root", { type: "server", message: errorMessage });
 }
 };

 return (
 <Form {...form}>
 <motion.form 
 initial={{ opacity: 0, y: 10 }} 
 animate={{ opacity: 1, y: 0 }} 
 transition={{ duration: 0.3 }}
 onSubmit={form.handleSubmit(onSubmit)} 
 className="space-y-4"
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <FormField
 control={form.control}
 name="old_password"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Kata Sandi Lama</FormLabel>
 <FormControl>
 <PasswordInput placeholder="••••••••" {...field} />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <div className="hidden sm:block"></div>
 <FormField
 control={form.control}
 name="new_password"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Kata Sandi Baru</FormLabel>
 <FormControl>
 <PasswordInput
 placeholder="Minimal 8 karakter"
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="confirm_password"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
 <FormControl>
 <PasswordInput
 placeholder="Ketik ulang kata sandi baru"
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>
 {form.formState.errors.root && (
 <p className="text-sm font-medium text-destructive">
 {form.formState.errors.root.message}
 </p>
 )}
 <div className="flex justify-end pt-2">
 <Button type="submit" disabled={form.formState.isSubmitting}>
 {form.formState.isSubmitting && (
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 )}
 Ubah Kata Sandi
 </Button>
 </div>
 </motion.form>
 </Form>
 );
}
