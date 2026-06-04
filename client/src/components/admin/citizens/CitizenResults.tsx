import CitizenTable from "./CitizenTable";
import CitizenCards from "./CitizenCards";
import type { Masyarakat } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface CitizenResultsProps {
  masyarakatList: Masyarakat[];
  onDelete?: (nik: string, nama: string) => void;
}

export default function CitizenResults({ masyarakatList, onDelete }: CitizenResultsProps) {
  return (
    <Card>
      <CardContent className="p-4 md:p-0">
        <CitizenTable masyarakatList={masyarakatList} onDelete={onDelete} />
        <CitizenCards masyarakatList={masyarakatList} onDelete={onDelete} />
      </CardContent>
    </Card>
  );
}
