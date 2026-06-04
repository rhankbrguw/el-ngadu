import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { otpSchema } from "@/lib/validators/auth";
import type { OtpFormValues } from "@/lib/validators/auth";

interface OtpFormProps {
 onSubmit: (data: OtpFormValues) => void;
 isLoading: boolean;
 error: string | null;
}

export function OtpForm({ onSubmit, isLoading, error }: OtpFormProps) {
 const {
 register,
 handleSubmit,
 formState: { errors },
 } = useForm<OtpFormValues>({
 resolver: zodResolver(otpSchema),
 });

 return (
 <motion.form
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 onSubmit={handleSubmit(onSubmit)}
 noValidate
 className="space-y-4"
 >
 <div className="space-y-1.5">
 <Label htmlFor="otpCode" className="text-sm text-center block mb-2">
 Kode OTP telah dikirim ke email Anda.
 </Label>
 <Input
 id="otpCode"
 placeholder="Masukkan 6 digit OTP"
 disabled={isLoading}
 maxLength={6}
 className="h-12 text-center tracking-[0.5em] font-bold text-xl placeholder:tracking-normal placeholder:font-normal placeholder:text-sm"
 {...register("otpCode")}
 />
 {errors.otpCode && (
 <p className="text-xs text-center text-destructive pt-1">{errors.otpCode.message}</p>
 )}
 </div>

 {error && (
 <div role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm">
 {error}
 </div>
 )}

 <div className="pt-2">
 <Button type="submit" className="w-full h-10 text-sm font-semibold" disabled={isLoading}>
 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
 </Button>
 </div>
 </motion.form>
 );
}
