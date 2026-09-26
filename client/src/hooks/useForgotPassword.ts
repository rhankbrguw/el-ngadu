import { useState, type FormEvent } from "react";
import { forgotPasswordService } from "@/services/passwordResetService";
import { emailValidator } from "@/lib/validators/auth";
import { getErrorMessage } from "@/lib/complaintUtils";

async function sendForgotRequest(email: string) {
  return await forgotPasswordService(email);
}

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = emailValidator.safeParse(email.trim());
    if (!validation.success) {
      return setError(validation.error.issues[0]?.message || "Format email tidak valid.");
    }
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await sendForgotRequest(email.trim());
      setSuccessMsg(response.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, error, successMsg, isLoading, handleSubmit };
}
