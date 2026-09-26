import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ProfileEditSchema, type ProfileEditPayload } from "@/lib/validators/profile";
import { updateProfileService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { APP_MESSAGES } from "@/lib/constants/messages";
import type { User } from "@/types";

function getProfileDefaults(user: User) {

  const isMasyarakat = user.userType === "masyarakat";
  const isPetugas = user.userType === "petugas";
  return {
    nama: isMasyarakat ? user.nama : undefined,
    nama_petugas: isPetugas ? user.nama_petugas : undefined,
    username: user.username,
    telp: user.telp,
    email: user.email || "",
  };
}


export function useProfileEdit() {
  const { user, updateUser } = useAuth();
  const form = useForm<ProfileEditPayload>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: { nama: "", nama_petugas: "", username: "", telp: "" },
  });

  useEffect(() => {
    if (user) form.reset(getProfileDefaults(user));
  }, [user, form]);

  const onSubmit = async (data: ProfileEditPayload) => {
    try {
      await updateProfileService(data);
      updateUser(data);
      toast.success(APP_MESSAGES.PROFILE.UPDATE_SUCCESS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : APP_MESSAGES.COMMON.ERROR);
    }
  };

  return { form, user, onSubmit: form.handleSubmit(onSubmit), isLoading: form.formState.isSubmitting };
}

