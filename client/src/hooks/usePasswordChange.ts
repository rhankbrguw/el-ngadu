import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChangePasswordSchema, type ChangePasswordPayload } from "@/lib/validators/profile";
import { changePasswordService } from "@/services/authService";
import { APP_MESSAGES } from "@/lib/constants/messages";

export function usePasswordChange() {
  const form = useForm<ChangePasswordPayload>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: ChangePasswordPayload) => {
    try {
      await changePasswordService({
        old_password: data.old_password,
        new_password: data.new_password,
      });
      toast.success(APP_MESSAGES.AUTH.PASSWORD_CHANGED);
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : APP_MESSAGES.GENERIC.ERROR;
      toast.error(errorMessage);
      form.setError("root", { type: "server", message: errorMessage });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
