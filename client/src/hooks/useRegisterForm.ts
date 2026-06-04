import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerService } from "@/services/authService";
import { getErrorMessage } from "@/lib/complaintUtils";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/lib/validators/auth";
import type { RegisterFormValues } from "@/lib/validators/auth";

export function useRegisterForm() {
 const [otpData, setOtpData] = useState({ username: "", userType: "" });
 const [otpCode, setOtpCode] = useState("");
 const [step, setStep] = useState<"register" | "otp">("register");
 const [serverError, setServerError] = useState<string | null>(null);
 const [isLoading, setIsLoading] = useState(false);
 const [showSuccessDialog, setShowSuccessDialog] = useState(false);
 
 const navigate = useNavigate();
 const { login } = useAuth();

 const form = useForm<RegisterFormValues>({
 resolver: zodResolver(registerSchema),
 defaultValues: {
 nik: "",
 nama: "",
 username: "",
 email: "",
 password: "",
 telp: "",
 },
 });

 useEffect(() => {
 if (!showSuccessDialog) return;
 const timer = setTimeout(() => {
 navigate("/dashboard");
 }, 2000);
 return () => clearTimeout(timer);
 }, [showSuccessDialog, navigate]);

 const onSubmit = async (data: RegisterFormValues) => {
 setIsLoading(true);
 setServerError(null);

 try {
 const result = await registerService(data);
 if (result.bypass_otp) {
 login(result.user);
 setShowSuccessDialog(true);
 } else if (result.requires_otp) {
 setOtpData({ username: result.username, userType: result.userType });
 setStep("otp");
 } else {
 setShowSuccessDialog(true);
 }
 } catch (err) {
 setServerError(getErrorMessage(err));
 } finally {
 setIsLoading(false);
 }
 };

 const handleVerifyOtp = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!otpCode.trim() || otpCode.length !== 6) {
 setServerError("Kode OTP harus 6 digit.");
 return;
 }
 setIsLoading(true);
 setServerError(null);

 try {
 const { verifyOtpService } = await import("@/services/authService");
 const user = await verifyOtpService(otpData.username, otpCode, otpData.userType);
 login(user);
 setShowSuccessDialog(true);
 } catch (err) {
 setServerError(getErrorMessage(err));
 } finally {
 setIsLoading(false);
 }
 };

 const handleDialogRedirect = () => {
 setShowSuccessDialog(false);
 navigate("/dashboard");
 };

 return {
 form,
 otpCode,
 setOtpCode,
 step,
 serverError,
 isLoading,
 showSuccessDialog,
 onSubmit,
 handleVerifyOtp,
 setShowSuccessDialog,
 handleDialogRedirect,
 };
}
