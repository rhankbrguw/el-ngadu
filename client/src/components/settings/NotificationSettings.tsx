import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { APP_MESSAGES } from "@/lib/constants/messages";

export function NotificationSettings() {
 const [isEmailNotifEnabled, setIsEmailNotifEnabled] = useState(true);
 const [isPushNotifEnabled, setIsPushNotifEnabled] = useState(false);

 useEffect(() => {
 setIsEmailNotifEnabled(localStorage.getItem("elngadu_email_notif") !== "false");
 setIsPushNotifEnabled(localStorage.getItem("elngadu_push_notif") === "true");
 }, []);

 const handleEmailChange = (checked: boolean) => {
 setIsEmailNotifEnabled(checked);
 localStorage.setItem("elngadu_email_notif", String(checked));
 toast.success(APP_MESSAGES.TOAST_MESSAGES.EMAIL_SETTINGS_SAVED);
 };

 const handlePushChange = async (checked: boolean) => {
 if (checked) {
 if (!("Notification" in window)) {
 toast.error(APP_MESSAGES.TOAST_MESSAGES.BROWSER_NO_PUSH);
 return;
 }
 const permission = await Notification.requestPermission();
 if (permission === "granted") {
 setIsPushNotifEnabled(true);
 localStorage.setItem("elngadu_push_notif", "true");
 new Notification("El-Ngadu", { body: "Push Notifikasi aktif!" });
 toast.success(APP_MESSAGES.TOAST_MESSAGES.PUSH_ENABLED);
 } else {
 toast.error(APP_MESSAGES.TOAST_MESSAGES.PUSH_DENIED);
 }
 } else {
 setIsPushNotifEnabled(false);
 localStorage.setItem("elngadu_push_notif", "false");
 toast.success(APP_MESSAGES.TOAST_MESSAGES.PUSH_DISABLED);
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
 <Switch id="email-notifications" checked={isEmailNotifEnabled} onCheckedChange={handleEmailChange} />
 </div>
 <div className="flex items-center justify-between space-x-2">
 <div className="flex flex-col space-y-1">
 <Label htmlFor="push-notifications">Push Notifications</Label>
 <span className="text-sm text-muted-foreground">
 Terima pemberitahuan langsung di peramban web Anda.
 </span>
 </div>
 <Switch id="push-notifications" checked={isPushNotifEnabled} onCheckedChange={handlePushChange} />
 </div>
 </CardContent>
 </Card>
 );
}
