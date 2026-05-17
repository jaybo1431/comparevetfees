import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Logo className="w-12 h-12" />
              <span className="text-xl font-bold text-gray-900">
                Compare<span className="text-blue-600">VetFees</span>
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
              <li><Link href="/" className="text-sm text-gray-500 hover:text-blue-600">Compare Prices</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-gray-500 hover:text-blue-600">How It Works</Link></li>
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-blue-600">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Browse by Region</h4>
            <ul className="space-y-2">
              <li className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-1">South West</li>
              <li><Link href="/vets/devon" className="text-sm text-gray-500 hover:text-blue-600">Devon</Link></li>
              <li><Link href="/vets/dorset" className="text-sm text-gray-500 hover:text-blue-600">Dorset</Link></li>
              <li><Link href="/vets/cornwall" className="text-sm text-gray-500 hover:text-blue-600">Cornwall</Link></li>
              <li><Link href="/vets/somerset" className="text-sm text-gray-500 hover:text-blue-600">Somerset</Link></li>
              <li className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-2">South East</li>
              <li><Link href="/vets/kent" className="text-sm text-gray-500 hover:text-blue-600">Kent</Link></li>
              <li><Link href="/vets/surrey" className="text-sm text-gray-500 hover:text-blue-600">Surrey</Link></li>
              <li><Link href="/vets/east-sussex" className="text-sm text-gray-500 hover:text-blue-600">East Sussex</Link></li>
              <li><Link href="/vets/hampshire" className="text-sm text-gray-500 hover:text-blue-600">Hampshire</Link></li>
              <li className="text-xs font-medium text-gray-400 uppercase tracking-wide pt-2">London &amp; Home Counties</li>
              <li><Link href="/vets/greater-london" className="text-sm text-gray-500 hover:text-blue-600">Greater London</Link></li>
              <li><Link href="/vets/essex" className="text-sm text-gray-500 hover:text-blue-600">Essex</Link></li>
              <li><Link href="/vets/hertfordshire" className="text-sm text-gray-500 hover:text-blue-600">Hertfordshire</Link></li>
              <li><Link href="/vets/berkshire" className="text-sm text-gray-500 hover:text-blue-600">Berkshire</Link></li>
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
