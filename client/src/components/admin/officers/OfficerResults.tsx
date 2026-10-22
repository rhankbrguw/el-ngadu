import OfficerTable from "./OfficerTable";
import OfficerCards from "./OfficerCards";
import type { Petugas } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/utils/use-media-query";

interface OfficerResultsProps {
  petugasList: Petugas[];
  onEdit?: (petugas: Petugas) => void;
  onDelete?: (id: number) => void;
}

export default function OfficerResults({
  petugasList,
  onEdit,
  onDelete,
}: OfficerResultsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Card className="border shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <OfficerTable
            petugasList={petugasList}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="pt-1">
      <OfficerCards
        petugasList={petugasList}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
