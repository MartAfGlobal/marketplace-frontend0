"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Countries data with flags
const countries = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "CG", name: "Republic of the Congo", flag: "🇨🇬" },
  { code: "CD", name: "Democratic Republic of the Congo", flag: "🇨🇩" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "TL", name: "East Timor", flag: "🇹🇱" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "MO", name: "Macau", flag: "🇲🇴" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "KP", name: "North Korea", flag: "🇰🇵" },
];

export default function AddShippingAddressPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<typeof countries[0] | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country: country.name
    }));
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'address', 'city', 'state', 'postalCode', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields", {
        description: "All fields are required to save your address.",
        duration: 3000,
      });
      return;
    }
    
    // Handle form submission
    toast.success("Address saved successfully! ✅", {
      description: "Your new shipping address has been added.",
      duration: 3000,
    });
    console.log('Form submitted:', formData);
    
    // In a real app, you would navigate back after successful submission
    // router.push('/shipping-addresses');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b bg-white">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="p-2 flex-shrink-0"
        >
          <Link href="/account/shipping-addresses">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-black flex-1 text-center">Add new address</h1>
        <div className="w-10 flex-shrink-0"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First name
          </Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2AE8] focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last name
          </Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2AE8] focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
            Phone number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2AE8] focus:border-transparent"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Address
          </Label>
          <Input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2AE8] focus:border-transparent"
            placeholder="Enter your address"
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-gray-700">
            City
          </Label>
          <Input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2AE8] focus:border-transparent"
            placeholder="Enter your city"
          />
        </div>

        {/* State/Province */}
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium text-gray-700">
            State/Province
          </Label>
          <Input
            id="state"
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2AE8] focus:border-transparent"
            placeholder="Enter your state or province"
          />
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
            Postal code
          </Label>
          <Input
            id="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C2AE8] focus:border-transparent"
            placeholder="Enter your postal code"
          />
        </div>

        {/* Country/Region */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Country/Region
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between p-3 h-auto border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {selectedCountry ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span>{selectedCountry.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select country/region</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search country..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.name}
                        onSelect={() => handleCountrySelect(country)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span>{country.name}</span>
                        <Check
                          className={`ml-auto h-4 w-4 ${
                            selectedCountry?.code === country.code ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            className="w-full bg-[#FF715B] hover:bg-[#ff4d2d] text-white py-4 text-lg font-semibold rounded-lg h-14"
          >
            Save address
          </Button>
        </div>
      </form>
    </div>
  );
} 