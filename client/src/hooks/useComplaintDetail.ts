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

export function useComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [pengaduan, setPengaduan] = useState<PengaduanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isiResponse, setIsiResponse] = useState("");

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setError("ID Pengaduan tidak valid.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getComplaintDetailService(id);
      setPengaduan(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleStatusChange = async (newStatus: "diproses" | "selesai") => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateStatusPengaduanService(id, newStatus);
      setPengaduan((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success("Status berhasil diubah!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResponseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !isiResponse.trim() || user?.userType !== "petugas") return;

    setIsSubmitting(true);
    try {
      await createResponseService({
        id_pengaduan: id,
        isi_tanggapan: isiResponse,
      });
      toast.success("Response berhasil dikirim!");

      const newResponse: Response = {
        id_tanggapan: Date.now(),
        isi_tanggapan: isiResponse,
        nama_penanggap: user.nama_petugas,
        tgl_tanggapan: new Date().toISOString(),
      };
      setPengaduan((prev) =>
        prev ? { ...prev, tanggapan: newResponse, status: "selesai" } : null
      );
      setIsiResponse("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    pengaduan,
    isLoading,
    error,
    isSubmitting,
    isiResponse,
    setIsiResponse,
    handleStatusChange,
    handleResponseSubmit,
    refetch: fetchDetail,
  };
}
