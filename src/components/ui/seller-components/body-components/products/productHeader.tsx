"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import SellerSearch from "../over-view/Filter-components/SellerSearch";

import { SellerMobileHeader } from "@/components/ui/seller-components/header-components/SellerMobileHeader";

export default function ProductHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <SellerMobileHeader 
        title="Product Management"
        showBackButton={false}
        rightElement={
          <div className="hidden md:block w-auto">
            <SellerSearch 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for anything" 
              alwaysOpen={true}
            />
          </div>
        }
      />
      
      <div className="md:hidden px-4 mt-4">
        <SellerSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for anything" 
          alwaysOpen={true}
        />
      </div>
    </>
  );
}
