import { useState, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordService } from "@/services/passwordResetService";
import { getErrorMessage } from "@/lib/complaintUtils";
import { REDIRECT_DELAY_MS } from "@/lib/constants";

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

    if (!token) {
      setError("Tautan reset password tidak valid.");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await resetPasswordService(password, token);
      setSuccessMsg(response.message);
      setTimeout(() => {
        navigate("/login");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    successMsg,
    isLoading,
    token,
    handleSubmit,
  };
}
