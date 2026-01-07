import Image from "next/image";
import Link from "next/link";
import NavIcon from "@/assets/icons/navIcon.svg";


interface DetailPageNavbarProps {
  categoryName?: string;
  subCategoryName?: string;
  productName?: string;
  categorySlug?: string;
  subCategorySlug?: string;
}

export default function DetailPageNavbar({ categoryName, subCategoryName, productName, categorySlug, subCategorySlug }: DetailPageNavbarProps) {
  return (
     <div className="py-8 flex items-center gap-1 text-sm font-semibold">
        <Link href="/" className="opacity-40">
          Home
        </Link>

        <Image src={NavIcon} alt="nav" width={16} height={16}  className="w-4 h-4"/>

        {/* Category link */}
        <Link
          href={`/categories/${categorySlug}`}
          className="capitalize text-161616 hover:underline"
        >
          {categoryName}
        </Link>

        <Image src={NavIcon} alt="nav" width={16} height={16} className="w-4 h-4"/>
        <Link
          href={`/categories/${categorySlug}/${subCategorySlug}`}
          className="capitalize text-161616 hover:underline"
        >
          {subCategoryName}
        </Link>
        <Image src={NavIcon} alt="nav" width={16} height={16}className="w-4 h-4" />

        <span className="capitalize">{productName}</span>
      </div>
  );
}
