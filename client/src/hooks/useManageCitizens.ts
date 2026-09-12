import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
 getMasyarakatService,
 deleteMasyarakatService,
 updateMasyarakatService,
} from "@/services/citizenService";
import type { Masyarakat, Pagination } from "@/types";
import { useMediaQuery } from "@/hooks/utils/use-media-query";
import { getErrorMessage } from "@/lib/complaintUtils";
import { APP_MESSAGES } from "@/lib/constants/messages";

function useCitizenDialog(onRefresh: () => void) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMasyarakat, setEditingMasyarakat] = useState<Masyarakat | null>(null);

  const handleOpenEditDialog = (m: Masyarakat) => { setEditingMasyarakat(m); setIsDialogOpen(true); };
  const handleDialogSuccess = () => { setIsDialogOpen(false); setEditingMasyarakat(null); onRefresh(); };

  return { isDialogOpen, editingMasyarakat, setIsDialogOpen, handleOpenEditDialog, handleDialogSuccess };
}

function useCitizenPaginationFetch(currentPage: number) {
  const [masyarakatList, setMasyarakatList] = useState<Masyarakat[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMasyarakat = useCallback(async (page: number) => {
    setIsLoading(true); setError(null);
    try {
      const res = await getMasyarakatService(page);
      setMasyarakatList(res.data); setPagination(res.pagination);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchMasyarakat(currentPage); }, [fetchMasyarakat, currentPage]);

  return { masyarakatList, pagination, isLoading, error, fetchMasyarakat };
}

export function useManageCitizens() {
  const [currentPage, setCurrentPage] = useState(1);
  const isDesktop = useMediaQuery("(min-width: 768px)") ?? false;
  const { masyarakatList, pagination, isLoading, error, fetchMasyarakat } = useCitizenPaginationFetch(currentPage);
  const dialog = useCitizenDialog(() => fetchMasyarakat(currentPage));

  const handleDeleteMasyarakat = async (nik: string) => {
    try {
      await deleteMasyarakatService(nik);
      toast.success(APP_MESSAGES.TOAST_MESSAGES.SUCCESS_DELETE_CITIZEN);
      if (masyarakatList.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
      else fetchMasyarakat(currentPage);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return {
    masyarakatList, pagination, isLoading, error, isDesktop,
    ...dialog,
    handlePageChange: setCurrentPage,
    handleDeleteMasyarakat,
    updateMasyarakat: updateMasyarakatService,
    refetch: () => fetchMasyarakat(currentPage),
  };
}


