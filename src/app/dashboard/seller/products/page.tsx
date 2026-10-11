"use client";

import Head from "next/head";
import { Products } from "@/components/ui/seller-components/body-components/dashboard-section";

/**
 * Entry page for the seller products dashboard.
 * This file is intentionally thin: it sets the SEO metadata and then renders the main products dashboard component.
 */
export default function ProductsPage() {
  return (
    <>
      <Head>
        <title>Seller Dashboard | Products</title>
        <meta
          name="description"
          content="Manage your product listings. Add, edit, and organize inventory to keep your store updated."
        />
      </Head>
      {/* The main product management view contains the actual listing, draft controls, and product actions. */}
      <Products />
    </>
  );
}
