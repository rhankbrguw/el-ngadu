import { usePublicStats } from "@/hooks/usePublicStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CheckCircle, Clock } from "lucide-react";

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: number }) {
  return (
    <Card className="bg-card border-border/70 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{title}</CardTitle>
        <div className="p-2.5 rounded-xl bg-muted/60 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

export function Stats() {
  const { stats } = usePublicStats();

  return (
    <section className="py-12 md:py-16 bg-background border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard icon={<BarChart className="h-6 w-6 text-primary dark:text-secondary" />} title="Total Pengaduan" value={stats.total} />
          <StatCard icon={<Clock className="h-6 w-6 text-secondary" />} title="Pengaduan Diproses" value={stats.proses} />
          <StatCard icon={<CheckCircle className="h-6 w-6 text-success" />} title="Pengaduan Selesai" value={stats.selesai} />
        </div>
      </div>
    </section>
  );
}