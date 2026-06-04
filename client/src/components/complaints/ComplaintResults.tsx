import ComplaintTable from "./ComplaintTable";
import ComplaintCards from "./ComplaintCards";
import type { PengaduanWithPelapor } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface ComplaintResultsProps {
  pengaduanList: PengaduanWithPelapor[];
}

export default function ComplaintResults({
  pengaduanList,
}: ComplaintResultsProps) {
  return (
    <Card>
      <CardContent className="p-4 md:p-0">
        <ComplaintTable pengaduanList={pengaduanList} />
        <ComplaintCards pengaduanList={pengaduanList} />
      </CardContent>
    </Card>
  );
}
