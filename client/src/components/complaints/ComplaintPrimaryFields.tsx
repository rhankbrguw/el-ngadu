import type { UseFormReturn } from "react-hook-form";
import type { CreateComplaintValues } from "@/lib/validators/complaints";
import { PENGADUAN_STRINGS, KATEGORI_PENGADUAN } from "@/lib/constants/complaints";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

interface ComplaintPrimaryFieldsProps {
  form: UseFormReturn<CreateComplaintValues>;
  isLoading: boolean;
}

export function ComplaintPrimaryFields({ form, isLoading }: ComplaintPrimaryFieldsProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
      <div className="flex items-center gap-2 pb-1 text-sm font-semibold text-foreground">
        <FileText className="h-4 w-4 text-primary" />
        <span>{PENGADUAN_STRINGS.SECTION_PRIMARY}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="judul"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">{PENGADUAN_STRINGS.LABEL_JUDUL}</FormLabel>
                <FormControl>
                  <Input placeholder={PENGADUAN_STRINGS.PLACEHOLDER_JUDUL} disabled={isLoading} className="bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="kategori"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium">{PENGADUAN_STRINGS.LABEL_KATEGORI}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={PENGADUAN_STRINGS.PLACEHOLDER_KATEGORI} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {KATEGORI_PENGADUAN.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="isi"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-medium">{PENGADUAN_STRINGS.LABEL_ISI}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={PENGADUAN_STRINGS.PLACEHOLDER_ISI}
                disabled={isLoading}
                rows={4}
                className="bg-background resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
