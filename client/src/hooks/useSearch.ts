import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPetugasService } from "@/services/officerService";
import { searchMasyarakatService } from "@/services/citizenService";
import { searchPengaduanService } from "@/services/complaintService";
import { useAuth } from "@/hooks/useAuth";
import type { Petugas, Masyarakat, PengaduanWithPelapor } from "@/types";
import { getErrorMessage } from "@/lib/complaintUtils";

type SearchResult = (Petugas | PengaduanWithPelapor | Masyarakat)[];

async function executeSearch(type: string, query: string): Promise<SearchResult> {
  if (type === "petugas") return (await searchPetugasService(query)) || [];
  if (type === "masyarakat") return (await searchMasyarakatService(query)) || [];
  return (await searchPengaduanService(query)) || [];
}

function useSearchExecution(type: string, query: string | null) {
  const [results, setResults] = useState<SearchResult>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const trimmed = query?.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    executeSearch(type, trimmed)
      .then((data) => { if (!isCancelled) setResults(data); })
      .catch((err) => { if (!isCancelled) setError(getErrorMessage(err)); })
      .finally(() => { if (!isCancelled) setIsLoading(false); });

    return () => { isCancelled = true; };
  }, [query, type]);

  return { results, isLoading, error };
}

export function useSearch() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const rawType = searchParams.get("type");

  const isAdmin = user?.userType === "petugas" && (user as Petugas).level === "admin";
  const type = !isAdmin || !rawType ? "pengaduan" : rawType;
  const { results, isLoading, error } = useSearchExecution(type, query);

  return { results, isLoading, error, query, type };
}



