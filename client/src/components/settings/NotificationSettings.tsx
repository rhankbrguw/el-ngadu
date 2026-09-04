import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { APP_MESSAGES } from "@/lib/constants/messages";

async function requestPushNotification(): Promise<boolean> {
  if (!("Notification" in window)) {
    toast.error(APP_MESSAGES.TOAST_MESSAGES.BROWSER_NO_PUSH);
    return false;
  }
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    localStorage.setItem("elngadu_push_notif", "true");
    new Notification("El-Ngadu", { body: "Push Notifikasi aktif!" });
    toast.success(APP_MESSAGES.TOAST_MESSAGES.PUSH_ENABLED);
    return true;
  }
  toast.error(APP_MESSAGES.TOAST_MESSAGES.PUSH_DENIED);
  return false;
}

function useNotificationPreferences() {
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
    if (!checked) {
      setIsPushNotifEnabled(false);
      localStorage.setItem("elngadu_push_notif", "false");
      toast.success(APP_MESSAGES.TOAST_MESSAGES.PUSH_DISABLED);
      return;
    }
    const granted = await requestPushNotification();
    setIsPushNotifEnabled(granted);
  };

  return { isEmailNotifEnabled, isPushNotifEnabled, handleEmailChange, handlePushChange };
}


interface ToggleItemProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const ToggleItem = ({ id, label, description, checked, onCheckedChange }: ToggleItemProps) => (
  <div className="flex items-center justify-between space-x-2">
    <div className="flex flex-col space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <span className="text-sm text-muted-foreground">{description}</span>
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

export function NotificationSettings() {
  const { isEmailNotifEnabled, isPushNotifEnabled, handleEmailChange, handlePushChange } = useNotificationPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifikasi</CardTitle>
        <CardDescription>Pilih preferensi pemberitahuan Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ToggleItem id="email-notifications" label="Notifikasi Email" description="Terima pembaruan via email." checked={isEmailNotifEnabled} onCheckedChange={handleEmailChange} />
        <ToggleItem id="push-notifications" label="Push Notifications" description="Terima pemberitahuan langsung di peramban web Anda." checked={isPushNotifEnabled} onCheckedChange={handlePushChange} />
      </CardContent>
    </Card>
  );
}

