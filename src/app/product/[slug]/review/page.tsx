"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Caretleft from "@/assets/mobile/CaretLeft.png";
import MoreDetailedPage from "@/components/ui/DetailPage/MoreDetailedPage";
import { dummyProducts } from "@/store/data/products"; // <-- adjust path
import { Product } from "@/types/global";

export default function ReviewsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  // Find product from your data using slug
  const product: Product | undefined = dummyProducts.find(
    (p) => p.slug === slug
  );

  if (!product) {
    return (
      <div className="py-5 px-6">
        <button onClick={() => router.back()}>
          <Image src={Caretleft} alt="back" width={24} height={24} />
        </button>
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="py-5 px-6">
      <div className="flex gap-3 items-center mb-4">
        <button onClick={() => router.back()}>
          <Image src={Caretleft} alt="back" width={24} height={24} />
        </button>
        <h1 className="font-MontserratSemiBold text-base">Ratings & Reviews</h1>
      </div>

      <MoreDetailedPage product={product} />
    </div>
  );
}
