"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { toast } from "sonner";

export default function CreateAttributePage() {
  const router = useRouter();
  const [attributeName, setAttributeName] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddValue = () => {
    const val = currentValue.trim();
    if (val && !values.includes(val)) {
      setValues([...values, val]);
      setCurrentValue("");
    }
  };

  const handleRemoveValue = (valToRemove: string) => {
    setValues(values.filter((v) => v !== valToRemove));
  };

  const handleCreate = () => {
    if (!attributeName.trim()) {
      toast.error("Please enter an attribute name.");
      return;
    }
    // if (values.length === 0) {
    //   toast.error("Please enter at least one value.");
    //   return;
    // }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Attribute created successfully!");
      setIsSubmitting(false);
      router.push("/dashboard/admin/categories");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button & Title */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 transition-colors"
        >
          <span className="h-6 w-6 flex itemes-center justify-center">
            <ChevronLeft className="w-5 h-5 text-000000" />
          </span>
          <h1 className="text-c18 font-MontserratMedium">
            Basic Attribute Information
          </h1>
        </button>
      </div>

      {/* Main Form Box */}
      <div className="bg-white p-6 rounded-c16">
        <h2 className="text-4 font-MontserratSemiBold mb-6">
          Basic Attribute Information
        </h2>

        <div className="space-y-6">
          <div className="space-y-2 ">
            <Label>Name of Attribute</Label>
            <Input
              placeholder="e.g. Colour"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
            />
          </div>

          <div className=" w-full flex gap-6 lg:gap-46.5 items-end ">
            <div className=" max-w-200 w-full ">
              <Label>Enter Value</Label>
              <Input
                placeholder="Enter value"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddValue();
                  }
                }}
              />
            </div>
            <button
              disabled={!attributeName.trim() || !currentValue.trim()}
              onClick={handleAddValue}
              className="h-11 px-6 w-13.5 flex items-center justify-center bg-[#ff715b] text-white text-sm rounded-c8 font-MontserratSemiBold hover:opacity-90 transition-opacity disabled:bg-000000/12 disabled:cursor-not-allowed"
            >
              OK
            </button>
          </div>

          {/* Display Values */}
          {values.length > 0 && (
            <div className="flex flex-wrap gap-6 ">
              {values.map((val) => (
                <div
                  key={val}
                  className="flex items-center gap-5.75 px-3 py-1.5 h-8 bg-947fff/10 rounded-c8 w-25 justify-center text-sm font-MontserratMedium text-gray-700"
                >
                  <span className="w-full max-w-10 truncate ">{val}</span>
                  
                  <button
                    onClick={() => handleRemoveValue(val)}
                    className="text-ffffff bg-000000/44 flex-shrink-0 rounded-full h-4 w-4 flex justify-center items-center  hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-50 justify-end border-t border-gray-100">
          <Button
            variant="secondary"
            className="w-32"
            onClick={() => router.push("/dashboard/admin/categories")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="w-48"
            onClick={handleCreate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Attribute"}
          </Button>
        </div>
      </div>
    </div>
  );
}
