"use client"

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/account">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Privacy Policy</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Privacy Policy</h2>
          <p className="text-sm text-gray-500 mb-4">Last updated: December 2024</p>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Information We Collect</h3>
            <p className="text-gray-700 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support. This may include your name, email address, 
              phone number, and payment information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">How We Use Your Information</h3>
            <p className="text-gray-700 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, send you technical notices and support messages, and communicate 
              with you about products, services, and promotional offers.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Information Sharing</h3>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share your information 
              with service providers who assist us in operating our platform.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Data Security</h3>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at 
              privacy@martaf.com or through our customer support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 