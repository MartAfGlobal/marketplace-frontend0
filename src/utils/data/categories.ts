import Tshirt from "@/assets/Icons2/TShirt.png";
import CassetteTape from "@/assets/Icons2/CassetteTape.png";
import ArmChair from "@/assets/Icons2/Armchair.png";
import PaintBrush from "@/assets/Icons2/PaintBrush.png";
import Books from "@/assets/Icons2/Books.png";
import Bag from "@/assets/Icons2/Bag.png";
import Car from "@/assets/Icons2/Car.png";
import BabyCarriage from "@/assets/Icons2/BabyCarriage.png";
import MaskHappy from "@/assets/Icons2/MaskHappy.png";

export const categories = [
  {
    iconSrc: Tshirt,
    label: "Fashion & Apparel",
    subcategories: [
      { title: "Men's Wear", image: Tshirt },
      { title: "Women's Wear", image: Tshirt },
      { title: "Shoes", image: Tshirt },
      { title: "Accessories", image: Tshirt },
    ],
  },
  {
    iconSrc: CassetteTape,
    label: "Electronics",
    subcategories: [
      { title: "Phones", image: CassetteTape },
      { title: "Laptops", image: CassetteTape },
      { title: "TVs", image: CassetteTape },
      { title: "Audio", image: CassetteTape },
    ],
  },
  {
    iconSrc: ArmChair,
    label: "Home Living",
    subcategories: [
      { title: "Furniture", image: ArmChair },
      { title: "Decor", image: ArmChair },
      { title: "Lighting", image: ArmChair },
    ],
  },
  {
    iconSrc: PaintBrush,
    label: "Health & Beauty",
    subcategories: [
      { title: "Makeup", image: PaintBrush },
      { title: "Skincare", image: PaintBrush },
      { title: "Hair Care", image: PaintBrush },
    ],
  },
  {
    iconSrc: Books,
    label: "Media & Education",
    subcategories: [
      { title: "Books", image: Books },
      { title: "Courses", image: Books },
      { title: "Music", image: Books },
    ],
  },
  {
    iconSrc: Bag,
    label: "Travel & Luggage",
    subcategories: [
      { title: "Suitcases", image: Bag },
      { title: "Backpacks", image: Bag },
    ],
  },
  {
    iconSrc: Car,
    label: "Automotive & Industrial",
    subcategories: [
      { title: "Cars", image: Car },
      { title: "Parts", image: Car },
    ],
  },
  {
    iconSrc: BabyCarriage,
    label: "Kids & Babies",
    subcategories: [
      { title: "Toys", image: BabyCarriage },
      { title: "Baby Gear", image: BabyCarriage },
    ],
  },
  {
    iconSrc: MaskHappy,
    label: "Culture-specific",
    subcategories: [
      { title: "Traditional Wear", image: MaskHappy },
      { title: "Art", image: MaskHappy },
    ],
  },
];
