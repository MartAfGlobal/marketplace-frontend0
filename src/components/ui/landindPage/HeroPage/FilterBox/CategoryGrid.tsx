import CategoryButton from "./CategoryButton";

export default function CategoriesGrid() {
  const categories = [
    { iconSrc: "/icons/TShirt.png", label: "Fashion & Apparel" },
    { iconSrc: "/icons/CassetteTape.png", label: "Electronics" },
    { iconSrc: "/icons/Armchair.png", label: " Home living" },
    { iconSrc: "/icons/PaintBrush.png", label: " Health and beauty" },
    { iconSrc: "/icons/Books.png", label: "Media & Education" },
    { iconSrc: "/icons/Bag.png", label: " Travel & Luggage" },
    { iconSrc: "/icons/Car.png", label: "Automotive & Industrial" },
    { iconSrc: "/icons/BabyCarriage.png", label: "Kids & Babies" },
    { iconSrc: "/icons/MaskHappy.png", label: "Culture-specific" },
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
