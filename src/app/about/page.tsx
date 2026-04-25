import { Shield, Heart, Eye, Scale } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — CompareVetFees",
  description: "CompareVetFees is an independent veterinary price comparison platform for the South of England.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">About CompareVetFees</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We started CompareVetFees because we believe pet owners shouldn&apos;t have to guess
          what veterinary care is going to cost.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">The Problem</h2>
        <p className="text-gray-600 mb-4">
          UK vet prices have risen <strong>63% between 2016 and 2023</strong> — nearly double the rate of inflation.
          Over 60% of practices are now owned by just six corporate groups. And until the CMA&apos;s 2026 reforms,
          fewer than 40% of practices even published their prices online.
        </p>
        <p className="text-gray-600">
          The result? Pet owners routinely walk into consultations with no idea what they&apos;ll be charged.
          A third only learn the price at reception, after the appointment. The CMA estimated this lack of
          transparency cost UK households up to <strong>£1 billion over five years</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          CompareVetFees exists to give pet owners the information they need to make confident decisions
          about veterinary care. We&apos;re not here to drive a race to the bottom on quality — we&apos;re
          here to make sure you can see what you&apos;re paying for and decide what&apos;s right for you
          and your pet.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: Eye,
              title: "Transparency",
              desc: "Every price is sourced from published data. We show you where it comes from.",
            },
            {
              icon: Scale,
              title: "Independence",
              desc: "No practice pays to rank higher. Our results are never influenced by commercial relationships.",
            },
            {
              icon: Heart,
              title: "Pet Owners First",
              desc: "We built this for you, not for vet chains. Your interests come first, always.",
            },
            {
              icon: Shield,
              title: "Accuracy",
              desc: "We verify prices regularly and clearly flag when data was last updated.",
            },
          ].map((v) => (
            <div key={v.title} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                <v.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{v.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Launching in the South of England</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-6">
          We&apos;re starting with practices across Sussex, Hampshire, Surrey, Kent, Dorset, Devon,
          Somerset, Wiltshire, and Berkshire — with plans to expand nationwide as the CMA reforms roll out.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
        >
          Start comparing prices
        </Link>
      </div>
    </div>
  );
}
