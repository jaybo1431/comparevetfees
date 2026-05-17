import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Shield } from "lucide-react";
import { getAllPractices, getPracticesByTown, getPracticesByCounty } from "@/lib/practices";
import PracticeCard from "@/components/PracticeCard";
import PriceComparisonTable from "@/components/PriceComparisonTable";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ location: string }>;
}

// Counties list for routing
const COUNTY_SLUGS: Record<string, string> = {
  dorset: "Dorset",
  devon: "Devon",
  hampshire: "Hampshire",
  somerset: "Somerset",
  wiltshire: "Wiltshire",
  cornwall: "Cornwall",
  gloucestershire: "Gloucestershire",
  oxfordshire: "Oxfordshire",
  berkshire: "Berkshire",
  buckinghamshire: "Buckinghamshire",
  "isle-of-wight": "Isle of Wight",
  surrey: "Surrey",
  kent: "Kent",
  "east-sussex": "East Sussex",
  "west-sussex": "West Sussex",
  "greater-london": "Greater London",
  essex: "Essex",
  hertfordshire: "Hertfordshire",
};

const LOCATION_INFO: Record<string, { fullName: string; description: string; type?: "county" | "town" }> = {
  // COUNTY ROUTES
  dorset: { fullName: "Dorset", type: "county", description: "Compare vet prices across all practices in Dorset. From Bournemouth to Sherborne, find transparent pricing across the county." },
  devon: { fullName: "Devon", type: "county", description: "Compare vet prices across all practices in Devon. From Exeter to Plymouth, find transparent pricing for consultations, vaccinations, and more." },
  hampshire: { fullName: "Hampshire", type: "county", description: "Compare vet prices across all practices in Hampshire. From Southampton to Portsmouth, find transparent pricing across the county." },
  somerset: { fullName: "Somerset", type: "county", description: "Compare vet prices across all practices in Somerset. From Bath to Taunton, find transparent pricing for all common procedures." },
  wiltshire: { fullName: "Wiltshire", type: "county", description: "Compare vet prices across all practices in Wiltshire. From Salisbury to Swindon, find transparent pricing across the county." },
  cornwall: { fullName: "Cornwall", type: "county", description: "Compare vet prices across all practices in Cornwall. From Truro to Penzance, find transparent pricing for consultations, vaccinations, and more." },
  gloucestershire: { fullName: "Gloucestershire", type: "county", description: "Compare vet prices across all practices in Gloucestershire. From Cheltenham to Gloucester, find transparent pricing across the county." },
  oxfordshire: { fullName: "Oxfordshire", type: "county", description: "Compare vet prices across all practices in Oxfordshire. From Oxford to Banbury, find transparent pricing for all common procedures." },
  berkshire: { fullName: "Berkshire", type: "county", description: "Compare vet prices across all practices in Berkshire. From Reading to Windsor, find transparent pricing for consultations, vaccinations, and more." },
  buckinghamshire: { fullName: "Buckinghamshire", type: "county", description: "Compare vet prices across all practices in Buckinghamshire. From Aylesbury to High Wycombe, find transparent pricing across the county." },
  "isle-of-wight": { fullName: "Isle of Wight", type: "county", description: "Compare vet prices across all practices on the Isle of Wight. From Newport to Ryde, find transparent pricing for all common procedures." },
  surrey: { fullName: "Surrey", type: "county", description: "Compare vet prices across all practices in Surrey. From Guildford to Woking, find transparent pricing for consultations, vaccinations, and more." },
  kent: { fullName: "Kent", type: "county", description: "Compare vet prices across all practices in Kent. From Canterbury to Maidstone, find transparent pricing across the county." },
  "east-sussex": { fullName: "East Sussex", type: "county", description: "Compare vet prices across all practices in East Sussex. From Brighton to Eastbourne, find transparent pricing for all common procedures." },
  "west-sussex": { fullName: "West Sussex", type: "county", description: "Compare vet prices across all practices in West Sussex. From Chichester to Crawley, find transparent pricing across the county." },
  "greater-london": { fullName: "Greater London", type: "county", description: "Compare vet prices across all practices in Greater London. From Westminster to Richmond, find transparent pricing for consultations, vaccinations, and more." },
  essex: { fullName: "Essex", type: "county", description: "Compare vet prices across all practices in Essex. From Chelmsford to Colchester, find transparent pricing across the county." },
  hertfordshire: { fullName: "Hertfordshire", type: "county", description: "Compare vet prices across all practices in Hertfordshire. From St Albans to Watford, find transparent pricing for all common procedures." },
  // DORSET TOWNS
  bournemouth: { fullName: "Bournemouth", description: "Compare vet prices across practices in Bournemouth. From Charminster to Southbourne, find transparent pricing for consultations, vaccinations, neutering and more." },
  poole: { fullName: "Poole", description: "Compare vet prices across practices in Poole. Covering Parkstone, Canford Heath, Broadstone, Hamworthy and Upton with full price transparency." },
  christchurch: { fullName: "Christchurch", description: "Compare vet prices across practices in Christchurch. Including Highcliffe, Mudeford, and Burton with detailed pricing for all common treatments." },
  dorchester: { fullName: "Dorchester", description: "Compare vet prices across practices in Dorchester. Covering Poundbury and surrounding areas with transparent veterinary pricing." },
  weymouth: { fullName: "Weymouth", description: "Compare vet prices across practices in Weymouth. Including Wyke Regis, Upwey, and Rodwell with full price comparisons." },
  wimborne: { fullName: "Wimborne", description: "Compare vet prices across practices in Wimborne. Covering Colehill and surrounding areas with detailed veterinary costs." },
  ferndown: { fullName: "Ferndown", description: "Compare vet prices across practices in Ferndown with transparent pricing for all common procedures." },
  verwood: { fullName: "Verwood", description: "Compare vet prices across practices in Verwood with detailed pricing information." },
  "blandford-forum": { fullName: "Blandford Forum", description: "Compare vet prices across practices in Blandford Forum with transparent pricing for pets and farm animals." },
  bridport: { fullName: "Bridport", description: "Compare vet prices across practices in Bridport with detailed pricing for small animal and farm services." },
  swanage: { fullName: "Swanage", description: "Compare vet prices in Swanage with detailed coastal pet care pricing." },
  wareham: { fullName: "Wareham", description: "Compare vet prices across practices in Wareham with transparent pricing for pets in Purbeck." },
  shaftesbury: { fullName: "Shaftesbury", description: "Compare vet prices across practices in Shaftesbury with detailed pricing for small animal care." },
  sherborne: { fullName: "Sherborne", description: "Compare vet prices across practices in Sherborne with transparent pricing." },
  // DEVON TOWNS
  exeter: { fullName: "Exeter", description: "Compare vet prices across practices in Exeter with transparent pricing for consultations, vaccinations, and more." },
  plymouth: { fullName: "Plymouth", description: "Compare vet prices across practices in Plymouth with detailed pricing for all common procedures." },
  torquay: { fullName: "Torquay", description: "Compare vet prices across practices in Torquay with transparent veterinary pricing." },
  barnstaple: { fullName: "Barnstaple", description: "Compare vet prices across practices in Barnstaple with detailed pricing for small animals and farm services." },
  // HAMPSHIRE TOWNS
  southampton: { fullName: "Southampton", description: "Compare vet prices across practices in Southampton with transparent pricing for all common procedures." },
  basingstoke: { fullName: "Basingstoke", description: "Compare vet prices across practices in Basingstoke with detailed veterinary pricing." },
  // SOMERSET TOWNS
  bath: { fullName: "Bath", description: "Compare vet prices across practices in Bath with transparent pricing for consultations, vaccinations, and more." },
  taunton: { fullName: "Taunton", description: "Compare vet prices across practices in Taunton with detailed pricing for all common procedures." },
  // WILTSHIRE TOWNS
  salisbury: { fullName: "Salisbury", description: "Compare vet prices across practices in Salisbury with transparent pricing across the city." },
  swindon: { fullName: "Swindon", description: "Compare vet prices across practices in Swindon with detailed veterinary pricing." },
  // CORNWALL TOWNS
  truro: { fullName: "Truro", description: "Compare vet prices across practices in Truro with transparent pricing for consultations, vaccinations, and more." },
  falmouth: { fullName: "Falmouth", description: "Compare vet prices across practices in Falmouth with detailed pricing for all common procedures." },
  penzance: { fullName: "Penzance", description: "Compare vet prices across practices in Penzance with transparent veterinary pricing." },
  newquay: { fullName: "Newquay", description: "Compare vet prices across practices in Newquay with detailed pricing for pets in Cornwall." },
  bodmin: { fullName: "Bodmin", description: "Compare vet prices across practices in Bodmin with transparent pricing." },
  // GLOUCESTERSHIRE TOWNS
  cheltenham: { fullName: "Cheltenham", description: "Compare vet prices across practices in Cheltenham with transparent pricing for all common procedures." },
  gloucester: { fullName: "Gloucester", description: "Compare vet prices across practices in Gloucester with detailed veterinary pricing." },
  cirencester: { fullName: "Cirencester", description: "Compare vet prices across practices in Cirencester with transparent pricing." },
  // OXFORDSHIRE TOWNS
  oxford: { fullName: "Oxford", description: "Compare vet prices across practices in Oxford with transparent pricing for consultations, vaccinations, and more." },
  banbury: { fullName: "Banbury", description: "Compare vet prices across practices in Banbury with detailed pricing for all common procedures." },
  witney: { fullName: "Witney", description: "Compare vet prices across practices in Witney with transparent veterinary pricing." },
  // BERKSHIRE TOWNS
  reading: { fullName: "Reading", description: "Compare vet prices across practices in Reading with transparent pricing for all common procedures." },
  newbury: { fullName: "Newbury", description: "Compare vet prices across practices in Newbury with detailed veterinary pricing." },
  windsor: { fullName: "Windsor", description: "Compare vet prices across practices in Windsor with transparent pricing." },
  bracknell: { fullName: "Bracknell", description: "Compare vet prices across practices in Bracknell with detailed pricing." },
  // BUCKINGHAMSHIRE TOWNS
  "high-wycombe": { fullName: "High Wycombe", description: "Compare vet prices across practices in High Wycombe with transparent pricing for all common procedures." },
  "milton-keynes": { fullName: "Milton Keynes", description: "Compare vet prices across practices in Milton Keynes with detailed veterinary pricing." },
  aylesbury: { fullName: "Aylesbury", description: "Compare vet prices across practices in Aylesbury with transparent pricing." },
  // SURREY TOWNS
  guildford: { fullName: "Guildford", description: "Compare vet prices across practices in Guildford with transparent pricing for all common procedures." },
  woking: { fullName: "Woking", description: "Compare vet prices across practices in Woking with detailed veterinary pricing." },
  epsom: { fullName: "Epsom", description: "Compare vet prices across practices in Epsom with transparent pricing." },
  // KENT TOWNS
  canterbury: { fullName: "Canterbury", description: "Compare vet prices across practices in Canterbury with transparent pricing for all common procedures." },
  maidstone: { fullName: "Maidstone", description: "Compare vet prices across practices in Maidstone with detailed veterinary pricing." },
  "tunbridge-wells": { fullName: "Tunbridge Wells", description: "Compare vet prices across practices in Tunbridge Wells with transparent pricing." },
  // EAST SUSSEX TOWNS
  brighton: { fullName: "Brighton", description: "Compare vet prices across practices in Brighton with transparent pricing for all common procedures." },
  eastbourne: { fullName: "Eastbourne", description: "Compare vet prices across practices in Eastbourne with detailed veterinary pricing." },
  hastings: { fullName: "Hastings", description: "Compare vet prices across practices in Hastings with transparent pricing." },
  // WEST SUSSEX TOWNS
  chichester: { fullName: "Chichester", description: "Compare vet prices across practices in Chichester with transparent pricing for all common procedures." },
  worthing: { fullName: "Worthing", description: "Compare vet prices across practices in Worthing with detailed veterinary pricing." },
  crawley: { fullName: "Crawley", description: "Compare vet prices across practices in Crawley with transparent pricing." },
  horsham: { fullName: "Horsham", description: "Compare vet prices across practices in Horsham with detailed pricing." },
  // ESSEX TOWNS
  chelmsford: { fullName: "Chelmsford", description: "Compare vet prices across practices in Chelmsford with transparent pricing for all common procedures." },
  colchester: { fullName: "Colchester", description: "Compare vet prices across practices in Colchester with detailed veterinary pricing." },
  "southend-on-sea": { fullName: "Southend-on-Sea", description: "Compare vet prices across practices in Southend with transparent pricing." },
  // HERTFORDSHIRE TOWNS
  "st-albans": { fullName: "St Albans", description: "Compare vet prices across practices in St Albans with transparent pricing for all common procedures." },
  watford: { fullName: "Watford", description: "Compare vet prices across practices in Watford with detailed veterinary pricing." },
  "hemel-hempstead": { fullName: "Hemel Hempstead", description: "Compare vet prices across practices in Hemel Hempstead with transparent pricing." },
  // GREATER LONDON AREAS
  wimbledon: { fullName: "Wimbledon", description: "Compare vet prices across practices in Wimbledon with transparent pricing for consultations, vaccinations, and more." },
  richmond: { fullName: "Richmond", description: "Compare vet prices across practices in Richmond with detailed veterinary pricing." },
  "kingston-upon-thames": { fullName: "Kingston upon Thames", description: "Compare vet prices across practices in Kingston with transparent pricing." },
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

  const practices = info.type === "county"
    ? await getPracticesByCounty(info.fullName)
    : await getPracticesByTown(info.fullName);

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
            <p className="text-2xl font-bold text-gray-900">&pound;{avgConsult}</p>
            <p className="text-xs text-gray-500">Avg Consultation</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">&pound;{lowestConsult}</p>
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
                      <span className="font-bold text-blue-600">&pound;{lowestConsult}</span>
                      {" – "}
                      <span className="font-bold text-gray-900">&pound;{highestConsult}</span>
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

              {/* Browse by County */}
              {info.type !== "county" && (
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Browse by County</h3>
                  <div className="space-y-2">
                    {Object.entries(LOCATION_INFO)
                      .filter(([, value]) => value.type === "county")
                      .slice(0, 6)
                      .map(([key, value]) => (
                        <Link
                          key={key}
                          href={`/vets/${key}`}
                          className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {value.fullName} Vets →
                        </Link>
                      ))}
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
