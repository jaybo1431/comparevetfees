"use client";

import { useState } from "react";
import { X, Phone, Mail, MessageSquare, Send } from "lucide-react";
import { Practice } from "@/data/practices";

interface ContactPracticeModalProps {
  practice: Practice;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactPracticeModal({ practice, isOpen, onClose }: ContactPracticeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    petType: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          practiceSlug: practice.slug,
          practiceName: practice.name,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            petType: "",
            service: "",
            message: "",
          });
          setSubmitStatus("idle");
          onClose();
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Get a Quote</h2>
              <p className="text-sm text-gray-500 mt-1">
                Send your enquiry to {practice.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="John Smith"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="07123 456789"
                />
              </div>
            </div>

            {/* Pet Type & Service */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="petType" className="block text-sm font-medium text-gray-900 mb-1">
                  Pet Type *
                </label>
                <select
                  id="petType"
                  required
                  value={formData.petType}
                  onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                >
                  <option value="">Select...</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-900 mb-1">
                  Service Needed *
                </label>
                <select
                  id="service"
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                >
                  <option value="">Select...</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Neutering">Neutering/Spaying</option>
                  <option value="Dental">Dental Work</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none"
                placeholder="Any additional details about your enquiry..."
              />
            </div>

            {/* Submit Status */}
            {submitStatus === "success" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <p className="text-sm text-emerald-800 font-medium">
                  Your enquiry has been sent! The practice will contact you soon.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Failed to send enquiry. Please try again or contact the practice directly.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Enquiry
                  </>
                )}
              </button>
            </div>

            {/* Direct Contact Info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Or contact the practice directly:</p>
              <div className="space-y-2">
                <a
                  href={`tel:${practice.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-600 transition"
                >
                  <Phone className="w-4 h-4" />
                  {practice.phone}
                </a>
                {practice.website && (
                  <a
                    href={practice.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-emerald-600 transition"
                  >
                    <Mail className="w-4 h-4" />
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
