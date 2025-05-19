"use client"
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Search, Globe } from "lucide-react";

const countries = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "US", name: "USA", flag: "🇺🇸" },
];

const Header = () => {
  const [selectedCountry, setSelectedCountry] = React.useState(countries[0]);

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-[#6C1EB1] text-white">
      {/* Logo */}
      <div className="font-bold text-xl tracking-wide flex items-center gap-2">MARTAF</div>
      {/* Search */}
      <div className="flex-1 flex justify-center px-6">
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <Input
            className="!bg-white pl-10 pr-4 py-2 rounded-md w-full text-black placeholder:text-gray-500 border-none shadow-none focus:outline-none focus:ring-2 focus:ring-[#6C1EB1]"
            placeholder="Search for products"
            type="text"
          />
        </div>
      </div>
      {/* Country Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-white px-2 flex items-center gap-1">
            <span className="hidden sm:inline">EN</span>
            <span className="ml-2 flex items-center justify-center w-6 h-6 rounded-full bg-white">
              <Globe className="w-4 h-4 text-[#6C1EB1]" />
            </span>
            <span className="ml-1">▼</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white text-black">
          {countries.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onClick={() => setSelectedCountry(country)}
              className="flex items-center gap-2"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-lg">
                {country.flag}
              </span>
              <span>{country.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Login/Signup */}
      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" className="text-white">Login</Button>
        <div className="h-6 w-px bg-white mx-2" />
        <Button className="border-white border-1 bg-none text-white bg-[#6C1EB1]">Sign up</Button>
      </div>
    </header>
  );
};

export default Header; 