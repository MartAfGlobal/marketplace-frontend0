import { CategoryButtonProps } from "@/types/global";
import Image from "next/image";

interface Props extends CategoryButtonProps {
  isSelected: boolean;
}

const CategoryButton: React.FC<Props> = ({ iconSrc, label, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 transition px-c32  h-[40px]  w-full overflow-x-hidden
        ${isSelected ? "bg-white " : "bg-transparent"}`}
    >
      {/* Render Image only if iconSrc exists */}
      {iconSrc ? (
        <Image
          height={18}
          width={24}
          src={iconSrc}
          alt={label}
          className="w-6 h-6 object-contain"
        />
      ) : (
        <div className="w-6 h-6" /> // placeholder for spacing if needed
      )}

      <span
        className={`text-xs font-MontserratSemiBold text-nowrap truncate
          ${isSelected ? "text-000000/64" : "text-000000"}`}
      >
        {label}
      </span>
    </button>
  );
};

export default CategoryButton;
