import type { PengaduanWithPelapor } from "@/types";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ComplaintAction from "./ComplaintAction";
import {
 getStatusVariant,
 formatDate,
 formatStatus,
} from "@/lib/complaintUtils";

interface ComplaintTableProps {
 pengaduanList: PengaduanWithPelapor[];
}

export default function ComplaintTable({ pengaduanList }: ComplaintTableProps) {
 return (
 <div className="overflow-x-auto">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="text-center w-[80px]">ID</TableHead>
 <TableHead className="text-center">{APP_MESSAGES.COMPLAINT.TITLE}</TableHead>
 <TableHead className="text-center hidden md:table-cell w-[200px]">
 Pelapor
 </TableHead>
 <TableHead className="text-center w-[120px] text-center">{APP_MESSAGES.COMPLAINT.STATUS}</TableHead>
 <TableHead className="text-center hidden lg:table-cell w-[150px]">
 Tanggal
 </TableHead>
 <TableHead className="text-center w-[180px] text-center">{APP_MESSAGES.COMMON.ACTION}</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {pengaduanList.map((item) => (
 <TableRow key={item.id}>
 <TableCell className="text-center font-medium">#{item.id}</TableCell>
 <TableCell className="text-center truncate font-medium">
 {item.judul}
 </TableCell>
 <TableCell className="text-center hidden md:table-cell truncate">
 {item.nama_pelapor}
 </TableCell>
 <TableCell className="text-center">
 <Badge variant={getStatusVariant(item.status)}>
 {formatStatus(item.status)}
 </Badge>
 </TableCell>
 <TableCell className="text-center hidden lg:table-cell">
 {formatDate(item.created_at)}
 </TableCell>
 <TableCell className="text-center">
 <ComplaintAction id={item.id} />
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 );
}
