"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { toast } from "sonner";

interface BuyerFormProps {
  onSuccess: () => void;
}

interface ApiItem {
  id: string;
  name: string;
}

export default function BuyerForm({ onSuccess }: BuyerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ApiItem[]>([]);
  const [countries, setCountries] = useState<ApiItem[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryId: "",
    categoryId: "",
    lookingToBuy: "Clothes",
    frequency: "Monthly",
    purpose: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, countryRes] = await Promise.all([
          axios.get("/website/categories/"),
          axios.get("/website/countries/")
        ]);
        
        console.log("[BuyerForm] categories response:", catRes.data);
        const catData = Array.isArray(catRes.data) ? catRes.data : catRes.data?.results || [];
        setCategories(catData);
        
        const countryData = Array.isArray(countryRes.data) ? countryRes.data : countryRes.data?.results || [];
        setCountries(countryData);
      } catch (e) {
        console.error("Failed to fetch form data", e);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      country: formData.countryId,
      looking_to_buy: formData.lookingToBuy,
      looking_to_buy_other: "",
      shopping_frequency: formData.frequency,
      preferred_categories: [formData.categoryId],
      purpose: formData.purpose || "Find quality African goods."
    };

    try {
      await axios.post("/website/waitlist/buyer/", payload);
      toast.success("Welcome to the waitlist!");
      onSuccess();
    } catch (err: any) {
      console.error("Buyer waitlist error", err);
      toast.error(err.response?.data?.message || "Failed to join waitlist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Full Name</label>
          <Input 
            required 
            placeholder="John Smith" 
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="h-12 rounded-xl border-efefef bg-fafafa focus:bg-white" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Email Address</label>
          <Input 
            required 
            type="email" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-12 rounded-xl border-efefef bg-fafafa focus:bg-white" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Country</label>
          <DropdownInput
            placeholder="Select country"
            options={countries.map(c => c.name)}
            value={countries.find(c => c.id === formData.countryId)?.name || ""}
            onChange={(name) => {
              const id = countries.find(c => c.name === name)?.id || "";
              setFormData({ ...formData, countryId: id });
            }}
            emptyState="No countries available"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Preferred Category</label>
          <DropdownInput
            placeholder="Select category"
            options={categories.map(c => c.name)}
            value={categories.find(c => c.id === formData.categoryId)?.name || ""}
            onChange={(name) => {
              const id = categories.find(c => c.name === name)?.id || "";
              setFormData({ ...formData, categoryId: id });
            }}
            emptyState="No categories available"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Shopping Frequency</label>
          <DropdownInput
            placeholder="Select frequency"
            options={["Weekly", "Monthly", "Quarterly", "Yearly"]}
            value={formData.frequency}
            onChange={(val) => setFormData({ ...formData, frequency: val })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">What are you looking for?</label>
          <Input 
            placeholder="e.g. Handmade Clothes" 
            value={formData.lookingToBuy}
            onChange={(e) => setFormData({ ...formData, lookingToBuy: e.target.value })}
            className="h-12 rounded-xl border-efefef bg-fafafa focus:bg-white" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Your Purpose</label>
        <Input 
          placeholder="e.g. Discover unique African designs" 
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          className="h-12 rounded-xl border-efefef bg-fafafa focus:bg-white" 
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || !formData.countryId || !formData.categoryId} 
        className="w-full h-14 rounded-xl bg-6a0dad hover:bg-[#5a0dad] text-white font-MontserratBold text-base shadow-lg shadow-6a0dad/20 transition-all active:scale-[0.98]"
      >
        {isLoading ? "Processing..." : "Complete Waitlist Signup"}
      </Button>
    </form>
  );
}
