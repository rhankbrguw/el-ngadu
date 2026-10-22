import ComplaintTable from "./ComplaintTable";
import ComplaintCards from "./ComplaintCards";
import type { PengaduanWithPelapor } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/utils/use-media-query";

interface ComplaintResultsProps {
  pengaduanList: PengaduanWithPelapor[];
}

export default function ComplaintResults({
  pengaduanList,
}: ComplaintResultsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Card className="border shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <ComplaintTable pengaduanList={pengaduanList} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="pt-1">
      <ComplaintCards pengaduanList={pengaduanList} />
    </div>
  );
}

