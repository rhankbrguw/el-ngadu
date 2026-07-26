import { useState, type FormEvent } from "react";
import { forgotPasswordService } from "@/services/passwordResetService";
import { getErrorMessage } from "@/lib/complaintUtils";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await forgotPasswordService(email);
      setSuccessMsg(response.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    error,
    successMsg,
    isLoading,
    handleSubmit,
  };
}
