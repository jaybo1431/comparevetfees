import Link from "next/link";
import { Star, MapPin, Building2, User, Clock, Shield } from "lucide-react";
import { Practice, getAveragePrice } from "@/data/practices";

interface PracticeCardProps {
  practice: Practice;
  highlightProcedure?: string;
}

export default function PracticeCard({ practice, highlightProcedure }: PracticeCardProps) {
  const consultPrice = practice.prices.consultation;
  const avgConsult = getAveragePrice("consultation");
  const priceDiff = consultPrice - avgConsult;
  const isPriceLow = priceDiff < -5;
  const isPriceHigh = priceDiff > 5;

  return (
    <Link href={`/practice/${practice.slug}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:border-blue-300 hover:shadow-md transition group">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition min-w-0 flex-1">
                {practice.name}
              </h3>
              {practice.isIndependent ? (
                <span className="shrink-0 text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                  <User className="w-3 h-3" /> Independent
                </span>
              ) : (
                <span className="shrink-0 text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                  <Building2 className="w-3 h-3" /> {practice.parentGroup}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{practice.town}, {practice.postcode}</span>
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                {practice.rating} ({practice.reviewCount})
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap" title="Transparency Score">
                <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-medium text-blue-600">{practice.transparencyScore}/5</span>
              </span>
              <span className="hidden sm:flex items-center gap-1 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Est. {practice.openingSince}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {practice.features.slice(0, 3).map((f) => (
                <span key={f} className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md">
                  {f}
                </span>
              ))}
              {practice.features.length > 3 && (
                <span className="text-[11px] text-gray-400">+{practice.features.length - 3} more</span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0 sm:ml-4">
            <p className="text-xs text-gray-400 mb-0.5 whitespace-nowrap">Consultation</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap">£{consultPrice}</p>
            {isPriceLow && (
              <span className="text-[10px] sm:text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1 whitespace-nowrap">
                £{Math.abs(priceDiff)} below avg
              </span>
            )}
            {isPriceHigh && (
              <span className="text-[10px] sm:text-[11px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1 whitespace-nowrap">
                £{priceDiff} above avg
              </span>
            )}
            {!isPriceLow && !isPriceHigh && (
              <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full inline-block mt-1 whitespace-nowrap">
                Near average
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
