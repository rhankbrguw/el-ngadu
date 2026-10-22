import { useManageCitizens } from "@/hooks/useManageCitizens";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Users } from "lucide-react";
import CitizenTable from "@/components/admin/citizens/CitizenTable";
import CitizenCards from "@/components/admin/citizens/CitizenCards";
import CitizenDialog from "@/components/admin/citizens/CitizenDialog";
import DataTablePagination from "@/components/common/DataTablePagination";

const PageHeader = () => (
 <div className="flex items-center gap-4 mb-4">
 <Users className="h-7 w-7 text-primary" />
 <div className="space-y-1">
 <h2 className="text-xl font-bold tracking-tight">{APP_MESSAGES.CITIZEN.TITLE}</h2>
 <p className="text-muted-foreground">
 {APP_MESSAGES.CITIZEN.DESC}
 </p>
 </div>
 </div>
);

const LoadingState = () => (
 <div className="space-y-4 p-4">
 <Skeleton className="h-10 w-full" />
 <Skeleton className="h-20 w-full" />
 <Skeleton className="h-20 w-full" />
 <Skeleton className="h-20 w-full" />
 </div>
);

const ErrorState = ({
 error,
 onRetry,
}: {
 error: string;
 onRetry: () => void;
}) => (
 <Card>
 <CardContent className="p-5 text-center">
 <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
 <h3 className="text-lg font-semibold text-destructive mb-2">
 {APP_MESSAGES.CITIZEN.FAILED}
 </h3>
 <p className="text-sm text-muted-foreground mb-4">{error}</p>
 <Button onClick={onRetry}>{APP_MESSAGES.CITIZEN.RETRY}</Button>
 </CardContent>
 </Card>
);

interface CitizenContentProps {
  isLoading: boolean;
  error: string | null;
  masyarakatList: ReturnType<typeof useManageCitizens>["masyarakatList"];
  isDesktop: boolean | null;
  onRetry: () => void;
  onDelete: (nik: string) => void;
  onEdit: (m: ReturnType<typeof useManageCitizens>["masyarakatList"][0]) => void;
}

const CitizenContent = ({ isLoading, error, masyarakatList, isDesktop, onRetry, onDelete, onEdit }: CitizenContentProps) => {
  if (isLoading && masyarakatList.length === 0) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (masyarakatList.length === 0) return <div className="p-5 text-center text-muted-foreground"><p>{APP_MESSAGES.CITIZEN.EMPTY}</p></div>;
  if (isDesktop) return <CitizenTable masyarakatList={masyarakatList} onDelete={onDelete} onEdit={onEdit} />;
  return <CitizenCards masyarakatList={masyarakatList} onDelete={onDelete} onEdit={onEdit} />;
};

const CitizenCardWrapper = ({ cit }: { cit: ReturnType<typeof useManageCitizens> }) => (
  <Card className="relative">
    {cit.isLoading && cit.masyarakatList.length > 0 && (
      <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )}
    <CardContent className="p-4 md:p-0">
      <CitizenContent
        isLoading={cit.isLoading}
        error={cit.error}
        masyarakatList={cit.masyarakatList}
        isDesktop={cit.isDesktop}
        onRetry={cit.refetch}
        onDelete={cit.handleDeleteMasyarakat}
        onEdit={cit.handleOpenEditDialog}
      />
    </CardContent>
    {cit.pagination && cit.pagination.total_pages > 1 && (
      <DataTablePagination pagination={cit.pagination} onPageChange={cit.handlePageChange} />
    )}
  </Card>
);

export default function ManageCitizensPage() {
  const cit = useManageCitizens();

  return (
    <div className="space-y-3">
      <PageHeader />
      <CitizenCardWrapper cit={cit} />
      <CitizenDialog
        isOpen={cit.isDialogOpen}
        onOpenChange={cit.setIsDialogOpen}
        onSuccess={cit.handleDialogSuccess}
        onUpdate={cit.updateMasyarakat}
        masyarakatToEdit={cit.editingMasyarakat}
      />
    </div>
  );
}


