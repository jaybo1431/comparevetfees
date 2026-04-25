import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CompareVetFees — Compare Vet Prices Across Dorset",
  description:
    "Compare veterinary prices across Dorset practices. See consultation fees, vaccination costs, neutering prices and more in Bournemouth, Poole, Christchurch, Dorchester & Weymouth. Independent, transparent, and free.",
  keywords: "vet prices Dorset, veterinary costs Bournemouth, compare vet fees Poole, UK vet prices, Dorset vets, Christchurch vet prices, Weymouth vets",
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
