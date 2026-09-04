import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPetugasService } from "@/services/officerService";
import { searchMasyarakatService } from "@/services/citizenService";
import { searchPengaduanService } from "@/services/complaintService";
import type { Petugas, Masyarakat, PengaduanWithPelapor } from "@/types";
import { getErrorMessage } from "@/lib/complaintUtils";

type SearchResult = (Petugas | PengaduanWithPelapor | Masyarakat)[];


async function executeSearch(type: string, query: string): Promise<SearchResult> {
  if (type === "petugas") return (await searchPetugasService(query)) || [];
  if (type === "masyarakat") return (await searchMasyarakatService(query)) || [];
  if (type === "pengaduan") return (await searchPengaduanService(query)) || [];
  return [];
}

export function useSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const type = searchParams.get("type");
  const [results, setResults] = useState<SearchResult>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    if (!query || !type) { setResults([]); setIsLoading(false); return; }

    setIsLoading(true); setError(null);
    executeSearch(type, query)
      .then((data) => { if (!isCancelled) setResults(data); })
      .catch((err) => { if (!isCancelled) setError(getErrorMessage(err)); })
      .finally(() => { if (!isCancelled) setIsLoading(false); });

    return () => { isCancelled = true; };
  }, [query, type]);

  return { results, isLoading, error, query, type };
}

