import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, FileCheck2 } from "lucide-react";
import { formatDate } from "@/lib/complaintUtils";
import type { PengaduanDetail } from "@/types";

interface ComplaintStatusStepperProps {
  pengaduan: PengaduanDetail;
}

interface StepItem {
  key: string;
  label: string;
  desc: string;
  date?: string | null;
  icon: typeof FileCheck2;
}

export function ComplaintStatusStepper({ pengaduan }: ComplaintStatusStepperProps) {
  const isDiproses = pengaduan.status === "diproses" || pengaduan.status === "selesai";
  const isSelesai = pengaduan.status === "selesai";

  const steps: StepItem[] = [
    {
      key: "diajukan",
      label: "Laporan Diajukan",
      desc: "Laporan masuk ke sistem",
      date: formatDate(pengaduan.created_at),
      icon: FileCheck2,
    },
    {
      key: "diproses",
      label: "Sedang Ditindaklanjuti",
      desc: isDiproses ? "Dinas terkait memverifikasi" : "Menunggu tindak lanjut",
      date: isDiproses ? "Dalam proses" : null,
      icon: Clock,
    },
    {
      key: "selesai",
      label: "Selesai Ditanggapi",
      desc: isSelesai ? "Solusi telah diberikan" : "Menunggu penyelesaian",
      date: pengaduan.tanggapan ? formatDate(pengaduan.tanggapan.tgl_tanggapan) : null,
      icon: CheckCircle2,
    },
  ];

  const getStepStatus = (index: number) => {
    if (index === 0) return true;
    if (index === 1) return isDiproses;
    return isSelesai;
  };

  return (
    <Card className="border shadow-xs">
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = getStepStatus(idx);
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isCompleted
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Tahap 0{idx + 1}</p>
                  <h4 className="text-sm font-semibold text-foreground truncate">{step.label}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  {step.date && (
                    <span className="inline-block mt-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {step.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
