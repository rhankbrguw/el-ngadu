import { useNavigate } from "react-router-dom";
import type { Petugas, Masyarakat, PengaduanWithPelapor } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { AlertCircle, Search, Users, ShieldAlert, FileText } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/useAuth";
import OfficerResults from "@/components/admin/officers/OfficerResults";
import CitizenResults from "@/components/admin/citizens/CitizenResults";
import ComplaintResults from "@/components/complaints/ComplaintResults";

const LoadingState = () => (
  <div className="space-y-4 py-8">
    <Skeleton className="h-12 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="h-10 w-10 text-destructive mb-2" />
    <p className="font-semibold text-destructive">{APP_MESSAGES.SEARCH.FAILED}</p>
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

const NoResultsState = ({ query }: { query: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Search className="h-10 w-10 text-muted-foreground mb-2" />
    <p className="font-semibold">{APP_MESSAGES.SEARCH.NO_RESULTS}</p>
    <p className="text-sm text-muted-foreground">
      {APP_MESSAGES.SEARCH.NO_RESULTS_DESC} <span className="font-bold">"{query}"</span>.
    </p>
  </div>
);

const InitialState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Search className="h-10 w-10 text-muted-foreground mb-2" />
    <p className="font-semibold">{APP_MESSAGES.SEARCH.START}</p>
    <p className="text-sm text-muted-foreground">{APP_MESSAGES.SEARCH.START_DESC}</p>
  </div>
);

interface SearchFilterProps {
  type: string | null;
  onTypeChange: (type: string) => void;
}

const SearchTypeFilter = ({ type, onTypeChange }: SearchFilterProps) => (
  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border w-fit">
    <Button size="sm" variant={type === "pengaduan" ? "default" : "ghost"} onClick={() => onTypeChange("pengaduan")} className="gap-1.5 h-8 text-xs font-medium">
      <FileText className="h-3.5 w-3.5" />Pengaduan
    </Button>
    <Button size="sm" variant={type === "petugas" ? "default" : "ghost"} onClick={() => onTypeChange("petugas")} className="gap-1.5 h-8 text-xs font-medium">
      <ShieldAlert className="h-3.5 w-3.5" />Petugas
    </Button>
    <Button size="sm" variant={type === "masyarakat" ? "default" : "ghost"} onClick={() => onTypeChange("masyarakat")} className="gap-1.5 h-8 text-xs font-medium">
      <Users className="h-3.5 w-3.5" />Masyarakat
    </Button>
  </div>
);

interface ResultsViewProps {
  isLoading: boolean;
  error: string | null;
  query: string | null;
  results: unknown[];
  type: string | null;
}

const SearchResultsView = ({ isLoading, error, query, results, type }: ResultsViewProps) => {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!query) return <InitialState />;
  if (results.length === 0) return <NoResultsState query={query} />;

  if (type === "petugas") return <OfficerResults petugasList={results as Petugas[]} />;
  if (type === "masyarakat") return <CitizenResults masyarakatList={results as Masyarakat[]} />;
  return <ComplaintResults pengaduanList={results as PengaduanWithPelapor[]} />;
};

export default function SearchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { results, isLoading, error, query, type } = useSearch();

  const handleTypeChange = (newType: string) => {
    navigate(`/dashboard/search?q=${encodeURIComponent(query || "")}&type=${newType}`, { replace: true });
  };

  const isAdmin = user?.userType === "petugas" && (user as Petugas).level === "admin";


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{APP_MESSAGES.SEARCH.TITLE}</h1>
          {query && (
            <p className="text-muted-foreground mt-1">{APP_MESSAGES.SEARCH.SHOWING_RESULTS} <span className="font-semibold text-foreground">"{query}"</span></p>
          )}
        </div>
        {isAdmin && <SearchTypeFilter type={type} onTypeChange={handleTypeChange} />}
      </div>
      <div className="mt-4"><SearchResultsView isLoading={isLoading} error={error} query={query} results={results} type={type} /></div>
    </div>
  );
}

