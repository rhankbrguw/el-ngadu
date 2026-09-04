import { useState, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CreateComplaintValues } from "@/lib/validators/complaints";
import { PENGADUAN_STRINGS } from "@/lib/constants/complaints";
import { wilayahService, type WilayahItem } from "@/services/wilayahService";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface ComplaintLocationFieldsProps {
  form: UseFormReturn<CreateComplaintValues>;
  isLoading: boolean;
}

export function ComplaintLocationFields({ form, isLoading }: ComplaintLocationFieldsProps) {
  const [provinces, setProvinces] = useState<WilayahItem[]>([]);
  const [regencies, setRegencies] = useState<WilayahItem[]>([]);
  const [districts, setDistricts] = useState<WilayahItem[]>([]);
  const [villages, setVillages] = useState<WilayahItem[]>([]);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    wilayahService.getProvinces().then(setProvinces);
  }, []);

  const handleProvinceChange = (provId: string) => {
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    form.setValue("kecamatan", "");
    form.setValue("kelurahan", "");
    wilayahService.getRegencies(provId).then(setRegencies);
  };

  const handleRegencyChange = (regId: string) => {
    setDistricts([]);
    setVillages([]);
    form.setValue("kecamatan", "");
    form.setValue("kelurahan", "");
    wilayahService.getDistricts(regId).then(setDistricts);
  };

  const handleDistrictChange = (distId: string) => {
    const district = districts.find((d) => d.id === distId);
    form.setValue("kecamatan", district?.name || "");
    setVillages([]);
    form.setValue("kelurahan", "");
    wilayahService.getVillages(distId).then(setVillages);
  };

  const handleVillageChange = (villId: string) => {
    const village = villages.find((v) => v.id === villId);
    form.setValue("kelurahan", village?.name || "");
  };

  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-3 sm:p-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{PENGADUAN_STRINGS.LABEL_LOKASI}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsManual(!isManual)}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          {isManual ? "Mode Otomatis" : PENGADUAN_STRINGS.LABEL_TOGGLE_MANUAL}
        </Button>
      </div>

      {!isManual ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">{PENGADUAN_STRINGS.LABEL_PROVINSI}</label>
            <Select onValueChange={handleProvinceChange} disabled={isLoading}>
              <SelectTrigger className="w-full bg-background"><SelectValue placeholder={PENGADUAN_STRINGS.PLACEHOLDER_PROVINSI} /></SelectTrigger>
              <SelectContent className="max-h-56">
                {provinces.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">{PENGADUAN_STRINGS.LABEL_KOTA}</label>
            <Select onValueChange={handleRegencyChange} disabled={isLoading || regencies.length === 0}>
              <SelectTrigger className="w-full bg-background"><SelectValue placeholder={PENGADUAN_STRINGS.PLACEHOLDER_KOTA} /></SelectTrigger>
              <SelectContent className="max-h-56">
                {regencies.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">{PENGADUAN_STRINGS.LABEL_KECAMATAN}</label>
            <Select onValueChange={handleDistrictChange} disabled={isLoading || districts.length === 0}>
              <SelectTrigger className="w-full bg-background"><SelectValue placeholder={PENGADUAN_STRINGS.PLACEHOLDER_KECAMATAN} /></SelectTrigger>
              <SelectContent className="max-h-56">
                {districts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">{PENGADUAN_STRINGS.LABEL_KELURAHAN}</label>
            <Select onValueChange={handleVillageChange} disabled={isLoading || villages.length === 0}>
              <SelectTrigger className="w-full bg-background"><SelectValue placeholder={PENGADUAN_STRINGS.PLACEHOLDER_KELURAHAN} /></SelectTrigger>
              <SelectContent className="max-h-56">
                {villages.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField control={form.control} name="kecamatan" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">{PENGADUAN_STRINGS.LABEL_KECAMATAN}</FormLabel>
            <FormControl><Input placeholder={PENGADUAN_STRINGS.PLACEHOLDER_KECAMATAN} disabled={isLoading} {...field} /></FormControl>
            <FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="kelurahan" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">{PENGADUAN_STRINGS.LABEL_KELURAHAN}</FormLabel>
            <FormControl><Input placeholder={PENGADUAN_STRINGS.PLACEHOLDER_KELURAHAN} disabled={isLoading} {...field} /></FormControl>
            <FormMessage /></FormItem>
          )} />
        </div>
      )}

      <FormField control={form.control} name="lokasi" render={({ field }) => (
        <FormItem><FormLabel className="text-xs">{PENGADUAN_STRINGS.LABEL_DETAIL_LOKASI}</FormLabel>
        <FormControl><Input placeholder={PENGADUAN_STRINGS.PLACEHOLDER_DETAIL_LOKASI} disabled={isLoading} {...field} /></FormControl>
        <FormMessage /></FormItem>
      )} />
    </div>
  );
}
