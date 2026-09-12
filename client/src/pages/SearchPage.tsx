import { useNavigate } from "react-router-dom";
import type { Petugas, Masyarakat, PengaduanWithPelapor } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { AlertCircle, Search, Users, ShieldAlert, FileText, FileQuestion } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/useAuth";
import OfficerResults from "@/components/admin/officers/OfficerResults";
import CitizenResults from "@/components/admin/citizens/CitizenResults";
import ComplaintResults from "@/components/complaints/ComplaintResults";

const LoadingState = () => (
  <div className="space-y-3">
    <Skeleton className="h-6 w-48 rounded-md" />
    <Card className="border shadow-xs overflow-hidden p-4 space-y-3">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </Card>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
    <AlertCircle className="h-10 w-10 text-destructive mb-2" />
    <p className="font-semibold text-destructive">{APP_MESSAGES.SEARCH.FAILED}</p>
    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">{message}</p>
  </div>
);

const NoResultsState = ({ query }: { query: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border/80 bg-muted/10 p-6 sm:p-10">
    <div className="p-3 rounded-2xl bg-muted border border-border/60 mb-3">
      <FileQuestion className="h-8 w-8 text-muted-foreground" />
    </div>
    <p className="font-semibold text-foreground">{APP_MESSAGES.SEARCH.NO_RESULTS}</p>
    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
      {APP_MESSAGES.SEARCH.NO_RESULTS_DESC} <span className="font-bold text-foreground">"{query}"</span>. Periksa ejaan atau gunakan istilah umum.
    </p>
  </div>
);

const InitialState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border/80 bg-muted/10 p-6 sm:p-10">
    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-3">
      <Search className="h-8 w-8 text-primary" />
    </div>
    <p className="font-semibold text-foreground">{APP_MESSAGES.SEARCH.START}</p>
    <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
      {APP_MESSAGES.SEARCH.START_DESC}
    </p>
  </div>
);

const SearchTypeFilter = ({
  type,
  onTypeChange,
}: {
  type: string | null;
  onTypeChange: (type: string) => void;
}) => (
  <div className="flex items-center gap-1 bg-muted/70 p-1 rounded-xl border border-border/60 w-fit">
    <Button size="sm" variant={type === "pengaduan" ? "default" : "ghost"} onClick={() => onTypeChange("pengaduan")} className="gap-1.5 h-8 text-xs font-medium rounded-lg">
      <FileText className="h-3.5 w-3.5" />Pengaduan
    </Button>
    <Button size="sm" variant={type === "petugas" ? "default" : "ghost"} onClick={() => onTypeChange("petugas")} className="gap-1.5 h-8 text-xs font-medium rounded-lg">
      <ShieldAlert className="h-3.5 w-3.5" />Petugas
    </Button>
    <Button size="sm" variant={type === "masyarakat" ? "default" : "ghost"} onClick={() => onTypeChange("masyarakat")} className="gap-1.5 h-8 text-xs font-medium rounded-lg">
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

interface SearchHeaderProps {
  query: string | null;
  count: number;
  isAdmin: boolean;
  type: string | null;
  onTypeChange: (type: string) => void;
}

const SearchHeader = ({ query, count, isAdmin, type, onTypeChange }: SearchHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
        <Search className="h-5 w-5 text-primary flex-shrink-0" />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{APP_MESSAGES.SEARCH.TITLE}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {query ? (
            <>Ditemukan <span className="font-semibold text-foreground">{count} data</span> untuk <span className="font-semibold text-foreground">"{query}"</span></>
          ) : (
            "Cari data pengaduan, petugas, atau masyarakat dengan cepat"
          )}
        </p>
      </div>
    </div>
    {isAdmin && <SearchTypeFilter type={type} onTypeChange={onTypeChange} />}
  </div>
);

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
      <SearchHeader query={query} count={results.length} isAdmin={isAdmin} type={type} onTypeChange={handleTypeChange} />
      <div className="mt-2">
        <SearchResultsView isLoading={isLoading} error={error} query={query} results={results} type={type} />
      </div>
    </div>
  );
}



