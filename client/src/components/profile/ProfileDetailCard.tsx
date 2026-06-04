import { User, Phone, ShieldCheck, Fingerprint, Mail } from "lucide-react";
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

export default function ProfileDetailCard({ user, isMasyarakat, isPetugas }: { user: Record<string, unknown> | null, isMasyarakat: boolean, isPetugas: boolean }) {
 return (
 <Card>
 <CardHeader>
 <CardTitle>Detail Profil</CardTitle>
 <CardDescription>
 Informasi akun Anda yang terdaftar dalam sistem.
 </CardDescription>
 </CardHeader>
 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <ProfilDetailRow
 icon={<User className="h-5 w-5" />}
 label="Nama Lengkap"
 value={isMasyarakat ? user.nama : user.nama_petugas}
 />
 <ProfilDetailRow
 icon={<Phone className="h-5 w-5" />}
 label="Nomor Telepon"
 value={user.telp}
 />
 <ProfilDetailRow
 icon={<Mail className="h-5 w-5" />}
 label="Email"
 value={user.email || "Belum diatur"}
 />
 {isMasyarakat && (
 <ProfilDetailRow
 icon={<Fingerprint className="h-5 w-5" />}
 label="NIK"
 value={user.nik}
 />
 )}
 {isPetugas && (
 <ProfilDetailRow
 icon={<ShieldCheck className="h-5 w-5" />}
 label="Level"
 value={user.level.charAt(0).toUpperCase() + user.level.slice(1)}
 />
 )}
 </CardContent>
 </Card>
 );
}
