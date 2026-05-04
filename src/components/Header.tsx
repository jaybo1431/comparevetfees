"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-14 h-14 sm:w-16 sm:h-16 transition-transform group-hover:scale-105" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              Compare<span className="text-blue-600">VetFees</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Compare Prices
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Beta</span>
            <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <Search className="w-4 h-4" />
              Find a Vet
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>
              Compare Prices
            </Link>
            <Link href="/how-it-works" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            <Link href="/about" className="block text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
