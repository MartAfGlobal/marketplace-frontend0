
import Image from "next/image";

import CategoryButton from "./CategoryButton";
import Tshirt from "@/assets/Icons2/TShirt.png"
import CassetteTape from "@/assets/Icons2/CassetteTape.png"
import ArmChair from "@/assets/Icons2/Armchair.png"
import PaintBrush from "@/assets/Icons2/PaintBrush.png"
import Books from "@/assets/Icons2/Books.png"
import Bag from "@/assets/Icons2/Bag.png"
import Car from "@/assets/Icons2/Car.png"
import BabyCarriage from "@/assets/Icons2/BabyCarriage.png"
import MaskHappy from "@/assets/Icons2/MaskHappy.png"


export default function CategoriesGrid() {
  const categories = [
    { iconSrc: Tshirt, label: "Fashion & Apparel" },
    { iconSrc: CassetteTape, label: "Electronics" },
    { iconSrc: ArmChair, label: " Home living" },
    { iconSrc: PaintBrush, label: " Health and beauty" },
    { iconSrc: Books, label: "Media & Education" },
    { iconSrc: Bag, label: " Travel & Luggage" },
    { iconSrc: Car, label: "Automotive & Industrial" },
    { iconSrc: BabyCarriage, label: "Kids & Babies" },
    { iconSrc: MaskHappy, label: "Culture-specific" },
  ];

  return (
    <div className="flex flex-col gap-2 bg-dual-gradient py-c32 w-full  max-w-c281 pl-c32">
      <h1 className="font-MontserratBold text-c20 pb-c24 text-000000">Categories</h1>
      {categories.map((cat, index) => (
        <CategoryButton
          key={index}
          iconSrc={cat.iconSrc}
          label={cat.label}
          onClick={() => console.log(`Clicked on ${cat.label}`)}
        />
      ))}
    </div>
  );
}
