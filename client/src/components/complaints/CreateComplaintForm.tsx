import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { createPengaduanService } from "@/services/complaintService";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getErrorMessage } from "@/lib/complaintUtils";
import { PENGADUAN_STRINGS, KATEGORI_PENGADUAN } from "@/lib/constants/complaints";
import { createComplaintSchema, type CreateComplaintValues } from "@/lib/validators/complaints";
import { FileUploadInput } from "@/components/complaints/FileUploadInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Loader2, AlertCircle } from "lucide-react";

export function CreateComplaintForm() {
 const [formError, setFormError] = useState<string | null>(null);
 const { user } = useAuth();
 const navigate = useNavigate();

 const { file, dragActive, handleFileSelect, handleDrag, handleDrop, removeFile } = useFileUpload();

 const form = useForm<CreateComplaintValues>({
 resolver: zodResolver(createComplaintSchema),
 defaultValues: { judul: "", kategori: "", lokasi: "", isi: "" },
 });

 const onSubmit = async (data: CreateComplaintValues) => {
 if (user?.userType !== "masyarakat") {
 toast.error(PENGADUAN_STRINGS.ERROR_ONLY_MASYARAKAT);
 return;
 }
 setFormError(null);
 try {
 await createPengaduanService({ ...data, foto_bukti: file || undefined });
 toast.success(PENGADUAN_STRINGS.SUCCESS_CREATED);
 navigate("/dashboard/history");
 } catch (err) {
 const msg = getErrorMessage(err);
 toast.error(msg);
 setFormError(msg);
 }
 };

 const isLoading = form.formState.isSubmitting;

 return (
 <Card className="border shadow-sm">
 <motion.form
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 onSubmit={form.handleSubmit(onSubmit)}
 >
 <CardHeader className="space-y-2 pb-6">
 <CardTitle className="text-xl font-semibold">{PENGADUAN_STRINGS.FORM_TITLE}</CardTitle>
 <CardDescription>{PENGADUAN_STRINGS.FORM_DESCRIPTION}</CardDescription>
 </CardHeader>
 <CardContent className="-mt-2 space-y-3 p-4 sm:p-5">
 <Form {...form}>
 <div className="space-y-3">
 <FormField control={form.control} name="judul" render={({ field }) => (
 <FormItem><FormLabel>{PENGADUAN_STRINGS.LABEL_JUDUL}</FormLabel>
 <FormControl><Input placeholder={PENGADUAN_STRINGS.PLACEHOLDER_JUDUL} disabled={isLoading} {...field} /></FormControl>
 <FormMessage /></FormItem>
 )} />
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <FormField control={form.control} name="kategori" render={({ field }) => (
 <FormItem><FormLabel>{PENGADUAN_STRINGS.LABEL_KATEGORI}</FormLabel>
 <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
 <FormControl><SelectTrigger><SelectValue placeholder={PENGADUAN_STRINGS.PLACEHOLDER_KATEGORI} /></SelectTrigger></FormControl>
 <SelectContent>
 {KATEGORI_PENGADUAN.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
 </SelectContent>
 </Select><FormMessage /></FormItem>
 )} />
 <FormField control={form.control} name="lokasi" render={({ field }) => (
 <FormItem><FormLabel>{PENGADUAN_STRINGS.LABEL_LOKASI}</FormLabel>
 <FormControl><Input placeholder={PENGADUAN_STRINGS.PLACEHOLDER_LOKASI} disabled={isLoading} {...field} /></FormControl>
 <FormMessage /></FormItem>
 )} />
 </div>
 <FormField control={form.control} name="isi" render={({ field }) => (
 <FormItem><FormLabel>{PENGADUAN_STRINGS.LABEL_ISI}</FormLabel>
 <FormControl><Textarea placeholder={PENGADUAN_STRINGS.PLACEHOLDER_ISI} disabled={isLoading} rows={4} {...field} /></FormControl>
 <FormMessage /></FormItem>
 )} />
 </div>
 </Form>
 <div className="space-y-1.5 mt-3">
 <Label>{PENGADUAN_STRINGS.LABEL_FOTO}</Label>
 <FileUploadInput file={file} dragActive={dragActive} isLoading={isLoading} onDrag={handleDrag} onDrop={handleDrop} onFileSelect={handleFileSelect} onRemoveFile={removeFile} />
 <p className="text-xs text-muted-foreground">{PENGADUAN_STRINGS.INFO_FOTO}</p>
 </div>
 {formError && (
 <div className="mt-3 rounded-md border border-destructive/20 bg-destructive/10 p-3 flex items-center gap-2">
 <AlertCircle className="h-4 w-4 text-destructive" />
 <p className="text-sm font-medium text-destructive">{formError}</p>
 </div>
 )}
 </CardContent>
 <CardFooter className="px-4 sm:px-5 pb-6">
 <Button type="submit" className="w-full" disabled={isLoading}>
 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 {isLoading ? PENGADUAN_STRINGS.BTN_SUBMIT_LOADING : PENGADUAN_STRINGS.BTN_SUBMIT}
 </Button>
 </CardFooter>
 </motion.form>
 </Card>
 );
}
