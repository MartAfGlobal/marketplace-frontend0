import Image from "next/image";
import Electricity from "@/assets/mobile/electricals.png"
import Clothing from "@/assets/mobile/clothing.png"
import Food from "@/assets/mobile/freshFood.jpg"
import Jewelry from "@/assets/mobile/jeweries.jpg"

export default function MobileCategory() {
  const category = [
    {
      icon: Electricity,
      name: "Electronics",
    },
    {
      icon: Clothing,
      name: "Clothes",
    },
    {
      icon: Food,
      name: "Fresh foods",
    },
    {
      icon: Jewelry,
      name: "Jewelries",
    },
  ];

  return (
    <div className="mt-c48 w-full px-6.75  bg-807c79 h-103">
      <div className="text-center">
        <h1 className="font-MontserratSemiBold text-161616 text-c16">
          Explore Our Categories
        </h1>
        <p className="font-MontserratSemiBold text-sm text-161616">
          Explore Our Categories Find the perfect products that suits your
          needs.
        </p>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 h-78 items-center bg-red-700">
  {category.map((cat) => (
    <div key={cat.name} className="h-25 w-40 relative">
      <Image
        src={cat.icon}
        alt={cat.name}
        width={160}
        height={100}
        className=""
      />
    </div>
  ))}
</div>

    </div>
  );
}
