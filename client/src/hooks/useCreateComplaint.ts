import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPengaduanService } from "@/services/complaintService";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getErrorMessage } from "@/lib/complaintUtils";
import { PENGADUAN_STRINGS } from "@/lib/constants/complaints";
import { createComplaintSchema, type CreateComplaintValues } from "@/lib/validators/complaints";

export function useCreateComplaint() {
  const [formError, setFormError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileUpload = useFileUpload();

  const form = useForm<CreateComplaintValues>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: { judul: "", kategori: "", lokasi: "", isi: "" },
  });

  const onSubmit = async (data: CreateComplaintValues) => {
    if (user?.userType !== "masyarakat") {
      toast.error(PENGADUAN_STRINGS.ERROR_ONLY_MASYARAKAT);
      return;
    }
    setFormError(null);
    try {
      await createPengaduanService({ ...data, foto_bukti: fileUpload.file || undefined });
      toast.success(PENGADUAN_STRINGS.SUCCESS_CREATED);
      navigate("/dashboard/history");
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      setFormError(msg);
    }
  };

  return {
    form,
    formError,
    fileUpload,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
