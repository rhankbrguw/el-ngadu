import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Shield, User as UserIcon, Edit, Trash2, Mail } from "lucide-react";
import type { Petugas } from "@/types";
import { getLevelVariant, formatLevel } from "@/lib/officerUtils";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { APP_MESSAGES } from "@/lib/constants/messages";


interface OfficerCardsProps {
 petugasList: Petugas[];
 onEdit?: (petugas: Petugas) => void;
 onDelete?: (id: number) => void;
}

export default function OfficerCards({
 petugasList,
 onEdit,
 onDelete,
}: OfficerCardsProps) {
 return (
 <div className="grid gap-4 md:hidden">
 {petugasList.map((petugas) => (
 <Card key={petugas.id_petugas}>
 <CardContent className="flex flex-col h-full justify-between">
 <div>
 <div className="mb-2 flex items-start justify-between">
 <span className="text-sm font-semibold">#{petugas.id_petugas}</span>
 <Badge variant={getLevelVariant(petugas.level)} className="gap-1">
 <Shield className="h-3 w-3" />
 {formatLevel(petugas.level)}
 </Badge>
 </div>
 
 <h3 className="mb-2 break-words text-base font-semibold flex items-center gap-2">
 <UserIcon className="h-4 w-4 text-muted-foreground" />
 {petugas.nama_petugas}
 </h3>
 
 <div className="mb-4 space-y-1 text-xs text-muted-foreground">
 <p>Username: <strong>@{petugas.username}</strong></p>
 <p className="flex items-center gap-1">
 <Mail className="h-3 w-3" />
 {petugas.email || "-"}
 </p>
 <p className="flex items-center gap-1">
 <Phone className="h-3 w-3" />
 {petugas.telp}
 </p>
 </div>
 </div>
 
 {onEdit && onDelete && (
 <div className="grid grid-cols-2 gap-2 mt-auto">
 <Button 
 variant="outline" 
 size="sm" 
 onClick={() => onEdit(petugas)}
 className="w-full"
 >
 <Edit className="w-4 h-4 mr-2" />{APP_MESSAGES.COMMON.EDIT}</Button>
 
 <ConfirmationDialog
 title={APP_MESSAGES.COMMON.ARE_YOU_SURE}
 description={`Akun petugas dengan nama "${petugas.nama_petugas}" akan dihapus secara permanen.`}
 onConfirm={() => onDelete(petugas.id_petugas)}
 confirmText="Ya, Hapus"
 >
 <Button 
 variant="destructive" 
 size="sm" 
 className="w-full"
 >
 <Trash2 className="w-4 h-4 mr-2" />{APP_MESSAGES.COMMON.DELETE}</Button>
 </ConfirmationDialog>
 </div>
 )}
 </CardContent>
 </Card>
 ))}
 </div>
 );
}
