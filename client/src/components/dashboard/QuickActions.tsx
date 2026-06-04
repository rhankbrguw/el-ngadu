import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, History, HelpCircle, Users, ShieldPlus } from "lucide-react";
import type { User } from "@/types";

export function QuickActions({ user }: { user: User }) {
  if (user.userType === "masyarakat") {
    return (
      <Card className="mt-6 border-primary/10 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            Aksi Cepat
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Button asChild className="w-full justify-start gap-2 h-12" variant="secondary">
            <Link to="/dashboard/create-complaint">
              <PlusCircle className="h-5 w-5" /> Buat Pengaduan
            </Link>
          </Button>
          <Button asChild className="w-full justify-start gap-2 h-12" variant="outline">
            <Link to="/dashboard/history">
              <History className="h-5 w-5" /> Riwayat Laporan
            </Link>
          </Button>
          <Button asChild className="w-full justify-start gap-2 h-12" variant="outline">
            <Link to="/dashboard/help">
              <HelpCircle className="h-5 w-5" /> Panduan
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 border-primary/10 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Pintasan Menu
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Button asChild className="w-full justify-start gap-2 h-12" variant="default">
          <Link to="/dashboard/manage-complaints">
            <FileText className="h-5 w-5" /> Proses Pengaduan
          </Link>
        </Button>
        <Button asChild className="w-full justify-start gap-2 h-12" variant="secondary">
          <Link to="/dashboard/reports">
            <FileText className="h-5 w-5" /> Cetak Laporan PDF
          </Link>
        </Button>
        {user.level === "admin" && (
          <Button asChild className="w-full justify-start gap-2 h-12" variant="outline">
            <Link to="/dashboard/manage-officers">
              <ShieldPlus className="h-5 w-5" /> Kelola Petugas
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
