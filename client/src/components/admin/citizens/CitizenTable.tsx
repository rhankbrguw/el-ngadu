import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import {
 Phone,
 User as UserIcon,
 Fingerprint,
 MoreHorizontal,
 Trash2,
 Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import type { Masyarakat } from "@/types";
import { formatDate } from "@/lib/complaintUtils";
import { APP_MESSAGES } from "@/lib/constants/messages";


interface CitizenTableProps {
 masyarakatList: Masyarakat[];
 onDelete?: (nik: string, nama: string) => void;
 onEdit?: (masyarakat: Masyarakat) => void;
}

export default function CitizenTable({
 masyarakatList,
 onDelete,
 onEdit,
}: CitizenTableProps) {
 return (
 <div className="hidden md:block overflow-x-auto">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="text-center">Nama</TableHead>
 <TableHead className="text-center">Username</TableHead>
 <TableHead className="text-center hidden lg:table-cell text-center">
 NIK
 </TableHead>
 <TableHead className="text-center hidden lg:table-cell text-center">
 Telepon
 </TableHead>
 <TableHead className="text-center">Tanggal Daftar</TableHead>
 {(onDelete || onEdit) && (
 <TableHead className="text-center w-[100px]">Aksi</TableHead>
 )}
 </TableRow>
 </TableHeader>
 <TableBody>
 {masyarakatList.map((m) => (
 <TableRow key={m.nik}>
 <TableCell className="text-center font-medium">
 <div className="inline-flex items-center justify-center gap-1.5">
 <UserIcon className="h-4 w-4 text-muted-foreground" />
 <span>{m.nama}</span>
 </div>
 </TableCell>
 <TableCell className="text-center">{m.username}</TableCell>
 <TableCell className="text-center hidden lg:table-cell text-center">
 <div className="flex items-center justify-center gap-1.5">
 <Fingerprint className="h-4 w-4 text-muted-foreground" />
 {m.nik}
 </div>
 </TableCell>
 <TableCell className="text-center hidden lg:table-cell text-center">
 <div className="flex items-center justify-center gap-1.5">
 <Phone className="h-4 w-4 text-muted-foreground" />
 {m.telp}
 </div>
 </TableCell>
 <TableCell className="text-center">
 {formatDate(m.created_at)}
 </TableCell>
 {(onDelete || onEdit) && (
 <TableCell className="text-center">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" className="h-8 w-8 p-0">
 <MoreHorizontal className="h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 {onEdit && (
 <DropdownMenuItem
 onClick={() => onEdit(m)}
 className="gap-2 cursor-pointer"
 >
 <Edit className="h-4 w-4" />{APP_MESSAGES.COMMON.EDIT}</DropdownMenuItem>
 )}
 {onDelete && (
 <ConfirmationDialog
 title="Anda Yakin?"
 description={`Akun "${m.nama}" akan dihapus permanen.`}
 onConfirm={() => onDelete(m.nik, m.nama)}
 confirmText="Ya, Hapus"
 >
 <DropdownMenuItem
 onSelect={(e) => e.preventDefault()}
 className="text-destructive gap-2 cursor-pointer focus:text-destructive"
 >
 <Trash2 className="h-4 w-4" />{APP_MESSAGES.COMMON.DELETE}</DropdownMenuItem>
 </ConfirmationDialog>
 )}
 </DropdownMenuContent>
 </DropdownMenu>
 </TableCell>
 )}
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 );
}
