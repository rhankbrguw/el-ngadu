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

async function submitComplaint(data: CreateComplaintValues, file: File | null) {
  return await createPengaduanService({ ...data, foto_bukti: file || undefined });
}

function getDefaultComplaintValues(): CreateComplaintValues {
  return {
    judul: "",
    kategori: "",
    lokasi: "",
    kecamatan: "",
    kelurahan: "",
    tanggal_kejadian: new Date().toISOString().split("T")[0],
    prioritas: "sedang",
    is_anonim: false,
    isi: "",
  };
}

async function executeSubmission(
  data: CreateComplaintValues,
  file: File | null,
  navigate: ReturnType<typeof useNavigate>,
  setFormError: (msg: string | null) => void
) {
  try {
    await submitComplaint(data, file);
    toast.success(PENGADUAN_STRINGS.SUCCESS_CREATED);
    navigate("/dashboard/history");
  } catch (err) {
    const msg = getErrorMessage(err);
    toast.error(msg);
    setFormError(msg);
  }
}

export function useCreateComplaint() {
  const [formError, setFormError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileUpload = useFileUpload();

  const form = useForm<CreateComplaintValues>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: getDefaultComplaintValues(),
  });

  const onSubmit = async (data: CreateComplaintValues) => {
    if (user?.userType !== "masyarakat") {
      toast.error(PENGADUAN_STRINGS.ERROR_ONLY_MASYARAKAT);
      return;
    }
    setFormError(null);
    await executeSubmission(data, fileUpload.file, navigate, setFormError);
  };

  return { form, formError, fileUpload, onSubmit: form.handleSubmit(onSubmit), isLoading: form.formState.isSubmitting };
}


