import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Clock,
  Building2,
  User,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { practices, getPracticeBySlug, PROCEDURE_LABELS, PRICE_KEYS, getAveragePrice } from "@/data/practices";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return practices.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPracticeBySlug(slug);
  if (!practice) return { title: "Practice Not Found" };
  return {
    title: `${practice.name} — Prices & Reviews | CompareVetFees`,
    description: `Compare prices at ${practice.name} in ${practice.town}. Consultation from £${practice.prices.consultation}. See full price list and how they compare to local averages.`,
  };
}

export default async function PracticePage({ params }: PageProps) {
  const { slug } = await params;
  const practice = getPracticeBySlug(slug);
  if (!practice) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all practices
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{practice.name}</h1>
              {practice.isIndependent ? (
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <User className="w-3 h-3" /> Independent
                </span>
              ) : (
                <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {practice.parentGroup}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {practice.address}, {practice.town}, {practice.postcode}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                {practice.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Established {practice.openingSince}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-xl font-bold">{practice.rating}</span>
            </div>
            <p className="text-xs text-gray-400">{practice.reviewCount} reviews</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {practice.features.map((f) => (
            <span key={f} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Price List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Full Price List</h2>
          <p className="text-sm text-gray-500">
            Compared against the average across all {practices.length} practices in our database
          </p>
        </div>

        <div className="divide-y divide-gray-50">
          {PRICE_KEYS.map((key) => {
            const price = practice.prices[key];
            if (price === undefined) return null;
            const avg = getAveragePrice(key);
            const diff = price - avg;
            const notesKey = `${key}Notes` as keyof typeof practice.prices;
            const notes = practice.prices[notesKey];

            return (
              <div key={key} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-medium text-gray-900">{PROCEDURE_LABELS[key]}</p>
                  {notes && typeof notes === "string" && (
                    <p className="text-xs text-gray-400 mt-0.5">{notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">£{price}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {diff < -3 ? (
                        <>
                          <TrendingDown className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600">£{Math.abs(diff)} below avg</span>
                        </>
                      ) : diff > 3 ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-500">£{diff} above avg</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-3 h-3 text-gray-300" />
                          <span className="text-xs text-gray-400">Near average</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400 hidden sm:block">
                    <p>Avg: £{avg}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-900">Price Disclaimer</p>
          <p className="text-sm text-amber-700 mt-1">
            Prices shown are sourced from publicly available data and were last verified in April 2026.
            Actual costs may vary based on the animal&apos;s size, breed, age, and specific medical needs.
            Always confirm the final price directly with the practice before proceeding with any treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
