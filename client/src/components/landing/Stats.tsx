import { usePublicStats } from "@/hooks/usePublicStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CheckCircle, Clock } from "lucide-react";

export function Stats() {
 const { stats } = usePublicStats();

 return (
 <section className="py-16 bg-background ">
 <div className="container mx-auto px-4">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <StatCard icon={<BarChart className="h-8 w-8 text-primary" />} title="Total Pengaduan" value={stats.total} />
 <StatCard icon={<Clock className="h-8 w-8 text-secondary" />} title="Pengaduan Diproses" value={stats.proses} />
 <StatCard icon={<CheckCircle className="h-8 w-8 text-success" />} title="Pengaduan Selesai" value={stats.selesai} />
 </div>
 </div>
 </section>
 );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: number }) {
 return (
 <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 group animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-150">
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
 <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">{icon}</div>
 </CardHeader>
 <CardContent>
 <div className="text-4xl font-bold">{value}</div>
 </CardContent>
 </Card>
 );
}