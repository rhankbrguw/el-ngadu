import type { PengaduanDetail } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MapPin, Tag } from "lucide-react";
import {
 getStatusVariant,
 formatDate,
 formatStatus,
} from "@/lib/complaintUtils";

interface ComplaintInfoCardProps {
 pengaduan: PengaduanDetail;
}

export function ComplaintInfoCard({ pengaduan }: ComplaintInfoCardProps) {
 return (
 <Card>
 <CardHeader>
 <Badge
 variant={getStatusVariant(pengaduan.status)}
 className="w-fit mb-2"
 >
 {formatStatus(pengaduan.status)}
 </Badge>
 <CardTitle className="text-xl">{pengaduan.judul}</CardTitle>
 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-1">
 <div className="flex items-center gap-1.5">
 <User className="h-4 w-4" />
 <span>{pengaduan.nama_pelapor}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <Calendar className="h-4 w-4" />
 <span>{formatDate(pengaduan.created_at)}</span>
 </div>
 {pengaduan.kategori && (
 <div className="flex items-center gap-1.5">
 <Tag className="h-4 w-4" />
 <span>{pengaduan.kategori}</span>
 </div>
 )}
 {pengaduan.lokasi && (
 <div className="flex items-center gap-1.5">
 <MapPin className="h-4 w-4" />
 <span>{pengaduan.lokasi}</span>
 </div>
 )}
 </div>
 </CardHeader>
 <CardContent>
 <div className="bg-muted/30 p-4 rounded-md border border-border/50">
 <p className="whitespace-pre-wrap leading-relaxed">{pengaduan.isi}</p>
 </div>
 </CardContent>
 </Card>
 );
}
