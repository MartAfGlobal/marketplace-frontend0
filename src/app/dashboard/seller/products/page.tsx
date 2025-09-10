"use client";

import Head from "next/head";
import { Products } from "@/components/ui/seller-components/body-components/dashboard-section";

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
      <Products />
    </>
  );
}
