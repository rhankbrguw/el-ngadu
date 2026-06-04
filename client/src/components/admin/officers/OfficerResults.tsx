import OfficerTable from "./OfficerTable";
import OfficerCards from "./OfficerCards";
import type { Petugas } from "@/types";

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
  return (
    <>
      <div className="hidden md:block">
        <OfficerTable
          petugasList={petugasList}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
      <div className="block md:hidden">
        <OfficerCards
          petugasList={petugasList}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </>
  );
}
