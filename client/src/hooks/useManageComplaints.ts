import { useState, useCallback, useEffect } from "react";
import { getAllPengaduanService } from "@/services/complaintService";
import type { PengaduanWithPelapor, Pagination } from "@/types";

export function useManageComplaints() {
  const [pengaduan, setPengaduan] = useState<PengaduanWithPelapor[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPengaduan = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllPengaduanService(page);
      setPengaduan(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPengaduan(currentPage);
  }, [fetchPengaduan, currentPage]);

  return {
    pengaduan,
    pagination,
    currentPage,
    setCurrentPage,
    isLoading,
    error,
    fetchPengaduan,
  };
}
