import { useState, type FormEvent, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";
import { registerService } from "@/services/authService";
import { RegisterSchema } from "@/lib/validators";
import { getErrorMessage } from "@/lib/complaintUtils";
import { useAuth } from "@/hooks/useAuth";

type FormErrors = {
  [key: string]: string | undefined;
};

export function useRegisterForm() {
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    username: "",
    email: "",
    password: "",
    telp: "",
  });
  const [otpData, setOtpData] = useState({ username: "", userType: "" });
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"register" | "otp">("register");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Import useAuth at the top or within

  useEffect(() => {
    if (!showSuccessDialog) return;

    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [showSuccessDialog, navigate]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      let filteredValue = value;

      switch (id) {
        case "nik":
          filteredValue = value.replace(/[^0-9]/g, "").slice(0, 16);
          break;
        case "telp":
          filteredValue = value.replace(/[^0-9]/g, "").slice(0, 13);
          break;
        case "nama":
          filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
          break;
      }

      setFormData((prev) => ({ ...prev, [id]: filteredValue }));
      if (errors[id]) {
        setErrors((prev) => ({ ...prev, [id]: undefined }));
      }
    },
    [errors]
  );

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = RegisterSchema.parse(formData);
      const result = await registerService(validatedData);
      
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
      if (err instanceof ZodError) {
        const newErrors: FormErrors = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0]] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ form: getErrorMessage(err) });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();

    if (!otpCode.trim() || otpCode.length !== 6) {
      setErrors({ form: "Kode OTP harus 6 digit." });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { verifyOtpService } = await import("@/services/authService");
      const user = await verifyOtpService(otpData.username, otpCode, otpData.userType);
      login(user);
      setShowSuccessDialog(true);
    } catch (err) {
      setErrors({ form: getErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogRedirect = () => {
    setShowSuccessDialog(false);
    navigate("/dashboard");
  };

  return {
    formData,
    otpCode,
    setOtpCode,
    step,
    errors,
    isLoading,
    showSuccessDialog,
    handleChange,
    handleRegister,
    handleVerifyOtp,
    setShowSuccessDialog,
    handleDialogRedirect,
  };
}
