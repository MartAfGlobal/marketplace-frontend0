"use client";

import ProductsInventorySection from "@/components/admin-components/reports/sections/ProductsInventorySection";

export default function ProductsInventoryReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Products &amp; Inventory</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Catalogue health, stock levels and sales performance down to individual variants.
        </p>
      </div>
      <ProductsInventorySection />
    </div>
  );
}
