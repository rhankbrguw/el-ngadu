import { useState, useCallback, useEffect } from "react";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { toast } from "sonner";
import {
 getPetugasService,
 deletePetugasService,
 createPetugasService,
 updatePetugasService,
} from "@/services/officerService";
import type { Petugas, Pagination } from "@/types";
import { getErrorMessage } from "@/lib/complaintUtils";

function useOfficerDialog(onRefresh: () => void) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPetugas, setEditingPetugas] = useState<Petugas | null>(null);

  const handleOpenAddDialog = () => { setEditingPetugas(null); setIsDialogOpen(true); };
  const handleOpenEditDialog = (p: Petugas) => { setEditingPetugas(p); setIsDialogOpen(true); };
  const handleDialogSuccess = () => { setIsDialogOpen(false); setEditingPetugas(null); onRefresh(); };

  return { isDialogOpen, editingPetugas, setIsDialogOpen, handleOpenAddDialog, handleOpenEditDialog, handleDialogSuccess };
}

function useOfficerPaginationFetch(currentPage: number) {
  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPetugas = useCallback(async (page: number) => {
    setIsLoading(true); setError(null);
    try {
      const res = await getPetugasService(page);
      setPetugasList(res.data); setPagination(res.pagination);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchPetugas(currentPage); }, [fetchPetugas, currentPage]);

  return { petugasList, pagination, isLoading, error, fetchPetugas };
}

export function useManageOfficers() {
  const [currentPage, setCurrentPage] = useState(1);
  const { petugasList, pagination, isLoading, error, fetchPetugas } = useOfficerPaginationFetch(currentPage);
  const dialog = useOfficerDialog(() => fetchPetugas(currentPage));

  const handleDeletePetugas = async (id: number) => {
    try {
      await deletePetugasService(id);
      toast.success(APP_MESSAGES.TOAST_MESSAGES.SUCCESS_DELETE_OFFICER);
      if (petugasList.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
      else fetchPetugas(currentPage);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return {
    petugasList, pagination, isLoading, error, ...dialog,
    handlePageChange: setCurrentPage,
    handleDeletePetugas,
    createPetugas: createPetugasService,
    updatePetugas: updatePetugasService,
    refetch: () => fetchPetugas(currentPage),
  };
}


