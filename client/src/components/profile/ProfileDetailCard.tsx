import type { User, Masyarakat, Petugas } from "@/types";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { User as UserIcon, Phone, ShieldCheck, Fingerprint, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const ProfilDetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="flex items-center">
    <div className="w-8 mr-4 text-muted-foreground">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  </div>
);

export default function ProfileDetailCard({
  user,
  isMasyarakat,
  isPetugas,
}: {
  user: User | null;
  isMasyarakat: boolean;
  isPetugas: boolean;
}) {
  if (!user) return null;
  const masyarakat = isMasyarakat ? (user as Masyarakat) : null;
  const petugas = isPetugas ? (user as Petugas) : null;
  const name = isMasyarakat ? masyarakat?.nama : petugas?.nama_petugas;
  const levelStr = petugas?.level ? petugas.level.charAt(0).toUpperCase() + petugas.level.slice(1) : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{APP_MESSAGES.PROFILE.DETAIL}</CardTitle>
        <CardDescription>
          Informasi akun Anda yang terdaftar dalam sistem.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfilDetailRow icon={<UserIcon className="h-5 w-5" />} label="Nama Lengkap" value={name} />
        <ProfilDetailRow icon={<Phone className="h-5 w-5" />} label="Nomor Telepon" value={user.telp} />
        <ProfilDetailRow icon={<Mail className="h-5 w-5" />} label="Email" value={user.email || "Belum diatur"} />
        {masyarakat && <ProfilDetailRow icon={<Fingerprint className="h-5 w-5" />} label="NIK" value={masyarakat.nik} />}
        {petugas && <ProfilDetailRow icon={<ShieldCheck className="h-5 w-5" />} label="Level" value={levelStr} />}
      </CardContent>
    </Card>
  );
}
