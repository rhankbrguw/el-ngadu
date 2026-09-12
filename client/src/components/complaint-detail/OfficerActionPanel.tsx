import type { PengaduanDetail } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit, Send, Sparkles } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { CANNED_RESPONSES } from "@/lib/constants/complaints";

interface OfficerActionPanelProps {
  pengaduan: PengaduanDetail;
  isSubmitting: boolean;
  isiResponse: string;
  onStatusChange: (newStatus: "diproses" | "selesai") => void;
  onResponseSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onIsiResponseChange: (value: string) => void;
}

export function OfficerActionPanel({
  pengaduan,
  isSubmitting,
  isiResponse,
  onStatusChange,
  onResponseSubmit,
  onIsiResponseChange,
}: OfficerActionPanelProps) {
  if (pengaduan.status === "diajukan") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Edit className="h-4 w-4" /> Tindak Lanjuti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => onStatusChange("diproses")} disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Proses Laporan Ini"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (pengaduan.status === "diproses" && !pengaduan.tanggapan) {
    return (
      <Card>
        <form onSubmit={onResponseSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Send className="h-4 w-4" /> Berikan Tanggapan Akhir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" /> Template Respon Cepat:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CANNED_RESPONSES.map((tmpl) => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => onIsiResponseChange(tmpl)}
                    className="text-[11px] text-left rounded border bg-muted/50 px-2 py-1 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground line-clamp-1 max-w-full"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder={APP_MESSAGES.COMPLAINT.PLACEHOLDER_ACTION}
              rows={4}
              value={isiResponse}
              onChange={(e) => onIsiResponseChange(e.target.value)}
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || !isiResponse.trim()} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Beri Tanggapan & Selesaikan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return null;
}
