import { Shield } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Compare<span className="text-emerald-600">VetFees</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-md">
              Compare veterinary prices across practices in the South of England.
              Independent, transparent, and free. Helping pet owners make informed decisions.
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Prices shown are sourced from publicly available data and may not reflect current fees.
              Always confirm prices directly with the practice before booking.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-500 hover:text-emerald-600">Compare Prices</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-gray-500 hover:text-emerald-600">How It Works</Link></li>
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-emerald-600">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Dorset Towns</h4>
            <ul className="space-y-2">
              <li><Link href="/vets/bournemouth" className="text-sm text-gray-500 hover:text-emerald-600">Bournemouth</Link></li>
              <li><Link href="/vets/poole" className="text-sm text-gray-500 hover:text-emerald-600">Poole</Link></li>
              <li><Link href="/vets/christchurch" className="text-sm text-gray-500 hover:text-emerald-600">Christchurch</Link></li>
              <li><Link href="/vets/dorchester" className="text-sm text-gray-500 hover:text-emerald-600">Dorchester</Link></li>
              <li><Link href="/vets/dorset" className="text-sm font-medium text-gray-900 hover:text-emerald-600">View All →</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} CompareVetFees. All rights reserved.</p>
          <p className="text-xs text-gray-400">
            CompareVetFees is not affiliated with the RCVS, CMA, or any veterinary practice.
            Built with transparency in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
