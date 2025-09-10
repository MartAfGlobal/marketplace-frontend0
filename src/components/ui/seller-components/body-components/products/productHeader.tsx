"use client";



import SearchInput from "@/components/ui/landindPage/Header/SearchInput";

export default function ProductHeader() {


  return (
    <div className="flex h-c48 items-center justify-between w-full px-3 relative">
      {/* Left: Overview + Search */}
      <div className="flex items-center gap-c48 w-full max-w-160">
        <p className="text-c18 font-MontserratMedium">Product Management</p>
        <div className="w-full max-w-87">
          <SearchInput placeholder="Search for anything" />
        </div>
      </div>
    </div>
  );
}
