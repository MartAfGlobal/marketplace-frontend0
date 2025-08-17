import { useState } from "react";
import {CategoryButtonProps} from "@/types/global"
import Image from "next/image";

const CategoryButton: React.FC<CategoryButtonProps> = ({ iconSrc, label, onClick }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    onClick?.(); // call parent click handler too
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-4 transition w-fit h-[40px] "
    >
      <Image  height={16} width={16} src={iconSrc} alt={label} className="w-6 h-6 object-contain" />
      <span className="text-sm text-000000  font-MontserratBold">{label}</span>
    </button>
  );
};

export default CategoryButton;
