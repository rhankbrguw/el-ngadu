import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginService, verifyOtpService } from "@/services/authService";
import { getErrorMessage } from "@/lib/complaintUtils";
import type { LoginFormValues, OtpFormValues } from "@/lib/validators/auth";
import type { User } from "@/types";

const REDIRECT_DELAY = 500;

interface OtpPendingData {
  requires_otp: true;
  username: string;
  userType: string;
}

type LoginResult = OtpPendingData | User;

function useRedirectOnSuccess(showSuccessDialog: boolean, navigate: ReturnType<typeof useNavigate>) {
  useEffect(() => {
    if (!showSuccessDialog) return;
    const timer = setTimeout(() => navigate("/dashboard"), REDIRECT_DELAY);
    return () => clearTimeout(timer);
  }, [showSuccessDialog, navigate]);
}

async function processLogin(data: LoginFormValues) {
  return await loginService(data.username, data.password);
}

async function processOtp(otpData: { username: string; userType: string }, code: string) {
  return await verifyOtpService(otpData.username, code, otpData.userType);
}


function useLoginHandlers(
  otpData: { username: string; userType: string },
  setOtpData: (v: { username: string; userType: string }) => void,
  setStep: (v: "login" | "otp") => void,
  setError: (v: string | null) => void,
  setIsLoading: (v: boolean) => void,
  setShowSuccessDialog: (v: boolean) => void,
  login: (user: User) => void
) {
  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true); setError(null);
    try {
      const res = (await processLogin(data)) as LoginResult;
      if ("requires_otp" in res && res.requires_otp) {
        setOtpData({ username: res.username, userType: res.userType });
        setStep("otp");
      } else {
        login(res as User);
        setShowSuccessDialog(true);
      }
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (data: OtpFormValues) => {
    setIsLoading(true); setError(null);
    try {
      login(await processOtp(otpData, data.otpCode));
      setShowSuccessDialog(true);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  };

  return { handleLogin, handleVerifyOtp };
}


export function useLogin() {
  const [otpData, setOtpData] = useState({ username: "", userType: "" });
  const [step, setStep] = useState<"login" | "otp">("login");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useRedirectOnSuccess(showSuccessDialog, navigate);
  const handlers = useLoginHandlers(otpData, setOtpData, setStep, setError, setIsLoading, setShowSuccessDialog, login);

  return { step, error, isLoading, showSuccessDialog, setShowSuccessDialog, ...handlers };
}




