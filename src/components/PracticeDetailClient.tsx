"use client";

import { useState } from "react";
import { Star, MapPin, Phone, Clock, Building2, User, AlertTriangle, TrendingDown, TrendingUp, Minus, MessageSquare, Shield } from "lucide-react";
import { Practice, PROCEDURE_LABELS, PRICE_KEYS, getAveragePrice } from "@/data/practices";
import ContactPracticeModal from "./ContactPracticeModal";

interface PracticeDetailClientProps {
  practice: Practice;
  practicesCount: number;
}

export default function PracticeDetailClient({ practice, practicesCount }: PracticeDetailClientProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start gap-2 mb-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 min-w-0 flex-1">{practice.name}</h1>
              {practice.isIndependent ? (
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <User className="w-3 h-3" /> Independent
                </span>
              ) : (
                <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <Building2 className="w-3 h-3" /> {practice.parentGroup}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="break-words">{practice.address}, {practice.town}, {practice.postcode}</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Phone className="w-4 h-4 shrink-0" />
                <a href={`tel:${practice.phone.replace(/\s/g, "")}`} className="hover:text-blue-600">
                  {practice.phone}
                </a>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Clock className="w-4 h-4 shrink-0" />
                Established {practice.openingSince}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {practice.features.map((f) => (
                <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right shrink-0 self-start sm:self-auto">
            <div className="flex items-center gap-1 justify-end mb-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-lg sm:text-xl font-bold">{practice.rating}</span>
            </div>
            <p className="text-xs text-gray-400 mb-2 whitespace-nowrap">{practice.reviewCount} reviews</p>
            <div className="flex items-center gap-1 justify-end">
              <Shield className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-blue-600 whitespace-nowrap">
                {practice.transparencyScore}/5 transparency
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="w-full sm:w-auto bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Get a Quote from this Practice
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Free enquiry · No booking fees · Practice responds directly
          </p>
        </div>
      </div>

      {/* Price List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Full Price List</h2>
          <p className="text-sm text-gray-500">
            Compared against the average across all {practicesCount} practices in our database
          </p>
        </div>

        <div className="divide-y divide-gray-50">
          {PRICE_KEYS.map((key) => {
            const price = practice.prices[key];
            if (price === undefined) return null;
            const avg = getAveragePrice(key);
            const diff = price - avg;
            const notesKey = `${key}Notes` as keyof typeof practice.prices;
            const notes = practice.prices[notesKey];

            return (
              <div key={key} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-medium text-gray-900">{PROCEDURE_LABELS[key]}</p>
                  {notes && typeof notes === "string" && (
                    <p className="text-xs text-gray-400 mt-0.5">{notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">£{price}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {diff < -3 ? (
                        <>
                          <TrendingDown className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-blue-600">£{Math.abs(diff)} below avg</span>
                        </>
                      ) : diff > 3 ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-500">£{diff} above avg</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-3 h-3 text-gray-300" />
                          <span className="text-xs text-gray-400">Near average</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400 hidden sm:block">
                    <p>Avg: £{avg}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ready to book an appointment?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Get a personalised quote from {practice.name} in seconds
        </p>
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Send Enquiry
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-900">Price Disclaimer</p>
          <p className="text-sm text-amber-700 mt-1">
            Prices shown are sourced from publicly available data and were last verified in April 2026.
            Actual costs may vary based on the animal&apos;s size, breed, age, and specific medical needs.
            Always confirm the final price directly with the practice before proceeding with any treatment.
          </p>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactPracticeModal
        practice={practice}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
