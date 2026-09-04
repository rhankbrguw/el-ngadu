import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
 getComplaintDetailService,
 updateStatusPengaduanService,
} from "@/services/complaintService";
import { createResponseService } from "@/services/responseService";
import type { PengaduanDetail, Response } from "@/types";
import { getErrorMessage } from "@/lib/complaintUtils";
import { APP_MESSAGES } from "@/lib/constants/messages";

function buildLocalResponse(isi: string, userName: string): Response {
  return { id_tanggapan: Date.now(), isi_tanggapan: isi, nama_penanggap: userName, tgl_tanggapan: new Date().toISOString() };
}

async function updateComplaintStatus(id: string, status: "diproses" | "selesai") {
  await updateStatusPengaduanService(id, status);
}

function useComplaintStatusAction(id: string | undefined, setPengaduan: React.Dispatch<React.SetStateAction<PengaduanDetail | null>>) {
  const [isStatusSubmitting, setIsSubmitting] = useState(false);
  const handleStatusChange = async (newStatus: "diproses" | "selesai") => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateComplaintStatus(id, newStatus);
      setPengaduan((p) => (p ? { ...p, status: newStatus } : null));
      toast.success(APP_MESSAGES.TOAST_MESSAGES.SUCCESS_CHANGE_STATUS);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setIsSubmitting(false); }
  };
  return { isStatusSubmitting, handleStatusChange };
}

function useComplaintResponseAction(
  id: string | undefined,
  user: ReturnType<typeof useAuth>["user"],
  setPengaduan: React.Dispatch<React.SetStateAction<PengaduanDetail | null>>
) {
  const [isResponseSubmitting, setIsSubmitting] = useState(false);
  const [isiResponse, setIsiResponse] = useState("");

  const handleResponseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !isiResponse.trim() || user?.userType !== "petugas") return;
    setIsSubmitting(true);
    try {
      await createResponseService({ id_pengaduan: id, isi_tanggapan: isiResponse });
      toast.success(APP_MESSAGES.TOAST_MESSAGES.SUCCESS_SEND_RESPONSE);
      setPengaduan((p) => (p ? { ...p, tanggapan: buildLocalResponse(isiResponse, user.nama_petugas), status: "selesai" } : null));
      setIsiResponse("");
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setIsSubmitting(false); }
  };

  return { isResponseSubmitting, isiResponse, setIsiResponse, handleResponseSubmit };
}



export function useComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [pengaduan, setPengaduan] = useState<PengaduanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) { setError("ID Pengaduan tidak valid."); setIsLoading(false); return; }
    setIsLoading(true); setError(null);
    try { setPengaduan(await getComplaintDetailService(id)); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [id]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);
  const statusAct = useComplaintStatusAction(id, setPengaduan);
  const respAct = useComplaintResponseAction(id, user, setPengaduan);

  return {
    user, pengaduan, isLoading, error, refetch: fetchDetail,
    isSubmitting: statusAct.isStatusSubmitting || respAct.isResponseSubmitting,
    handleStatusChange: statusAct.handleStatusChange,
    ...respAct,
  };
}



