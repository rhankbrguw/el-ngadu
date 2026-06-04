import { useManageCitizens } from "@/hooks/useManageCitizens";
import { Skeleton } from "@/components/ui/skeleton";
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
 <h2 className="text-xl font-bold tracking-tight">Manajemen Masyarakat</h2>
 <p className="text-muted-foreground">
 Lihat dan kelola semua akun masyarakat yang terdaftar.
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
 Gagal Memuat Data
 </h3>
 <p className="text-sm text-muted-foreground mb-4">{error}</p>
 <Button onClick={onRetry}>Coba Lagi</Button>
 </CardContent>
 </Card>
);

export default function ManageCitizensPage() {
 const {
 masyarakatList,
 pagination,
 isLoading,
 error,
 isDialogOpen,
 editingMasyarakat,
 isDesktop,
 setIsDialogOpen,
 handlePageChange,
 handleDeleteMasyarakat,
 handleOpenEditDialog,
 handleDialogSuccess,
 refetch,
 } = useManageCitizens();

 const renderContent = () => {
 if (isLoading && masyarakatList.length === 0) return <LoadingState />;
 if (error) return <ErrorState error={error} onRetry={refetch} />;

 if (masyarakatList.length === 0) {
 return (
 <div className="p-5 text-center text-muted-foreground">
 <p>Belum ada akun masyarakat yang terdaftar.</p>
 </div>
 );
 }

 return isDesktop ? (
 <CitizenTable
 masyarakatList={masyarakatList}
 onDelete={handleDeleteMasyarakat}
 onEdit={handleOpenEditDialog}
 />
 ) : (
 <CitizenCards
 masyarakatList={masyarakatList}
 onDelete={handleDeleteMasyarakat}
 onEdit={handleOpenEditDialog}
 />
 );
 };

 return (
 <div className="space-y-3">
 <PageHeader />

 <Card className="relative">
 {isLoading && masyarakatList.length > 0 && (
 <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
 <Loader2 className="h-6 w-6 animate-spin" />
 </div>
 )}
 <CardContent className="p-4 md:p-0">{renderContent()}</CardContent>
 {pagination && pagination.total_pages > 1 && (
 <DataTablePagination
 pagination={pagination}
 onPageChange={handlePageChange}
 />
 )}
 </Card>

 <CitizenDialog
 isOpen={isDialogOpen}
 onOpenChange={setIsDialogOpen}
 onSuccess={handleDialogSuccess}
 masyarakatToEdit={editingMasyarakat}
 />
 </div>
 );
}
