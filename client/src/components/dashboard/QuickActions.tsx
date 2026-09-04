import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, History, HelpCircle, ShieldPlus } from "lucide-react";
import type { User } from "@/types";

const MasyarakatQuickActions = () => (
  <Card className="border-border/70 bg-card shadow-xs">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-bold flex items-center gap-2">Aksi Cepat</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-3 sm:grid-cols-3">
      <Button asChild className="w-full justify-start gap-2 h-11" variant="default">
        <Link to="/dashboard/create-complaint"><PlusCircle className="h-4 w-4" /> Buat Pengaduan</Link>
      </Button>
      <Button asChild className="w-full justify-start gap-2 h-11" variant="outline">
        <Link to="/dashboard/history"><History className="h-4 w-4" /> Riwayat Laporan</Link>
      </Button>
      <Button asChild className="w-full justify-start gap-2 h-11" variant="outline">
        <Link to="/dashboard/help"><HelpCircle className="h-4 w-4" /> Panduan</Link>
      </Button>
    </CardContent>
  </Card>
);

const PetugasQuickActions = ({ level }: { level?: string }) => (
  <Card className="border-border/70 bg-card shadow-xs">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-bold flex items-center gap-2">Pintasan Menu</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-3 sm:grid-cols-3">
      <Button asChild className="w-full justify-start gap-2 h-11" variant="default">
        <Link to="/dashboard/manage-complaints"><FileText className="h-4 w-4" /> Proses Pengaduan</Link>
      </Button>
      <Button asChild className="w-full justify-start gap-2 h-11" variant="outline">
        <Link to="/dashboard/reports"><FileText className="h-4 w-4" /> Cetak Laporan PDF</Link>
      </Button>
      {level === "admin" && (
        <Button asChild className="w-full justify-start gap-2 h-11" variant="outline">
          <Link to="/dashboard/manage-officers"><ShieldPlus className="h-4 w-4" /> Kelola Petugas</Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

export function QuickActions({ user }: { user: User }) {
  if (user.userType === "masyarakat") {
    return <MasyarakatQuickActions />;
  }
  return <PetugasQuickActions level={user.level} />;
}

