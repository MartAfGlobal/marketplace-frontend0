"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { toast } from "sonner";

interface SellerFormProps {
  onSuccess: () => void;
}

interface ApiItem {
  id: string;
  name: string;
}

export default function SellerForm({ onSuccess }: SellerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [managedCategories, setManagedCategories] = useState<ApiItem[]>([]);
  const [countries, setCountries] = useState<ApiItem[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryId: "",
    categoryId: "",
    businessType: "registered_company",
    businessStage: "Early Stage",
    salesChannels: "Instagram",
    purpose: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, countryRes] = await Promise.all([
          axios.get("/website/categories/"),
          axios.get("/website/countries/")
        ]);
        
        const catData = Array.isArray(catRes.data) ? catRes.data : catRes.data?.results || [];
        setManagedCategories(catData);
        
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
      business_type: formData.businessType,
      product_category: formData.categoryId,
      business_stage: formData.businessStage,
      current_sales_channels: [formData.salesChannels],
      purpose: formData.purpose || "Join the Martaf Seller community."
    };

    try {
      await axios.post("/website/waitlist/seller/", payload);
      toast.success("Welcome to the waitlist!");
      onSuccess();
    } catch (err: any) {
      console.error("Seller waitlist error", err);
      toast.error(err.response?.data?.message || "Failed to join waitlist. Please check your details.");
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
            placeholder="Jane Doe"
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
            placeholder="jane@example.com"
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
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Product Category</label>
          <DropdownInput
            placeholder="Select category"
            options={managedCategories.map(c => c.name)}
            value={managedCategories.find(c => c.id === formData.categoryId)?.name || ""}
            onChange={(name) => {
              const id = managedCategories.find(c => c.name === name)?.id || "";
              setFormData({ ...formData, categoryId: id });
            }}
            emptyState="No categories available"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Business Stage</label>
          <DropdownInput
            placeholder="Select stage"
            options={["Idea Phase", "Early Stage", "Growth Stage", "Established"]}
            value={formData.businessStage}
            onChange={(val) => setFormData({ ...formData, businessStage: val })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Primary Sales Channel</label>
          <DropdownInput
            placeholder="Select channel"
            options={["Instagram", "Website", "Physical Store", "Marketplace", "Other"]}
            value={formData.salesChannels}
            onChange={(val) => setFormData({ ...formData, salesChannels: val })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Business Type</label>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Registered Company", value: "registered_company" },
            { label: "Individual Seller", value: "individual_seller" }
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, businessType: type.value })}
              className={`px-6 py-2.5 rounded-xl text-xs font-MontserratSemiBold transition-all border ${
                formData.businessType === type.value
                  ? "bg-6a0dad text-white border-6a0dad shadow-md"
                  : "bg-fafafa text-gray-400 border-efefef hover:border-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Your Purpose</label>
        <Input
          placeholder="e.g. Expand my reach across Africa."
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
