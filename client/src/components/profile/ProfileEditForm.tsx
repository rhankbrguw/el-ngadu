import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ProfileEditSchema, type ProfileEditPayload } from "@/lib/validators/profile";
import { motion } from "framer-motion";
import { updateProfileService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Loader2 } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";


export default function ProfileEditForm() {
 const { user, updateUser } = useAuth();

 const form = useForm<ProfileEditPayload>({
 resolver: zodResolver(ProfileEditSchema),
 defaultValues: { nama: "", nama_petugas: "", username: "", telp: "" },
 });

 useEffect(() => {
 if (user) {
 form.reset({
 nama: user.userType === "masyarakat" ? user.nama : undefined,
 nama_petugas:
 user.userType === "petugas" ? user.nama_petugas : undefined,
 username: user.username,
 telp: user.telp,
 email: user.email || "",
 });
 }
 }, [user, form]);

 const onSubmit = async (data: ProfileEditPayload) => {
 try {
 await updateProfileService(data);
 updateUser(data);
 toast.success("Profil berhasil diperbarui!");
 } catch (error) {
 toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
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
 {user?.userType === "masyarakat" ? (
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
 ) : (
 <FormField
 control={form.control}
 name="nama_petugas"
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
 )}
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
 <PhoneInput 
 value={field.value} 
 onChange={field.onChange} 
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="email"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{APP_MESSAGES.AUTH.EMAIL_LABEL}</FormLabel>
 <FormControl>
 <Input {...field} type="email" placeholder="contoh@email.com" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>
 <div className="flex justify-end pt-2">
 <Button type="submit" disabled={form.formState.isSubmitting}>
 {form.formState.isSubmitting && (
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 )}
 Simpan Perubahan Profil
 </Button>
 </div>
 </motion.form>
 </Form>
 );
}
