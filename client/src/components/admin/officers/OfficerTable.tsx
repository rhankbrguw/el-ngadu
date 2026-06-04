import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, Shield, User as UserIcon, Mail } from "lucide-react";
import type { Petugas } from "@/types";
import OfficerActionDropdown from "./OfficerActionDropdown";
import { getLevelVariant, formatLevel } from "@/lib/officerUtils";

interface OfficerTableProps {
 petugasList: Petugas[];
 onEdit?: (petugas: Petugas) => void;
 onDelete?: (id: number) => void;
}

export default function OfficerTable({
 petugasList,
 onEdit,
 onDelete,
}: OfficerTableProps) {
 return (
 <div className="hidden md:block overflow-x-auto">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="text-center">Nama Petugas</TableHead>
 <TableHead className="text-center">Username</TableHead>
 <TableHead className="text-center">Email</TableHead>
 <TableHead className="text-center">Telepon</TableHead>
 <TableHead className="text-center">Level</TableHead>
 {onEdit && onDelete && (
 <TableHead className="text-center w-[100px]">Aksi</TableHead>
 )}
 </TableRow>
 </TableHeader>
 <TableBody>
 {petugasList.map((petugas) => (
 <TableRow key={petugas.id_petugas}>
 <TableCell className="text-center font-medium">
 <div className="inline-flex items-center justify-center gap-1.5">
 <UserIcon className="h-4 w-4 text-muted-foreground" />
 {petugas.nama_petugas}
 </div>
 </TableCell>
 <TableCell className="text-center">{petugas.username}</TableCell>
 <TableCell className="text-center">
 <div className="inline-flex items-center justify-center gap-1.5">
 <Mail className="h-4 w-4 text-muted-foreground" />
 {petugas.email || "-"}
 </div>
 </TableCell>
 <TableCell className="text-center">
 <div className="inline-flex items-center justify-center gap-1.5">
 <Phone className="h-4 w-4 text-muted-foreground" />
 {petugas.telp}
 </div>
 </TableCell>
 <TableCell className="text-center">
 <div className="inline-flex items-center justify-center">
 <Badge
 variant={getLevelVariant(petugas.level)}
 className="gap-1"
 >
 <Shield className="h-3 w-3" />
 {formatLevel(petugas.level)}
 </Badge>
 </div>
 </TableCell>
 {onEdit && onDelete && (
 <TableCell className="text-center">
 <OfficerActionDropdown
 petugas={petugas}
 onEdit={onEdit}
 onDelete={onDelete}
 />
 </TableCell>
 )}
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 );
}
