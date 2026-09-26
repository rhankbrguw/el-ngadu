import { useReports } from "@/hooks/useReports";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { handleExportCSV, handleExportPDF } from "@/components/reports/reportExportUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, FileSpreadsheet, Download, FileText } from "lucide-react";
import { ReportTable } from "@/components/reports/ReportTable";
import ReportCards from "@/components/reports/ReportCards";
import { REPORT_STRINGS } from "@/lib/constants/reports";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportHeaderProps {
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filteredData: ReturnType<typeof useReports>["filteredData"];
}

const ReportExportButtons = ({ filteredData }: { filteredData: ReturnType<typeof useReports>["filteredData"] }) => (
  <div className="flex items-center gap-2">
    <Button
      size="sm"
      onClick={() => handleExportCSV(filteredData)}
      variant="outline"
      disabled={filteredData.length === 0}
      className="h-8 px-3 text-xs font-medium rounded-lg flex-1 sm:flex-none"
    >
      <Download className="mr-1.5 h-3.5 w-3.5" />
      <span className="hidden sm:inline">{REPORT_STRINGS.BTN_CSV}</span>
      <span className="sm:hidden">CSV</span>
    </Button>
    <Button
      size="sm"
      onClick={() => handleExportPDF(filteredData)}
      disabled={filteredData.length === 0}
      className="h-8 px-3 text-xs font-medium rounded-lg flex-1 sm:flex-none"
    >
      <FileText className="mr-1.5 h-3.5 w-3.5" />
      <span className="hidden sm:inline">{REPORT_STRINGS.BTN_PDF}</span>
      <span className="sm:hidden">PDF</span>
    </Button>
  </div>
);

const ReportPageHeader = ({ filterStatus, setFilterStatus, filteredData }: ReportHeaderProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
        <FileSpreadsheet className="h-5 w-5 text-primary flex-shrink-0" />
      </div>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight">{REPORT_STRINGS.TITLE}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">{REPORT_STRINGS.DESCRIPTION}</p>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger size="sm" className="h-8 text-xs w-full sm:w-auto sm:min-w-[145px] bg-background rounded-lg px-2.5">
          <SelectValue placeholder={APP_MESSAGES.SEARCH.FILTER_STATUS} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{REPORT_STRINGS.FILTER_STATUS_ALL}</SelectItem>
          <SelectItem value="diajukan">{REPORT_STRINGS.FILTER_STATUS_DIAJUKAN}</SelectItem>
          <SelectItem value="diproses">{REPORT_STRINGS.FILTER_STATUS_DIPROSES}</SelectItem>
          <SelectItem value="selesai">{REPORT_STRINGS.FILTER_STATUS_SELESAI}</SelectItem>
        </SelectContent>
      </Select>
      <ReportExportButtons filteredData={filteredData} />
    </div>
  </div>
);

interface ReportContentProps {
  isLoading: boolean;
  error: string | null;
  filteredData: ReturnType<typeof useReports>["filteredData"];
  onRetry: () => void;
}

const ReportListContent = ({ isLoading, error, filteredData, onRetry }: ReportContentProps) => {
  if (isLoading) return <div className="space-y-4 mt-6"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>;
  if (error) {
    return (
      <div className="p-5 text-center bg-destructive/10 rounded-lg">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">Coba Lagi</Button>
      </div>
    );
  }
  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">{REPORT_STRINGS.EMPTY_TITLE}</p>
      </div>
    );
  }
  return (
    <>
      <div className="block lg:hidden"><ReportCards laporanList={filteredData} /></div>
      <div className="hidden lg:block"><ReportTable laporanList={filteredData} /></div>
    </>
  );
};

export default function ReportsPage() {
  const { filteredData, filterStatus, setFilterStatus, isLoading, error, refetch } = useReports();

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <ReportPageHeader filterStatus={filterStatus} setFilterStatus={setFilterStatus} filteredData={filteredData} />
      <Card><CardContent className="p-0"><ReportListContent isLoading={isLoading} error={error} filteredData={filteredData} onRetry={refetch} /></CardContent></Card>
    </div>
  );
}

