"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { toast } from "sonner";

interface InvestorFormProps {
  onSuccess: () => void;
}

interface ApiItem {
  id: string;
  name: string;
}

export default function InvestorForm({ onSuccess }: InvestorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<ApiItem[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    organisationName: "",
    investorType: "Angel Investor",
    countryId: "",
    interest: ""
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("/website/countries/");
        const countryData = Array.isArray(response.data) ? response.data : response.data.results || [];
        setCountries(countryData);
      } catch (e) {
        console.error("Failed to fetch countries", e);
      }
    };
    fetchCountries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      full_name: formData.fullName,
      work_email: formData.workEmail,
      organisation_name: formData.organisationName,
      investor_type: formData.investorType,
      investor_type_other: "",
      country: formData.countryId,
      interest: formData.interest || "Excited by the African e-commerce opportunity."
    };

    try {
      await axios.post("/website/waitlist/investor/", payload);
      toast.success("Welcome to the waitlist!");
      onSuccess();
    } catch (err: any) {
      console.error("Investor waitlist error", err);
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
            placeholder="Michael Obi" 
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="h-12 rounded-xl border-efefef bg-fafafa focus:bg-white" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Work Email</label>
          <Input 
            required 
            type="email" 
            placeholder="michael@fund.com" 
            value={formData.workEmail}
            onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
            className="h-12 rounded-xl border-efefef bg-fafafa focus:bg-white" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Organization Name</label>
          <Input 
            required 
            placeholder="Pan-Africa Capital" 
            value={formData.organisationName}
            onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
            className="h-12 rounded-xl border-efefef bg-fafafa focus:bg-white" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Investor Type</label>
          <DropdownInput
            placeholder="Select type"
            options={["Angel Investor", "VC Fund", "Family Office", "Corporate Investor", "Other"]}
            value={formData.investorType}
            onChange={(val) => setFormData({ ...formData, investorType: val })}
          />
        </div>
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
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-MontserratBold text-6a0dad uppercase tracking-widest">Your Interest</label>
        <Input 
          placeholder="e.g. Excited by the African e-commerce opportunity." 
          value={formData.interest}
          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
          className="h-12 rounded-xl border-efefef bg-fafafa focus:bg-white" 
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || !formData.countryId} 
        className="w-full h-14 rounded-xl bg-6a0dad hover:bg-[#5a0dad] text-white font-MontserratBold text-base shadow-lg shadow-6a0dad/20 transition-all active:scale-[0.98]"
      >
        {isLoading ? "Processing..." : "Complete Waitlist Signup"}
      </Button>
    </form>
  );
}
