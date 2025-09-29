import { CategoryButtonProps } from "@/types/global";
import Image from "next/image";

interface Props extends CategoryButtonProps {
  isSelected: boolean;
}

const CategoryButton: React.FC<Props> = ({ iconSrc, label, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 transition pl-c32 h-[40px] px-4 w-full
        ${isSelected ? "bg-white" : "bg-transparent"}`}
    >
      <Image
        height={16}
        width={16}
        src={iconSrc}
        alt={label}
        className="w-6 h-6 object-contain"
      />
      <span
        className={`text-sm font-MontserratBold 
          ${isSelected ? "text-black" : "text-gray-700"}`}
      >
        {label}
      </span>
    </button>
  );
};

export default CategoryButton;
