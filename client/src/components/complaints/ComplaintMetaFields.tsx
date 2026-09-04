import type { UseFormReturn } from "react-hook-form";
import type { CreateComplaintValues } from "@/lib/validators/complaints";
import { PENGADUAN_STRINGS, PRIORITAS_PENGADUAN } from "@/lib/constants/complaints";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, ShieldAlert, UserCheck } from "lucide-react";

interface ComplaintMetaFieldsProps {
  form: UseFormReturn<CreateComplaintValues>;
  isLoading: boolean;
}

export function ComplaintMetaFields({ form, isLoading }: ComplaintMetaFieldsProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField control={form.control} name="tanggal_kejadian" render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{PENGADUAN_STRINGS.LABEL_TANGGAL_KEJADIAN}</span>
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                disabled={isLoading}
                className="bg-background"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="prioritas" render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <ShieldAlert className="h-3.5 w-3.5 text-primary" />
              <span>{PENGADUAN_STRINGS.LABEL_PRIORITAS}</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
              <FormControl>
                <SelectTrigger className="w-full bg-background"><SelectValue /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {PRIORITAS_PENGADUAN.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <FormField control={form.control} name="is_anonim" render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border/60 bg-background p-3">
          <FormControl>
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-primary cursor-pointer"
            />
          </FormControl>
          <div className="space-y-0.5 leading-none">
            <FormLabel className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <UserCheck className="h-3.5 w-3.5 text-secondary" />
              <span>{PENGADUAN_STRINGS.LABEL_ANONIM}</span>
            </FormLabel>
            <FormDescription className="text-xs text-muted-foreground">
              {PENGADUAN_STRINGS.DESC_ANONIM}
            </FormDescription>
          </div>
        </FormItem>
      )} />
    </div>
  );
}
