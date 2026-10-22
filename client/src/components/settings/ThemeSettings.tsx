import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette } from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeOptionProps {
  value: ThemeMode;
  label: string;
  previewClass?: string;
}

const THEME_OPTIONS: ThemeOptionProps[] = [
  { value: "light", label: "Terang", previewClass: "bg-muted" },
  { value: "dark", label: "Gelap", previewClass: "bg-muted" },
  { value: "system", label: "Ikuti Sistem", previewClass: "bg-gradient-to-r from-muted to-foreground" },
];

const ThemeOptionItem = ({ value, label, previewClass }: ThemeOptionProps) => (
  <div>
    <RadioGroupItem value={value} id={value} className="peer sr-only" />
    <Label
      htmlFor={value}
      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
    >
      <div className={`mb-2 h-10 w-full rounded-lg ${previewClass}`} />
      {label}
    </Label>
  </div>
);

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Tampilan Aplikasi</CardTitle>
        <CardDescription>Pilih tema warna untuk antarmuka. Pilihan "Sistem" akan mengikuti pengaturan OS Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={theme} onValueChange={(val) => setTheme(val as ThemeMode)} className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {THEME_OPTIONS.map((opt) => <ThemeOptionItem key={opt.value} {...opt} />)}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

