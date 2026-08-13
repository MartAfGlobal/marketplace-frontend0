"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useHttp } from "@/hooks/use-http";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

/* ================= TYPES ================= */

export interface ExtraFields {
  default: string;
  label: string;
  name: string;
}

export interface Values {
  id: string;
  slug: string;
  value: string;
}

export interface EffectiveAttribute {
  attribute_id: string;
  attribute_name: string;
  attribute_slug: string;
  extra_fields: ExtraFields[];
  values: Values[];
}

export interface Category {
  id: string;
  name: string;
}

export interface SubCategory extends Category {
  effective_attributes: EffectiveAttribute[];
}

/* ================= GENERIC DROPDOWN ================= */

export function Dropdown<
  T extends { id: string; name?: string; title?: string },
>({
  label,
  selected,
  onSelect,
  fetchItems,
  items,
  loading,
  placeholder = "Select",
}: {
  label: string;
  selected?: string;
  onSelect: (item: T) => void;
  fetchItems: () => void;
  items: T[];
  loading: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleClick = () => {
    fetchItems();
    setOpen((p) => !p);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {label && <Label>{label}</Label>}
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full mt-2 items-center justify-between rounded-c8 border border-gray-300 bg-white px-4 h-12 text-[12px] font-MontserratMedium text-gray-900 focus:outline-none focus:border-ff715b hover:scale-100"
      >
        <span className={selected ? "text-gray-900" : "text-black/60"}>
          {selected || placeholder}
        </span>
        {loading ? (
          <LoadingSpinner color="border-ff715b" />
        ) : (
          <ChevronDown
            size={18}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      <AnimatePresence>
        {open && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full rounded-c8 border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto overflow-x-hidden"
          >
            {items.length > 0 ? (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className="block w-full pl-6 pr-3 py-2 text-left text-[12px] font-MontserratMedium text-gray-700 hover:bg-gray-100 hover:scale-100"
                >
                  {item.name || item.title}
                </button>
              ))
            ) : loading ? null : (
              <div className="p-3 text-gray-400 text-[12px] text-center">
                No items found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= CATEGORY DROPDOWN ================= */

export function CategoryDropdown({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (cat: Category) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { sendHttpRequest } = useHttp();

  const fetchCategories = () => {
    if (categories.length > 0) return;
    setLoading(true);
    sendHttpRequest({
      requestConfig: {
        url: "/products/public/categories/main/?page=1&page_size=20",
        method: "GET",
      },
      successRes: (res: any) => {
        const rawItems = res.data?.results || [];
        const processedItems = rawItems.map((item: any) => ({
          ...item,
          id: item.id || item._id || item.uuid,
        }));
        setCategories(processedItems);
        setLoading(false);
      },
    });
  };

  return (
    <Dropdown<Category>
      label="Category"
      selected={selected}
      onSelect={onSelect}
      fetchItems={fetchCategories}
      items={categories}
      loading={loading}
      placeholder="Select Category"
    />
  );
}

/* ================= SUBCATEGORY DROPDOWN ================= */

export function SubCategoryDropdown({
  category,
  selected,
  onSelect,
}: {
  category?: Category;
  selected?: string;
  onSelect: (sub: SubCategory) => void;
}) {
  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { sendHttpRequest } = useHttp();
  const token = useSelector((state: RootState) => state.token?.token);

  // ✅ Fetch subcategories automatically when category changes
  useEffect(() => {
    const catId = category?.id || (category as any)?._id || (category as any)?.uuid;
    console.log("SubCategoryDropdown useEffect fired. Category ID:", catId, "Token exists:", !!token);
    
    if (!catId || !token) {
      if (!catId) console.log("SubCategoryDropdown: No category ID found (check API response)");
      if (!token) console.log("SubCategoryDropdown: No token found in store");
      setSubs([]);
      return;
    }

    setLoading(true);
    sendHttpRequest({
      requestConfig: {
        url: `/products/manufacturer/categories/${catId}/subcategories/`,
        method: "GET",
        token,
      },
      successRes: (res: any) => {
        console.log("Subcategory API Success:", res);
        setSubs(res.data?.subcategories || []);
        setLoading(false);
      },
      errorRes: (err: any) => {
        console.error("Subcategory API Error:", err);
        setLoading(false);
      }
    });

    // We removed the automatic onSelect(null as any) because the parent (CategoryDropdown) 
    // already handles resetting the subcategory when the user manually selects a new category.
    // Firing it here wipes out the autofill during initial mount.
  }, [category, token]);

  return category ? (
    <Dropdown<SubCategory>
      label="Subcategory"
      selected={selected}
      onSelect={onSelect}
      fetchItems={() => {}} // no need to fetch on click anymore
      items={subs}
      loading={loading}
      placeholder="Select Subcategory"
    />
  ) : (
    <div>
      <Label>Subcategory</Label>
      <button
        disabled
        className="flex w-full mt-2 items-center justify-between rounded-c8 border border-gray-300 bg-gray-50 px-4 py-2.5 text-[12px] font-MontserratMedium text-gray-400 cursor-not-allowed hover:scale-100"
      >
        Please select a category first
        <ChevronDown size={18} className="text-gray-400" />
      </button>
    </div>
  );
}

/* ================= ATTRIBUTES SECTION ================= */

export function AttributesSection({
  attributes,
  values,
  onChange,
}: {
  attributes: EffectiveAttribute[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
      {attributes.map((attr) => (
        <div key={attr.attribute_id}>
          <Label>{attr.attribute_name}</Label>

          {attr.values.length > 0 ? (
            <Dropdown<Values>
              label=""
              selected={values[attr.attribute_slug]}
              onSelect={(v) => onChange(attr.attribute_slug, v.value)}
              fetchItems={() => {}}
              items={attr.values.map((v) => ({ ...v, name: v.value }))}
              loading={false}
              placeholder={attr.attribute_name}
            /> 
          ) : (
            <Input
              type="text"
              className=""
              placeholder={`Enter ${attr.attribute_name}`}
              value={values[attr.attribute_slug] || ""}
              onChange={(e) => onChange(attr.attribute_slug, e.target.value)}
            />
          )}

          {/* {attr.extra_fields.map((extra) => (
            <div key={extra.name} className="mt-6">
              <Label>{extra.label}</Label>
              <input
                className="w-full rounded-c8 border border-gray-300 bg-white px-4 py-2.5 text-[12px] font-MontserratMedium focus:outline-none focus:border-ff715b mt-2"
                defaultValue={extra.default}
                onChange={(e) => onChange(extra.name, e.target.value)}
              />
            </div>
          ))} */}
        </div>
      ))}
    </div>
  );
}
