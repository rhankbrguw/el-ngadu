import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { toast } from "sonner";

export function NotificationSettings() {
 const [emailNotif, setEmailNotif] = useState(true);
 const [pushNotif, setPushNotif] = useState(false);

 useEffect(() => {
 setEmailNotif(localStorage.getItem("elngadu_email_notif") !== "false");
 setPushNotif(localStorage.getItem("elngadu_push_notif") === "true");
 }, []);

 const handleEmailChange = (checked: boolean) => {
 setEmailNotif(checked);
 localStorage.setItem("elngadu_email_notif", String(checked));
 toast.success("Pengaturan Email disimpan.");
 };

 const handlePushChange = async (checked: boolean) => {
 if (checked) {
 if (!("Notification" in window)) {
 toast.error("Browser tidak mendukung Web Push Notifications.");
 return;
 }
 const permission = await Notification.requestPermission();
 if (permission === "granted") {
 setPushNotif(true);
 localStorage.setItem("elngadu_push_notif", "true");
 new Notification("El-Ngadu", { body: "Push Notifikasi aktif!" });
 toast.success("Push Notifications diaktifkan.");
 } else {
 toast.error("Izin Push Notifications ditolak oleh browser.");
 }
 } else {
 setPushNotif(false);
 localStorage.setItem("elngadu_push_notif", "false");
 toast.success("Push Notifications dinonaktifkan.");
 }
 };

 return (
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Bell className="h-5 w-5" /> Notifikasi
 </CardTitle>
 <CardDescription>Pilih preferensi pemberitahuan Anda.</CardDescription>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="flex items-center justify-between space-x-2">
 <div className="flex flex-col space-y-1">
 <Label htmlFor="email-notifications">Notifikasi Email</Label>
 <span className="text-sm text-muted-foreground">
 Terima pembaruan via email.
 </span>
 </div>
 <Switch id="email-notifications" checked={emailNotif} onCheckedChange={handleEmailChange} />
 </div>
 <div className="flex items-center justify-between space-x-2">
 <div className="flex flex-col space-y-1">
 <Label htmlFor="push-notifications">Push Notifications</Label>
 <span className="text-sm text-muted-foreground">
 Terima pemberitahuan langsung di peramban web Anda.
 </span>
 </div>
 <Switch id="push-notifications" checked={pushNotif} onCheckedChange={handlePushChange} />
 </div>
 </CardContent>
 </Card>
 );
}
