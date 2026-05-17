import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CompareVetFees — Compare Vet Prices Across Southern England",
  description:
    "Compare veterinary prices across 530+ practices in Southern England. Devon, Dorset, Hampshire, Cornwall, Kent, Surrey, Essex, Greater London and more. See consultation fees, vaccination costs, neutering prices. Independent, transparent, and free.",
  keywords: "vet prices, compare vet fees, UK vet prices, Devon vets, Dorset vets, Hampshire vets, Somerset vets, Wiltshire vets, Cornwall vets, Kent vets, Surrey vets, London vets, Essex vets, Hertfordshire vets, Berkshire vets, veterinary costs, vet prices comparison",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
