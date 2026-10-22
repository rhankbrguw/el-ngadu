import { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordService } from "@/services/passwordResetService";
import { getErrorMessage } from "@/lib/complaintUtils";
import { REDIRECT_DELAY_MS } from "@/lib/constants";

function validateResetInput(token: string | null, pass: string, confirm: string): string | null {
  if (!token) return "Tautan reset password tidak valid.";
  if (pass.length < 8) return "Kata sandi minimal 8 karakter.";
  if (pass !== confirm) return "Konfirmasi kata sandi tidak cocok.";
  return null;
}

export function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateResetInput(token, password, confirmPassword);
    if (validationError) return setError(validationError);
    setIsLoading(true); setError(null);
    try {
      const response = await resetPasswordService(password, token as string);
      setSuccessMsg(response.message);
      setTimeout(() => navigate("/login"), REDIRECT_DELAY_MS);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  };

  return { password, setPassword, confirmPassword, setConfirmPassword, error, successMsg, isLoading, token, handleSubmit };
}

