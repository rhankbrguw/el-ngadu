import { useState, useMemo } from "react";
import { getReportService } from "@/services/reportService";
import { useFetchData } from "@/hooks/useFetchData";
import { handleExportCSV, handleExportPDF } from "@/components/reports/reportExportUtils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, FileSpreadsheet, Download, FileText } from "lucide-react";
import { ReportTable } from "@/components/reports/ReportTable";
import ReportCards from "@/components/reports/ReportCards";
import { REPORT_STRINGS } from "@/lib/constants/reports";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
 const {
 data: laporanList,
 isLoading,
 error,
 refetch,
 } = useFetchData(getReportService);

 const [filterStatus, setFilterStatus] = useState("all");

 const filteredData = useMemo(() => {
 if (!laporanList) return [];
 if (filterStatus === "all") return laporanList;
 return laporanList.filter(item => item.status === filterStatus);
 }, [laporanList, filterStatus]);


 const renderContent = () => {
 if (isLoading) {
 return (
 <div className="space-y-4 mt-6">
 <Skeleton className="h-16 w-full" />
 <Skeleton className="h-16 w-full" />
 <Skeleton className="h-16 w-full" />
 </div>
 );
 }

 if (error) {
 return (
 <div className="p-5 text-center bg-destructive/10 rounded-lg">
 <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
 <p className="mt-2 font-semibold text-destructive">Gagal Memuat Data</p>
 <p className="text-sm text-muted-foreground">{error}</p>
 <Button variant="outline" size="sm" onClick={refetch} className="mt-4">
 Coba Lagi
 </Button>
 </div>
 );
 }

 if (filteredData.length === 0) {
 return (
 <div className="text-center py-12">
 <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
 <p className="mt-4 text-lg font-medium text-muted-foreground">{REPORT_STRINGS.EMPTY_TITLE}</p>
 <p className="text-sm text-muted-foreground">{REPORT_STRINGS.EMPTY_DESC}</p>
 </div>
 );
 }

 return (
 <>
 <div className="block lg:hidden">
 <ReportCards laporanList={filteredData} />
 </div>
 <div className="hidden lg:block">
 <ReportTable laporanList={filteredData} />
 </div>
 </>
 );
 };

 return (
 <div className="space-y-4 p-4 sm:p-5">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
 <div className="flex items-center gap-4">
 <div className="bg-primary/10 p-2 rounded-lg">
 <FileSpreadsheet className="h-6 w-6 text-primary flex-shrink-0" />
 </div>
 <div className="space-y-1">
 <h2 className="text-xl font-bold tracking-tight">{REPORT_STRINGS.TITLE}</h2>
 <p className="text-sm text-muted-foreground">{REPORT_STRINGS.DESCRIPTION}</p>
 </div>
 </div>
 
 <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
 <Select value={filterStatus} onValueChange={setFilterStatus}>
 <SelectTrigger className="w-full sm:w-[150px]">
 <SelectValue placeholder="Filter Status" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">{REPORT_STRINGS.FILTER_STATUS_ALL}</SelectItem>
 <SelectItem value="diajukan">{REPORT_STRINGS.FILTER_STATUS_DIAJUKAN}</SelectItem>
 <SelectItem value="diproses">{REPORT_STRINGS.FILTER_STATUS_DIPROSES}</SelectItem>
 <SelectItem value="selesai">{REPORT_STRINGS.FILTER_STATUS_SELESAI}</SelectItem>
 </SelectContent>
 </Select>
 
 <Button onClick={() => handleExportCSV(filteredData)} variant="outline" disabled={filteredData.length === 0} className="w-full sm:w-auto">
 <Download className="mr-2 h-4 w-4" />
 <span className="hidden sm:inline">{REPORT_STRINGS.BTN_CSV}</span>
 <span className="sm:hidden">CSV</span>
 </Button>

 <Button onClick={() => handleExportPDF(filteredData)} disabled={filteredData.length === 0} className="w-full sm:w-auto">
 <FileText className="mr-2 h-4 w-4" />
 <span className="hidden sm:inline">{REPORT_STRINGS.BTN_PDF}</span>
 <span className="sm:hidden">PDF</span>
 </Button>
 </div>
 </div>
 {renderContent()}
 </div>
 );
}
