import { Search, BarChart3, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — CompareVetFees",
  description: "Learn how CompareVetFees helps you compare veterinary prices across practices in the South of England.",
};

const steps = [
  {
    icon: Search,
    title: "Search your area",
    description:
      "Enter your town, city, or postcode. CompareVetFees shows you every practice in our database near you, with prices displayed upfront.",
  },
  {
    icon: BarChart3,
    title: "Compare prices side by side",
    description:
      "See how practices compare on consultations, vaccinations, neutering, dental work, and more. Every price is benchmarked against the local average.",
  },
  {
    icon: Shield,
    title: "Make an informed choice",
    description:
      "View each practice's full price list, ownership (independent vs corporate chain), ratings, and features. Then contact them directly — we never take a booking fee.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How CompareVetFees Works</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We believe pet owners deserve to know what veterinary care costs before they commit.
          CompareVetFees makes that simple.
        </p>
      </div>

      <div className="space-y-12 mb-16">
        {steps.map((step, idx) => (
          <div key={step.title} className="flex items-start gap-6">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <step.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 mb-1">Step {idx + 1}</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Where does the pricing data come from?</h2>
        <div className="space-y-3 text-gray-600">
          <p>
            CompareVetFees sources pricing data from publicly available information published by veterinary practices
            on their websites and through official channels.
          </p>
          <p>
            Following the <strong>CMA&apos;s March 2026 reforms</strong>, all UK veterinary practices are now required
            to publish standardised price lists for common services. Large corporate chains must comply by
            December 2026, with smaller independent practices following by March 2027.
          </p>
          <p>
            The RCVS is also building a centralised pricing database that will be available to approved
            third-party comparison services like CompareVetFees.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Our commitments</h3>
          <ul className="space-y-2">
            {[
              "No practice pays to rank higher — results are never influenced by payments",
              "We clearly label whether a practice is independent or part of a corporate group",
              "Prices are verified against published sources and updated regularly",
              "We will never take a booking fee — contact practices directly",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start comparing prices <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
