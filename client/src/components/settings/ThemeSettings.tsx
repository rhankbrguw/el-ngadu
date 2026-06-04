import { useTheme } from "@/hooks/useTheme";
import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette } from "lucide-react";

export function ThemeSettings() {
 const { theme, setTheme } = useTheme();

 return (
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Palette className="h-5 w-5" /> Tampilan Aplikasi
 </CardTitle>
 <CardDescription>
 Pilih tema warna untuk antarmuka. Pilihan "Sistem" akan mengikuti pengaturan OS Anda.
 </CardDescription>
 </CardHeader>
 <CardContent>
 <RadioGroup
 value={theme}
 onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
 className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
 >
 <div>
 <RadioGroupItem value="light" id="light" className="peer sr-only" />
 <Label
 htmlFor="light"
 className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
 >
 <div className="mb-2 h-10 w-full rounded-lg bg-muted"></div>
 Terang
 </Label>
 </div>
 <div>
 <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
 <Label
 htmlFor="dark"
 className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
 >
 <div className="mb-2 h-10 w-full rounded-lg bg-muted"></div>
 Gelap
 </Label>
 </div>
 <div>
 <RadioGroupItem value="system" id="system" className="peer sr-only" />
 <Label
 htmlFor="system"
 className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
 >
 <div className="mb-2 h-10 w-full rounded-lg bg-gradient-to-r from-muted to-foreground"></div>
 Ikuti Sistem
 </Label>
 </div>
 </RadioGroup>
 </CardContent>
 </Card>
 );
}
