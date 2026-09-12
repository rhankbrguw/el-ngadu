import { useState, useCallback, useEffect } from "react";
import { getMyPengaduanService } from "@/services/complaintService";
import type { Pengaduan, Pagination } from "@/types";

async function loadHistoryPage(page: number) {
  return await getMyPengaduanService(page, 10);
}

export function useComplaintHistory() {
  const [pengaduan, setPengaduan] = useState<Pengaduan[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPengaduan = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loadHistoryPage(page);
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

  return { pengaduan, pagination, isLoading, error, currentPage, setCurrentPage, fetchPengaduan };
}

