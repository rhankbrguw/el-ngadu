import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginService, verifyOtpService } from "@/services/authService";
import { getErrorMessage } from "@/lib/complaintUtils";
import type { LoginFormValues, OtpFormValues } from "@/lib/validators/auth";

const REDIRECT_DELAY = 1500;

export function useLogin() {
 const [otpData, setOtpData] = useState({ username: "", userType: "" });
 const [step, setStep] = useState<"login" | "otp">("login");
 const [error, setError] = useState<string | null>(null);
 const [isLoading, setIsLoading] = useState(false);
 const [showSuccessDialog, setShowSuccessDialog] = useState(false);

 const { login } = useAuth();
 const navigate = useNavigate();

 useEffect(() => {
 if (!showSuccessDialog) return;
 const timer = setTimeout(() => navigate("/dashboard"), REDIRECT_DELAY);
 return () => clearTimeout(timer);
 }, [showSuccessDialog, navigate]);

 const handleLogin = async (data: LoginFormValues) => {
 setIsLoading(true);
 setError(null);
 try {
 const result = await loginService(data.username, data.password);
 if (result.requires_otp) {
 setOtpData({ username: result.username, userType: result.userType });
 setStep("otp");
 } else {
 login(result);
 setShowSuccessDialog(true);
 }
 } catch (err) {
 setError(getErrorMessage(err));
 } finally {
 setIsLoading(false);
 }
 };

 const handleVerifyOtp = async (data: OtpFormValues) => {
 setIsLoading(true);
 setError(null);
 try {
 const user = await verifyOtpService(otpData.username, data.otpCode, otpData.userType);
 login(user);
 setShowSuccessDialog(true);
 } catch (err) {
 setError(getErrorMessage(err));
 } finally {
 setIsLoading(false);
 }
 };

 return {
 step,
 error,
 isLoading,
 showSuccessDialog,
 setShowSuccessDialog,
 handleLogin,
 handleVerifyOtp
 };
}
