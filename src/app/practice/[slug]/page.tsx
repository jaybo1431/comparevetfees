import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { practices, getPracticeBySlug } from "@/data/practices";
import PracticeDetailClient from "@/components/PracticeDetailClient";
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
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all practices
      </Link>

      <PracticeDetailClient practice={practice} practicesCount={practices.length} />
    </div>
  );
}
