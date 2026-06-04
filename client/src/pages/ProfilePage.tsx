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
import { Shield, Info } from "lucide-react";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProfileDetailCard from "@/components/profile/ProfileDetailCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_MESSAGES } from "@/lib/constants/messages";




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
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
 <div className="flex items-center gap-4">
 <Avatar className="h-16 w-16 border-2 border-primary/20">
 <AvatarImage
 src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.username}`}
 alt={user.username}
 />
 <AvatarFallback className="text-lg">
 {user.username.substring(0, 2).toUpperCase()}
 </AvatarFallback>
 </Avatar>
 <div>
 <h2 className="text-2xl font-bold tracking-tight">
 {isMasyarakat ? user.nama : user.nama_petugas}
 </h2>
 <div className="flex items-center gap-2 mt-1">
 <p className="text-muted-foreground font-medium">@{user.username}</p>
 <Badge variant={getRoleVariant()}>{getRoleText()}</Badge>
 </div>
 </div>
 </div>
 </div>

 <Tabs defaultValue="info" className="w-full">
 <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
 <TabsTrigger value="info" className="gap-2">
 <Info className="h-4 w-4 hidden sm:block" /> Profil
 </TabsTrigger>
 <TabsTrigger value="security" className="gap-2">
 <Shield className="h-4 w-4 hidden sm:block" /> Keamanan
 </TabsTrigger>
 </TabsList>
 
 <div className="mt-6">
 <TabsContent value="info" className="m-0 space-y-4 focus-visible:outline-none focus-visible:ring-0">
 <ProfileDetailCard user={user} isMasyarakat={isMasyarakat} isPetugas={isPetugas} />
 </TabsContent>

 <TabsContent value="security" className="m-0 space-y-4 focus-visible:outline-none focus-visible:ring-0">
 <Card>
 <CardHeader>
 <CardTitle>{APP_MESSAGES.PROFILE.EDIT_TITLE}</CardTitle>
 <CardDescription>
 Perbarui informasi pribadi Anda.
 </CardDescription>
 </CardHeader>
 <CardContent>
 <ProfileEditForm />
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle>{APP_MESSAGES.PROFILE.EDIT_PASSWORD}</CardTitle>
 <CardDescription>
 Ganti kata sandi secara berkala untuk menjaga keamanan akun Anda.
 </CardDescription>
 </CardHeader>
 <CardContent>
 <PasswordChangeForm />
 </CardContent>
 </Card>
 </TabsContent>
 </div>
 </Tabs>
 </div>
 );
}
