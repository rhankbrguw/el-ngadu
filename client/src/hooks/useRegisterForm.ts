import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerService, verifyOtpService } from "@/services/authService";
import { getErrorMessage } from "@/lib/complaintUtils";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/lib/validators/auth";
import type { RegisterFormValues } from "@/lib/validators/auth";
import type { User } from "@/types";
import { REDIRECT_DELAY_MS } from "@/lib/constants";

interface RegisterResult {
  bypass_otp?: boolean;
  requires_otp?: boolean;
  username?: string;
  userType?: string;
  user?: User;
}

function useRegisterRedirect(showSuccessDialog: boolean, navigate: ReturnType<typeof useNavigate>) {
  useEffect(() => {
    if (!showSuccessDialog) return;
    const timer = setTimeout(() => navigate("/dashboard"), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [showSuccessDialog, navigate]);
}


function useRegisterHandlers(
  otpData: { username: string; userType: string },
  setOtpData: (v: { username: string; userType: string }) => void,
  otpCode: string,
  setStep: (v: "register" | "otp") => void,
  setServerError: (v: string | null) => void,
  setIsLoading: (v: boolean) => void,
  setShowSuccessDialog: (v: boolean) => void,
  login: (user: User) => void
) {
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true); setServerError(null);
    try {
      const res = (await registerService(data)) as RegisterResult;
      if (res.bypass_otp && res.user) { login(res.user); setShowSuccessDialog(true); }
      else if (res.requires_otp && res.username && res.userType) { setOtpData({ username: res.username, userType: res.userType }); setStep("otp"); }
      else { setShowSuccessDialog(true); }
    } catch (err) { setServerError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length !== 6) return setServerError("Kode OTP harus 6 digit.");
    setIsLoading(true); setServerError(null);
    try {
      login(await verifyOtpService(otpData.username, otpCode, otpData.userType));
      setShowSuccessDialog(true);
    } catch (err) { setServerError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  };

  return { onSubmit, handleVerifyOtp };
}


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
    defaultValues: { nik: "", nama: "", username: "", email: "", password: "", telp: "" },
  });

  useRegisterRedirect(showSuccessDialog, navigate);
  const handlers = useRegisterHandlers(otpData, setOtpData, otpCode, setStep, setServerError, setIsLoading, setShowSuccessDialog, login);
  const handleDialogRedirect = () => { setShowSuccessDialog(false); navigate("/dashboard"); };

  return { form, otpCode, setOtpCode, step, serverError, isLoading, showSuccessDialog, setShowSuccessDialog, handleDialogRedirect, ...handlers };
}


