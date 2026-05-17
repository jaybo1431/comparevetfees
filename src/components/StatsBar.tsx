import { Search, Building2, MapPin, TrendingUp } from "lucide-react";
import type { Practice } from "@/data/practices";

interface StatsBarProps {
  practices: Practice[];
}

export default function StatsBar({ practices }: StatsBarProps) {
  const practiceCount = practices.length;
  const towns = new Set(practices.map((p) => p.town));
  const counties = new Set(practices.map((p) => p.county));
  const pricePoints = practices.reduce((sum, p) => sum + Object.keys(p.prices).length, 0);

  const avgConsultation = Math.round(
    practices.reduce((sum, p) => sum + p.prices.consultation, 0) / practiceCount
  );
  const minConsultation = Math.min(...practices.map((p) => p.prices.consultation));
  const avgSaving = avgConsultation - minConsultation;

  const stats = [
    { label: "Practices Listed", value: practiceCount.toString(), icon: Building2, suffix: `Across ${counties.size} Counties` },
    { label: "Price Points", value: pricePoints.toLocaleString(), icon: Search, suffix: "Tracked" },
    { label: "Towns Covered", value: towns.size.toString(), icon: MapPin, suffix: `Across Southern England` },
    { label: "Avg Savings Found", value: `£${avgSaving}`, icon: TrendingUp, suffix: "Per Consultation" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mb-2">
            <stat.icon className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.label}</p>
          <p className="text-[10px] text-gray-400">{stat.suffix}</p>
        </div>
      ))}
    </div>
  );
}
