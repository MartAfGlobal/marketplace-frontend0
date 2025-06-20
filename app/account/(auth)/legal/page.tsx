"use client"

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/account">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Legal Information</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Legal Information</h2>
          <p className="text-sm text-gray-500 mb-4">Last updated: December 2024</p>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Terms of Service</h3>
            <p className="text-gray-700 leading-relaxed">
              By using MARTAF, you agree to our terms of service. These terms govern your use of our 
              platform and outline the rights and responsibilities of both users and MARTAF.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Intellectual Property</h3>
            <p className="text-gray-700 leading-relaxed">
              All content on MARTAF, including logos, text, graphics, and software, is the property of 
              MARTAF or its licensors and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Conduct</h3>
            <p className="text-gray-700 leading-relaxed">
              Users must not engage in any illegal activities, violate any laws, or infringe on the rights 
              of others while using our platform. We reserve the right to suspend or terminate accounts 
              that violate these guidelines.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              MARTAF shall not be liable for any indirect, incidental, special, or consequential damages 
              arising from your use of our platform. Our liability is limited to the maximum extent 
              permitted by law.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Governing Law</h3>
            <p className="text-gray-700 leading-relaxed">
              These terms are governed by the laws of Nigeria. Any disputes arising from your use of 
              MARTAF will be resolved in the courts of Nigeria.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
            <p className="text-gray-700 leading-relaxed">
              For legal inquiries, please contact us at legal@martaf.com or through our official 
              communication channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 