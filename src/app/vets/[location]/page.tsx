import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Shield } from "lucide-react";
import { getPracticesByTown, getTowns } from "@/data/practices";
import PracticeCard from "@/components/PracticeCard";
import PriceComparisonTable from "@/components/PriceComparisonTable";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ location: string }>;
}

const LOCATION_INFO: Record<string, { fullName: string; description: string }> = {
  bournemouth: {
    fullName: "Bournemouth",
    description: "Compare vet prices across 7 practices in Bournemouth. From Charminster to Southbourne, find transparent pricing for consultations, vaccinations, neutering and more.",
  },
  poole: {
    fullName: "Poole",
    description: "Compare vet prices across 6 practices in Poole. Covering Parkstone, Canford Heath, Broadstone, Hamworthy and Upton with full price transparency.",
  },
  christchurch: {
    fullName: "Christchurch",
    description: "Compare vet prices across 4 practices in Christchurch. Including Highcliffe, Mudeford, and Burton with detailed pricing for all common treatments.",
  },
  dorchester: {
    fullName: "Dorchester",
    description: "Compare vet prices across 2 practices in Dorchester. Covering Poundbury and surrounding areas with transparent veterinary pricing.",
  },
  weymouth: {
    fullName: "Weymouth",
    description: "Compare vet prices across 3 practices in Weymouth. Including Wyke Regis, Upwey, and Rodwell with full price comparisons.",
  },
  wimborne: {
    fullName: "Wimborne",
    description: "Compare vet prices across 3 practices in Wimborne. Covering Colehill and surrounding areas with detailed veterinary costs.",
  },
  ferndown: {
    fullName: "Ferndown",
    description: "Compare vet prices across 2 practices in Ferndown with transparent pricing for all common procedures.",
  },
  verwood: {
    fullName: "Verwood",
    description: "Compare vet prices across 2 practices in Verwood with detailed pricing information for consultations, vaccinations, and treatments.",
  },
  "blandford-forum": {
    fullName: "Blandford Forum",
    description: "Compare vet prices across 2 practices in Blandford Forum with transparent pricing for farm animals, pets, and equine services.",
  },
  bridport: {
    fullName: "Bridport",
    description: "Compare vet prices across 2 practices in Bridport with detailed pricing for small animal and farm services in West Dorset.",
  },
  swanage: {
    fullName: "Swanage",
    description: "Compare vet prices in Swanage with detailed coastal pet care pricing and comprehensive veterinary services.",
  },
  wareham: {
    fullName: "Wareham",
    description: "Compare vet prices across 2 practices in Wareham with transparent pricing for pets in Purbeck and surrounding areas.",
  },
  shaftesbury: {
    fullName: "Shaftesbury",
    description: "Compare vet prices across 2 practices in Shaftesbury with detailed pricing for small animal care in North Dorset.",
  },
  sherborne: {
    fullName: "Sherborne",
    description: "Compare vet prices across 3 practices in Sherborne with transparent pricing for farm animals and small animal care.",
  },
  dorset: {
    fullName: "Dorset",
    description: "Compare vet prices across all 41 practices in Dorset. From Bournemouth to Sherborne, find transparent pricing across the county.",
  },
};

export async function generateStaticParams() {
  return Object.keys(LOCATION_INFO).map((location) => ({ location }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { location } = await params;
  const info = LOCATION_INFO[location];
  if (!info) return { title: "Location Not Found" };

  return {
    title: `${info.fullName} Vet Prices — Compare Veterinary Fees | CompareVetFees`,
    description: info.description,
    keywords: `vet prices ${info.fullName}, veterinary costs ${info.fullName}, ${info.fullName} vets, compare vet fees ${info.fullName}`,
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { location } = await params;
  const info = LOCATION_INFO[location];

  if (!info) notFound();

  let practices;
  if (location === "dorset") {
    // Show all practices for Dorset overview
    const { practices: allPractices } = await import("@/data/practices");
    practices = allPractices;
  } else {
    practices = getPracticesByTown(info.fullName);
  }

  if (practices.length === 0) notFound();

  // Calculate some local stats
  const avgConsult = Math.round(
    practices.reduce((sum, p) => sum + p.prices.consultation, 0) / practices.length
  );
  const lowestConsult = Math.min(...practices.map((p) => p.prices.consultation));
  const highestConsult = Math.max(...practices.map((p) => p.prices.consultation));
  const independentCount = practices.filter((p) => p.isIndependent).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all locations
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Vet Prices in {info.fullName}
            </h1>
          </div>
          <p className="text-lg text-gray-500 max-w-3xl">
            {info.description}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{practices.length}</p>
            <p className="text-xs text-gray-500">Practices Listed</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">£{avgConsult}</p>
            <p className="text-xs text-gray-500">Avg Consultation</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">£{lowestConsult}</p>
            <p className="text-xs text-gray-500">Lowest Consultation</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{independentCount}</p>
            <p className="text-xs text-gray-500">Independent Practices</p>
          </div>
        </div>
      </section>

      {/* Practices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Practice list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                All {practices.length} Practices in {info.fullName}
              </h2>
            </div>
            <div className="space-y-3">
              {practices.map((p) => (
                <PracticeCard key={p.slug} practice={p} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <PriceComparisonTable practices={practices} />

              {/* Local Info */}
              <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range in {info.fullName}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Standard Consultation</p>
                    <p className="text-sm text-gray-900">
                      <span className="font-bold text-blue-600">£{lowestConsult}</span>
                      {" – "}
                      <span className="font-bold text-gray-900">£{highestConsult}</span>
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <p className="text-xs font-medium text-gray-900">Why use CompareVetFees?</p>
                    </div>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li>• 100% independent — no vet pays to rank higher</li>
                      <li>• Transparency scores for every practice</li>
                      <li>• Real prices from published data</li>
                      <li>• Independent vs corporate ownership shown</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Other Dorset Towns */}
              {location !== "dorset" && (
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Other Dorset Towns</h3>
                  <div className="space-y-2">
                    {Object.entries(LOCATION_INFO)
                      .filter(([key]) => key !== location && key !== "dorset")
                      .slice(0, 5)
                      .map(([key, value]) => (
                        <Link
                          key={key}
                          href={`/vets/${key}`}
                          className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {value.fullName} Vets →
                        </Link>
                      ))}
                    <Link
                      href="/vets/dorset"
                      className="block text-sm font-medium text-gray-900 hover:text-blue-600 pt-2 border-t border-gray-100"
                    >
                      View all Dorset vets →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
