import { Search, Building2, MapPin, TrendingUp } from "lucide-react";

const stats = [
  { label: "Practices Listed", value: "41", icon: Building2, suffix: "Across Dorset" },
  { label: "Price Points", value: "451", icon: Search, suffix: "Tracked" },
  { label: "Towns Covered", value: "14", icon: MapPin, suffix: "Dorset Towns" },
  { label: "Avg Savings Found", value: "£22", icon: TrendingUp, suffix: "Per Consultation" },
];

export default function StatsBar() {
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
