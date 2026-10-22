import CitizenTable from "./CitizenTable";
import CitizenCards from "./CitizenCards";
import type { Masyarakat } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/utils/use-media-query";

interface CitizenResultsProps {
  masyarakatList: Masyarakat[];
  onDelete?: (nik: string, nama: string) => void;
}

export default function CitizenResults({ masyarakatList, onDelete }: CitizenResultsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Card className="border shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <CitizenTable masyarakatList={masyarakatList} onDelete={onDelete} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="pt-1">
      <CitizenCards masyarakatList={masyarakatList} onDelete={onDelete} />
    </div>
  );
}
