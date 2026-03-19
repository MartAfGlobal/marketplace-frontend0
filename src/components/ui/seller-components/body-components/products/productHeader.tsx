"use client";



import { Button } from "@/components/ui/Button/Button";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import AddIcon from "@/assets/Seller/addIcon.png";
import addIcon from "@/assets/icons/plus.svg"
import Image from "next/image";
import AddProductMethodModal from "./add-product-modal";
import { useState } from "react";

export default function ProductHeader() {
  // const [isOpen, setIsOpen] = useState(false)


  return (
    <div className="flex h-c48 items-center justify-between w-full px-3 relative">
      {/* Left: Overview + Search */}
      <div className="flex justify-between gap-c48 w-full ">
        <p className="text-c18 font-MontserratMedium">Product Management</p>
        
          <SearchInput showDropdown = {false}  className="max-w-138.5" placeholder="Search for anything" />
        
        {/* <Button onClick={()=> setIsOpen(true)} className="flex items-center justify-center gap-3 max-w-40">
          <Image src={addIcon} width={20} height={20} alt="adding" />
          <span>Add Product</span>
        </Button> */}
      </div>
      {/* <AddProductMethodModal isOpen={isOpen} onClose={()=>setIsOpen(false)}/> */}
    </div>
  );
}
