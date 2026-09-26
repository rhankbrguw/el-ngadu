import { useState, useMemo } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { getReportService } from "@/services/reportService";

export function useReports() {
  const {
    data: laporanList,
    isLoading,
    error,
    refetch,
  } = useFetchData(getReportService);

  const [filterStatus, setFilterStatus] = useState("all");

  const filteredData = useMemo(() => {
    if (!Array.isArray(laporanList)) return [];
    if (filterStatus === "all") return laporanList;
    return laporanList.filter((item) => item.status === filterStatus);
  }, [laporanList, filterStatus]);

  return {
    laporanList,
    filteredData,
    filterStatus,
    setFilterStatus,
    isLoading,
    error,
    refetch
  };
}
