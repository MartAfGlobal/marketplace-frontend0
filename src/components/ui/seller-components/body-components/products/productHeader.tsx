"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import SellerSearch from "../over-view/Filter-components/SellerSearch";

export default function ProductHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-auto md:h-c48 md:mt-0 items-center justify-between w-full px-3 relative">
      {/* Left: Overview + Search */}
      <div className="flex flex-col-reverse md:flex-row md:justify-between gap-6 md:gap-c48 w-full items-start md:items-center">
        <p className="md:text-c18  text-base font-MontserratMedium whitespace-nowrap">Product Management</p>
        
          <SellerSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for anything" 
            alwaysOpen={true}
          />
        
        {/* <Button onClick={()=> setIsOpen(true)} className="flex items-center justify-center gap-3 max-w-40">
          <Image src={addIcon} width={20} height={20} alt="adding" />
          <span>Add Product</span>
        </Button> */}
      </div>
      {/* <AddProductMethodModal isOpen={isOpen} onClose={()=>setIsOpen(false)}/> */}
    </div>
  );
}
