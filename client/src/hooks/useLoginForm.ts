import { useState, useEffect, type FormEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginService } from "@/services/authService";
import { getErrorMessage } from "@/lib/complaintUtils";

const REDIRECT_DELAY = 1500;

export function useLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [otpData, setOtpData] = useState({ username: "", userType: "" });
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!showSuccessDialog) return;

    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, REDIRECT_DELAY);

    return () => clearTimeout(timer);
  }, [showSuccessDialog, navigate]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
      if (error) setError(null);
    },
    [error]
  );

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Username dan password tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginService(formData.username, formData.password);
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

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();

    if (!otpCode.trim() || otpCode.length !== 6) {
      setError("Kode OTP harus 6 digit.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { verifyOtpService } = await import("@/services/authService");
      const user = await verifyOtpService(otpData.username, otpCode, otpData.userType);
      login(user);
      setShowSuccessDialog(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    otpCode,
    setOtpCode,
    step,
    error,
    isLoading,
    showSuccessDialog,
    setShowSuccessDialog,
    handleChange,
    handleLogin,
    handleVerifyOtp
  };
}
