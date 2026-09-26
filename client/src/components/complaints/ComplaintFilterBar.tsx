import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, MapPin, Filter } from "lucide-react";
import { PENGADUAN_STRINGS } from "@/lib/constants/complaints";

interface ComplaintFilterBarProps {
  filters: { q: string; status: string; kecamatan: string };
  availableKecamatan: string[];
  onFilterChange: (key: "q" | "status" | "kecamatan", value: string) => void;
  onReset: () => void;
}

export function ComplaintFilterBar({
  filters,
  availableKecamatan,
  onFilterChange,
  onReset,
}: ComplaintFilterBarProps) {
  const isFiltered = filters.q !== "" || filters.status !== "all" || filters.kecamatan !== "all";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border/70 bg-card p-2 sm:px-3 sm:py-2 shadow-xs">
      <div className="relative w-full sm:max-w-xs md:max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={PENGADUAN_STRINGS.FILTER_SEARCH_PLACEHOLDER}
          value={filters.q}
          onChange={(e) => onFilterChange("q", e.target.value)}
          className="pl-8 bg-background h-8 text-xs rounded-lg"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto">
          <div className="w-full sm:w-auto sm:min-w-[145px]">
            <Select value={filters.status} onValueChange={(v) => onFilterChange("status", v)}>
              <SelectTrigger size="sm" className="h-8 bg-background text-xs rounded-lg w-full px-2.5">
                <Filter className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder={PENGADUAN_STRINGS.FILTER_ALL_STATUS} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{PENGADUAN_STRINGS.FILTER_ALL_STATUS}</SelectItem>
                <SelectItem value="diajukan">Diajukan</SelectItem>
                <SelectItem value="diproses">Diproses</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto sm:min-w-[165px]">
            <Select value={filters.kecamatan} onValueChange={(v) => onFilterChange("kecamatan", v)}>
              <SelectTrigger size="sm" className="h-8 bg-background text-xs rounded-lg w-full px-2.5">
                <MapPin className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder={PENGADUAN_STRINGS.FILTER_ALL_KECAMATAN} />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                <SelectItem value="all">{PENGADUAN_STRINGS.FILTER_ALL_KECAMATAN}</SelectItem>
                {availableKecamatan.map((kec) => (
                  <SelectItem key={kec} value={kec}>{kec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0 rounded-lg">
            <RotateCcw className="mr-1 h-3 w-3" />
            {PENGADUAN_STRINGS.FILTER_RESET}
          </Button>
        )}
      </div>
    </div>
  );
}
