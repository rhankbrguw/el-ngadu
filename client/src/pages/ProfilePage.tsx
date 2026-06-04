import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Phone, ShieldCheck, Fingerprint } from "lucide-react";
import PasswordChangeDialog from "@/components/profile/PasswordChangeDialog";
import ProfileEditDialog from "@/components/profile/ProfileEditDialog";

const ProfileeDetailRow = ({
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

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center p-12">
        <p>Data pengguna tidak ditemukan.</p>
      </div>
    );
  }

  const isMasyarakat = user.userType === "masyarakat";
  const isPetugas = user.userType === "petugas";

  const getRoleVariant = () => {
    if (!user) return "secondary";
    if (user.userType === "petugas" && user.level === "admin") return "default";
    if (user.userType === "petugas") return "secondary";
    return "outline";
  };

  const getRoleText = () => {
    if (!user) return "Pengguna";
    if (user.userType === "petugas" && user.level === "admin")
      return "Administrator";
    if (user.userType === "petugas") return "Petugas";
    return "Masyarakat";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-16 border">
            <AvatarImage
              src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.username}`}
              alt={user.username}
            />
            <AvatarFallback>
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {isMasyarakat ? user.nama : user.nama_petugas}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">@{user.username}</p>
              <Badge variant={getRoleVariant()}>{getRoleText()}</Badge>
            </div>
          </div>
        </div>
        <ProfileEditDialog /> {/* Tambahkan tombol/dialog edit di sini */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Profile</CardTitle>
          <CardDescription>
            Informasi akun Anda yang terdaftar dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProfileeDetailRow
            icon={<User className="h-5 w-5" />}
            label="Nama Lengkap"
            value={isMasyarakat ? user.nama : user.nama_petugas}
          />
          <ProfileeDetailRow
            icon={<Phone className="h-5 w-5" />}
            label="Nomor Telepon"
            value={user.telp}
          />

          {isMasyarakat && (
            <ProfileeDetailRow
              icon={<Fingerprint className="h-5 w-5" />}
              label="NIK"
              value={user.nik}
            />
          )}

          {isPetugas && (
            <ProfileeDetailRow
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Level"
              value={user.level.charAt(0).toUpperCase() + user.level.slice(1)}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan</CardTitle>
          <CardDescription>
            Ubah kata sandi Anda secara berkala untuk menjaga keamanan akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeDialog />
        </CardContent>
      </Card>
    </div>
  );
}
