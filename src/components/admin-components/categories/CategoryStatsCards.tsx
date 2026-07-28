import Image from "next/image";
import TotalCategoryIcon from "@/assets/admin/totalCategoryIcon.svg";
import ActiveCategoryIcon from "@/assets/admin/activeCategoryIcon.svg";
import TotalSubCategoryIcon from "@/assets/admin/totalSubCategoryIcon.svg";
import HiddenCategoryIcon from "@/assets/admin/hiddenCategory.svg";

interface CategoryStatsCardsProps {
  totalCategories: number;
  activeCategoriesCount: number;
  totalSubcategories: number;
  hiddenCount: number;
}

export default function CategoryStatsCards({
  totalCategories,
  activeCategoriesCount,
  totalSubcategories,
  hiddenCount,
}: CategoryStatsCardsProps) {
  const cards = [
    {
      label: "Total Categories",
      value: totalCategories,
      icon: TotalCategoryIcon,
      iconBg: "bg-947fff/10",
      iconW: 20.25,
      iconH: 18,
    },
    {
      label: "Active Categories",
      value: activeCategoriesCount,
      icon: ActiveCategoryIcon,
      iconBg: "bg-28a745/12",
      iconW: 16.5,
      iconH: 21,
    },
    {
      label: "Total Subcategories",
      value: totalSubcategories,
      icon: TotalSubCategoryIcon,
      iconBg: "bg-ffaco6/12",
      iconW: 20.25,
      iconH: 18,
    },
    {
      label: "Hidden",
      value: hiddenCount,
      icon: HiddenCategoryIcon,
      iconBg: "bg-red-50",
      iconW: 19.5,
      iconH: 19.5,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white w-full max-w-64.5 h-36 rounded-[16px] px-6 py-8 flex flex-col gap-4 justify-center"
        >
          <div className="flex justify-between">
            <p className="text-base font-MontserratNormal">{card.label}</p>
            <div
              className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center`}
            >
              <Image
                src={card.icon}
                alt={card.label}
                width={card.iconW}
                height={card.iconH}
              />
            </div>
          </div>
          <p className="text-c32 font-MontserratNormal">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
