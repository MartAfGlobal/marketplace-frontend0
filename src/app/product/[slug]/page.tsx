import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

type ProductImageData =
  | string
  | {
      url?: string;
      large?: string;
      medium?: string;
      thumbnail?: string;
    };

type ProductMetadataData = {
  name?: string;
  description?: string;
  main_image?: ProductImageData;
  images?: ProductImageData[];
};

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const getImageUrl = (image?: ProductImageData): string | undefined => {
  const imagePath =
    typeof image === "string"
      ? image
      : image?.url || image?.large || image?.medium || image?.thumbnail;

  if (!imagePath) return undefined;

  try {
    return new URL(imagePath, process.env.NEXT_PUBLIC_BACKEND_URL).toString();
  } catch {
    return undefined;
  }
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    return { title: "Product | MartAf" };
  }

  try {
    const response = await fetch(
      `${backendUrl.replace(/\/$/, "")}/products/public/products/${encodeURIComponent(slug)}/`,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      return { title: "Product | MartAf" };
    }

    const product = (await response.json()) as ProductMetadataData;
    const imageUrl = getImageUrl(product.main_image) || getImageUrl(product.images?.[0]);
    const title = product.name ? `${product.name} | MartAf` : "Product | MartAf";
    const description = product.description || `Shop ${product.name || "this product"} on MartAf.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        ...(imageUrl ? { images: [{ url: imageUrl, alt: product.name || "Product" }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      },
    };
  } catch {
    return { title: "Product | MartAf" };
  }
}

export default function ProductPage() {
  return <ProductPageClient />;
}
