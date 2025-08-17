import Image from "next/image";
import SearchIcon from "@/assets/headerIcon/searchIcon.svg";

interface SearchInputProps {
  placeholder?: string; 
   className?: string;// optional prop with default
}

export default function SearchInput({  placeholder = "Search for products",
  className = ""}: SearchInputProps) {
  return (
    <div className={`relative w-full md:max-w-[464px] h-12 bg-ffffff shadow-customW rounded-c8 ${className}`}>
      
      <Image
        src={SearchIcon}
        width={20}
        height={20}
        alt="SearchIcon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full rounded-c8 pl-10 pr-4 py-2 h-full font-MontserratNormal text-000000 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
}
