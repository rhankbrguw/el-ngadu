import type { Petugas, Masyarakat, PengaduanWithPelapor } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { AlertCircle, Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
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
 {APP_MESSAGES.SEARCH.NO_RESULTS_DESC}{" "}
 <span className="font-bold">"{query}"</span>.
 </p>
 </div>
);

const InitialState = () => (
 <div className="flex flex-col items-center justify-center py-12 text-center">
 <Search className="h-10 w-10 text-muted-foreground mb-2" />
 <p className="font-semibold">{APP_MESSAGES.SEARCH.START}</p>
 <p className="text-sm text-muted-foreground">
 {APP_MESSAGES.SEARCH.START_DESC}
 </p>
 </div>
);

export default function SearchPage() {
 const { results, isLoading, error, query, type } = useSearch();

 const renderResults = () => {
 if (isLoading) return <LoadingState />;
 if (error) return <ErrorState message={error} />;

 if (!query) return <InitialState />;

 if (results.length === 0) return <NoResultsState query={query} />;

 switch (type) {
 case "petugas":
 return <OfficerResults petugasList={results as Petugas[]} />;
 case "masyarakat":
 return <CitizenResults masyarakatList={results as Masyarakat[]} />;
 case "pengaduan":
 return (
 <ComplaintResults pengaduanList={results as PengaduanWithPelapor[]} />
 );
 default:
 return (
 <p className="text-center text-muted-foreground">
 {APP_MESSAGES.SEARCH.UNKNOWN_TYPE}
 </p>
 );
 }
 };

 return (
 <div className="space-y-3">
 <div>
 <h1 className="text-xl font-bold">{APP_MESSAGES.SEARCH.TITLE}</h1>
 {query && (
 <p className="text-muted-foreground mt-1">
 {APP_MESSAGES.SEARCH.SHOWING_RESULTS}{" "}
 <span className="font-semibold text-foreground">"{query}"</span>
 </p>
 )}
 </div>
 <div className="mt-4">{renderResults()}</div>
 </div>
 );
}
