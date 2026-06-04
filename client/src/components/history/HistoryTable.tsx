import type { Pengaduan } from "@/types";
import { Link } from "react-router-dom";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
 getStatusVariant,
 formatDate,
 formatStatus,
} from "@/lib/complaintUtils";

interface HistoryTableProps {
 riwayatList: Pengaduan[];
}

export function HistoryTable({ riwayatList }: HistoryTableProps) {
 return (
 <div className="rounded-lg border">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="text-center w-16 text-center">ID</TableHead>
 <TableHead className="text-center">Judul Pengaduan</TableHead>
 <TableHead className="text-center w-32 text-center">Status</TableHead>
 <TableHead className="text-center w-40 text-center">Tanggal</TableHead>
 <TableHead className="text-center w-32 text-center">Aksi</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {riwayatList.map((item) => (
 <TableRow key={item.id}>
 <TableCell className="text-center font-mono text-sm text-muted-foreground">
 #{item.id}
 </TableCell>
 <TableCell className="text-center font-medium">{item.judul}</TableCell>
 <TableCell className="text-center">
 <Badge variant={getStatusVariant(item.status)}>
 {formatStatus(item.status)}
 </Badge>
 </TableCell>
 <TableCell className="text-center text-muted-foreground">
 {formatDate(item.created_at)}
 </TableCell>
 <TableCell className="text-center">
 <Button asChild variant="outline" size="sm">
 <Link to={`/dashboard/history/${item.id}`}>
 <Eye className="w-4 h-4 mr-2" />
 Detail
 </Link>
 </Button>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 );
}
