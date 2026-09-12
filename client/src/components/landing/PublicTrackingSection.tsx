import { useState, type FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, AlertCircle, CheckCircle2, Clock, Calendar, MapPin, UserCheck } from "lucide-react";
import { getComplaintDetailService } from "@/services/complaintService";
import { COMPLAINT_TRACKING_STRINGS } from "@/lib/constants/complaints";
import { formatDate, getStatusVariant, formatStatus } from "@/lib/complaintUtils";
import type { PengaduanDetail } from "@/types";

function maskName(name: string): string {
  if (!name || name.toLowerCase().includes("anonim")) return "Masyarakat (Anonim)";
  return name.split(" ").map((w) => (w.length <= 1 ? w : w[0] + "*".repeat(Math.min(w.length - 1, 5)))).join(" ");
}

const TrackingHeader = () => (
  <div className="text-center mb-8">
    <Badge variant="outline" className="mb-2 px-3 py-1 font-semibold text-primary border-primary/30">
      Pengecekan Publik
    </Badge>
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{COMPLAINT_TRACKING_STRINGS.TITLE}</h2>
    <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">{COMPLAINT_TRACKING_STRINGS.SUBTITLE}</p>
  </div>
);

interface SearchFormProps {
  input: string;
  onInputChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

const TrackingSearchForm = ({ input, onInputChange, onSubmit, isLoading, error }: SearchFormProps) => (
  <Card className="border shadow-xs">
    <CardContent className="p-4 sm:p-6">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={COMPLAINT_TRACKING_STRINGS.INPUT_PLACEHOLDER}
            className="pl-9 h-10"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="h-10 px-6 font-medium">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : COMPLAINT_TRACKING_STRINGS.BTN_TRACK}
        </Button>
      </form>
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

const TrackingResultCard = ({ result }: { result: PengaduanDetail }) => (
  <Card className="mt-6 border shadow-xs">
    <CardContent className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-muted-foreground">ID Tiket: #{result.id}</span>
          <h3 className="text-base font-bold text-foreground mt-0.5">{result.judul}</h3>
        </div>
        <Badge variant={getStatusVariant(result.status)} className="px-3 py-1 text-xs">{formatStatus(result.status)}</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <div className="flex items-center gap-1.5"><UserCheck className="h-4 w-4 text-primary" /><span>{result.is_anonim ? "Anonim" : maskName(result.nama_pelapor)}</span></div>
        <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /><span>{formatDate(result.created_at)}</span></div>
        <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /><span>{[result.kecamatan, result.kelurahan].filter(Boolean).join(", ") || "-"}</span></div>
      </div>
      <div className="rounded-lg border p-3.5 space-y-1.5 bg-background">
        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          {result.status === "selesai" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clock className="h-4 w-4 text-amber-600" />}
          {COMPLAINT_TRACKING_STRINGS.OFFICER_REPLY}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.tanggapan ? result.tanggapan.isi_tanggapan : COMPLAINT_TRACKING_STRINGS.NO_REPLY_YET}</p>
      </div>
    </CardContent>
  </Card>
);

function usePublicTracking() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<PengaduanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    const cleanId = input.replace(/[^0-9]/g, "").trim();
    if (!cleanId) return setError(COMPLAINT_TRACKING_STRINGS.EMPTY_ERROR);

    setIsLoading(true); setError(null); setResult(null);
    try { setResult(await getComplaintDetailService(cleanId)); }
    catch { setError(COMPLAINT_TRACKING_STRINGS.NOT_FOUND); }
    finally { setIsLoading(false); }
  };

  return { input, setInput, result, isLoading, error, handleTrack };
}

export function PublicTrackingSection() {
  const t = usePublicTracking();

  return (
    <section id="lacak" className="py-12 md:py-16 bg-muted/40 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <TrackingHeader />
        <TrackingSearchForm input={t.input} onInputChange={t.setInput} onSubmit={t.handleTrack} isLoading={t.isLoading} error={t.error} />
        {t.result && <TrackingResultCard result={t.result} />}
      </div>
    </section>
  );
}
