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
    <div className="flex flex-col gap-2.5 rounded-xl border border-border/70 bg-card p-3 shadow-xs md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={PENGADUAN_STRINGS.FILTER_SEARCH_PLACEHOLDER}
          value={filters.q}
          onChange={(e) => onFilterChange("q", e.target.value)}
          className="pl-9 bg-background h-9 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-[140px]">
          <Select value={filters.status} onValueChange={(v) => onFilterChange("status", v)}>
            <SelectTrigger className="h-9 bg-background text-xs">
              <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
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

        <div className="w-full sm:w-[160px]">
          <Select value={filters.kecamatan} onValueChange={(v) => onFilterChange("kecamatan", v)}>
            <SelectTrigger className="h-9 bg-background text-xs">
              <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
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

        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9 text-xs text-muted-foreground hover:text-foreground">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            {PENGADUAN_STRINGS.FILTER_RESET}
          </Button>
        )}
      </div>
    </div>
  );
}
