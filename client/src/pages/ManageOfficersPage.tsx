import { useManageOfficers } from "@/hooks/useManageOfficers";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, PlusCircle, ShieldCheck } from "lucide-react";
import OfficerResults from "@/components/admin/officers/OfficerResults";
import OfficerDialog from "@/components/admin/OfficerDialog";
import DataTablePagination from "@/components/common/DataTablePagination";

const PageHeader = ({ onAdd }: { onAdd: () => void }) => (
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
 <div className="flex items-center gap-4">
 <ShieldCheck className="h-7 w-7 text-primary" />
 <div className="space-y-1">
 <h2 className="text-xl font-bold tracking-tight">Manajemen Petugas</h2>
 <p className="text-muted-foreground">
 Kelola data petugas dan admin sistem.
 </p>
 </div>
 </div>
 <Button onClick={onAdd} className="w-full sm:w-auto">
 <PlusCircle className="mr-2 h-4 w-4" />
 Tambah Petugas
 </Button>
 </div>
);

const LoadingState = () => (
 <div className="space-y-4 p-4">
 <Skeleton className="h-10 w-full" />
 <Skeleton className="h-24 w-full" />
 <Skeleton className="h-24 w-full" />
 <Skeleton className="h-24 w-full" />
 </div>
);

const ErrorState = ({
 error,
 onRetry,
}: {
 error: string;
 onRetry: () => void;
}) => (
 <div className="text-center p-5">
 <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
 <h3 className="text-lg font-semibold text-destructive mb-2">
 Gagal Memuat Data
 </h3>
 <p className="text-sm text-muted-foreground mb-4">{error}</p>
 <Button onClick={onRetry}>Coba Lagi</Button>
 </div>
);

const EmptyState = () => (
 <div className="p-5 text-center text-muted-foreground">
 <p>Belum ada data petugas yang tersedia.</p>
 </div>
);

export default function ManageOfficersPage() {
 const {
 petugasList,
 pagination,
 isLoading,
 error,
 isDialogOpen,
 editingPetugas,
 setIsDialogOpen,
 handlePageChange,
 handleDeletePetugas,
 handleOpenEditDialog,
 handleOpenAddDialog,
 handleDialogSuccess,
 refetch,
 } = useManageOfficers();

 const renderContent = () => {
 if (isLoading && !petugasList.length) return <LoadingState />;
 if (error) return <ErrorState error={error} onRetry={refetch} />;
 if (!petugasList.length) return <EmptyState />;

 return (
 <OfficerResults
 petugasList={petugasList}
 onEdit={handleOpenEditDialog}
 onDelete={handleDeletePetugas}
 />
 );
 };

 return (
 <div className="space-y-3">
 <PageHeader onAdd={handleOpenAddDialog} />

 <Card className="relative">
 {isLoading && petugasList.length > 0 && (
 <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
 <Loader2 className="h-6 w-6 animate-spin" />
 </div>
 )}
 <CardContent className="p-0">{renderContent()}</CardContent>
 {pagination && pagination.total_pages > 1 && (
 <DataTablePagination
 pagination={pagination}
 onPageChange={handlePageChange}
 />
 )}
 </Card>

 <OfficerDialog
 isOpen={isDialogOpen}
 onOpenChange={setIsDialogOpen}
 onSuccess={handleDialogSuccess}
 petugasToEdit={editingPetugas}
 />
 </div>
 );
}
