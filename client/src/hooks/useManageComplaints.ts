import { useState, useCallback, useEffect } from "react";
import { getAllPengaduanService } from "@/services/complaintService";
import type { PengaduanWithPelapor, Pagination } from "@/types";


function useComplaintData(page: number, filters: { q: string; status: string; kecamatan: string }) {
  const [pengaduan, setPengaduan] = useState<PengaduanWithPelapor[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [availableKecamatan, setAvailableKecamatan] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllPengaduanService({ page, ...filters });
      setPengaduan(res.data);
      setPagination(res.pagination);
      if (res.available_kecamatan) setAvailableKecamatan(res.available_kecamatan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { pengaduan, pagination, availableKecamatan, isLoading, error, fetchData };
}

export function useManageComplaints() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ q: "", status: "all", kecamatan: "all" });
  const data = useComplaintData(page, filters);

  const updateFilter = (k: "q" | "status" | "kecamatan", v: string) => {
    setFilters((prev) => ({ ...prev, [k]: v }));
    setPage(1);
  };

  return {
    ...data, currentPage: page, setCurrentPage: setPage,
    filters, updateFilter, refetch: data.fetchData
  };
}



