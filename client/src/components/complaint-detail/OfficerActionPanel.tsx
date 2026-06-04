import type { PengaduanDetail } from "@/types";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit, Send } from "lucide-react";

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
 <Button
 onClick={() => onStatusChange("diproses")}
 disabled={isSubmitting}
 className="w-full"
 >
 {isSubmitting ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 "Proses Laporan Ini"
 )}
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
 <CardContent>
 <Textarea
 placeholder="Tulis solusi atau tindakan yang telah diambil..."
 rows={5}
 value={isiResponse}
 onChange={(e) => onIsiResponseChange(e.target.value)}
 disabled={isSubmitting}
 />
 </CardContent>
 <CardFooter>
 <Button
 type="submit"
 disabled={isSubmitting || !isiResponse.trim()}
 className="w-full"
 >
 {isSubmitting ? (
 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
 ) : (
 "Beri Tanggapan & Selesaikan"
 )}
 </Button>
 </CardFooter>
 </form>
 </Card>
 );
 }

 return null;
}
