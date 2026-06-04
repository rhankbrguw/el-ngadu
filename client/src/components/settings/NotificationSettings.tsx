import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" /> Notifikasi
        </CardTitle>
        <CardDescription>
          Pilih preferensi pemberitahuan Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="email-notifications">Notifikasi Email</Label>
            <span className="text-sm text-muted-foreground">
              Terima pembaruan tentang status pengaduan Anda via email.
            </span>
          </div>
          <Switch id="email-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <span className="text-sm text-muted-foreground">
              Terima pemberitahuan langsung di peramban web Anda.
            </span>
          </div>
          <Switch id="push-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="marketing-emails">Email Pemasaran & Tips</Label>
            <span className="text-sm text-muted-foreground">
              Terima email promosi, tips penggunaan, dan penawaran khusus.
            </span>
          </div>
          <Switch id="marketing-emails" />
        </div>
      </CardContent>
    </Card>
  );
}
