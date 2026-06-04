import { Card, CardContent } from "@/components/ui/card";
import { Phone, User as UserIcon, Fingerprint, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import type { Masyarakat } from "@/types";
import { formatDate } from "@/lib/complaintUtils";

interface CitizenCardsProps {
 masyarakatList: Masyarakat[];
 onDelete?: (nik: string, nama: string) => void;
 onEdit?: (masyarakat: Masyarakat) => void;
}

export default function CitizenCards({
 masyarakatList,
 onDelete,
 onEdit,
}: CitizenCardsProps) {
 return (
 <div className="grid gap-4 md:hidden">
 {masyarakatList.map((m) => (
 <Card key={m.nik}>
 <CardContent className="flex flex-col h-full justify-between">
 <div>
 <div className="mb-2 flex items-start justify-between">
 <span className="text-sm font-semibold flex items-center gap-1">
 <Fingerprint className="h-4 w-4 text-muted-foreground" />
 {m.nik}
 </span>
 </div>
 
 <h3 className="mb-2 break-words text-base font-semibold flex items-center gap-2">
 <UserIcon className="h-4 w-4 text-muted-foreground" />
 {m.nama}
 </h3>
 
 <div className="mb-4 space-y-1 text-xs text-muted-foreground">
 <p>Username: <strong>@{m.username}</strong></p>
 <p className="flex items-center gap-1">
 <Phone className="h-3 w-3" />
 {m.telp}
 </p>
 <p>Terdaftar: {formatDate(m.created_at)}</p>
 </div>
 </div>
 
 {(onDelete || onEdit) && (
 <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t">
 {onEdit && (
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => onEdit(m)}
 className="w-full"
 >
 <Edit className="w-4 h-4 mr-2" />
 Ubah
 </Button>
 )}
 
 {onDelete && (
 <ConfirmationDialog
 title="Anda Yakin?"
 description={`Akun masyarakat dengan nama "${m.nama}" akan dihapus secara permanen.`}
 onConfirm={() => onDelete(m.nik, m.nama)}
 confirmText="Ya, Hapus"
 >
 <Button 
 variant="destructive" 
 size="sm" 
 className="w-full"
 >
 <Trash2 className="w-4 h-4 mr-2" />
 Hapus
 </Button>
 </ConfirmationDialog>
 )}
 </div>
 )}
 </CardContent>
 </Card>
 ))}
 </div>
 );
}
