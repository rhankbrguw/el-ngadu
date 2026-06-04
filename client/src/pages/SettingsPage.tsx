import {
 Tabs,
 TabsContent,
 TabsList,
 TabsTrigger,
} from "@/components/ui/tabs";
import { Settings, Bell, Palette } from "lucide-react";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";

export default function SettingsPage() {
 return (
 <div className="space-y-4 p-4 sm:p-5">
 <div className="flex items-center gap-4">
 <div className="bg-primary/10 p-2 rounded-lg">
 <Settings className="h-6 w-6 text-primary flex-shrink-0" />
 </div>
 <div>
 <h2 className="text-xl font-bold tracking-tight">Pengaturan</h2>
 <p className="text-sm text-muted-foreground">
 Kelola profil dan preferensi tampilan Anda.
 </p>
 </div>
 </div>

 <Tabs defaultValue="theme" className="w-full">
 <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
 <TabsTrigger value="theme" className="gap-2">
 <Palette className="h-4 w-4 hidden sm:block" /> Tampilan
 </TabsTrigger>
 <TabsTrigger value="notifications" className="gap-2">
 <Bell className="h-4 w-4 hidden sm:block" /> Notifikasi
 </TabsTrigger>
 </TabsList>
 
 <div className="mt-4">
 <TabsContent value="theme" className="m-0 focus-visible:outline-none focus-visible:ring-0">
 <ThemeSettings />
 </TabsContent>
 <TabsContent value="notifications" className="m-0 focus-visible:outline-none focus-visible:ring-0">
 <NotificationSettings />
 </TabsContent>
 </div>
 </Tabs>
 </div>
 );
}
