import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CompareVetFees — Compare Vet Prices Across the South of England",
  description:
    "Compare veterinary prices across practices in the South of England. See consultation fees, vaccination costs, neutering prices and more. Independent, transparent, and free.",
  keywords: "vet prices, veterinary costs, compare vet fees, UK vet prices, south england vets",
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
