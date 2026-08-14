"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { Dropdown } from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";

export interface AttributeCategoryData {
  id: string;
  name: string;
  values: string[];
}

export interface AttributeDetailData {
  id: string;
  name: string;
  isActive: boolean;
  dateCreated: string;
  lastModified: string;
  values: string[];
  categories?: AttributeCategoryData[];
}

interface AttributeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  attribute: AttributeDetailData | null;
  isLoading?: boolean;
  onEdit?: (attribute: AttributeDetailData, selectedCategoryId?: string, categoryValues?: string[]) => void;
  onDeleteRequest?: (id: string, name: string) => void;
  onHideToggled?: (id: string, newIsActive: boolean, name: string) => void;
}

export default function AttributeDetailsModal({
  isOpen,
  onClose,
  attribute,
  isLoading = false,
  onEdit,
  onDeleteRequest,
  onHideToggled,
}: AttributeDetailsModalProps) {
  const [isActive, setIsActive] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Category state
  const [categories, setCategories] = useState<AttributeCategoryData[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [categoryValues, setCategoryValues] = useState<string[]>([]);

  const token = useSelector((state: RootState) => state.token?.token);
  const { deleteAdminAttribute, updateAdminAttribute, fetchAdminAttributeCategories } = AdminDetails();

  // Sync local active state whenever the attribute prop changes
  useEffect(() => {
    if (attribute) {
      setIsActive(attribute.isActive);
      setCategoryValues(attribute.values ?? []);
    }
  }, [attribute]);

  // Fetch categories when modal opens and attribute is available
  useEffect(() => {
    if (isOpen && attribute?.id && token) {
      setIsFetchingCategories(true);
      fetchAdminAttributeCategories(
        attribute.id,
        (data: any) => {
          setIsFetchingCategories(false);
          const rawList = Array.isArray(data)
            ? data
            : Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data?.categories)
            ? data.categories
            : [];

          const parsedCats: AttributeCategoryData[] = rawList.map((item: any) => {
            const catId = String(
              item.id ?? item.category_id ?? item.pk ?? item.category?.id ?? ""
            );
            const catName =
              item.name ??
              item.title ??
              item.category_name ??
              item.category?.name ??
              "Category";

            let vals: string[] = [];
            const rawVals =
              item.values ??
              item.attribute_values ??
              item.values_list ??
              item.category?.values;

            if (Array.isArray(rawVals)) {
              vals = rawVals.map((v: any) =>
                typeof v === "string" ? v : v.name || v.value || v.val || String(v)
              );
            } else if (typeof rawVals === "string" && rawVals.trim()) {
              vals = rawVals
                .split(",")
                .map((v: string) => v.trim())
                .filter(Boolean);
            }

            return { id: catId, name: catName, values: vals };
          });

          setCategories(parsedCats);

          if (parsedCats.length > 0) {
            const defaultCat = parsedCats[0];
            setSelectedCategoryId(defaultCat.id);
            setCategoryValues(defaultCat.values);
          } else {
            setSelectedCategoryId("");
            setCategoryValues(attribute.values ?? []);
          }
        },
        (err: any) => {
          setIsFetchingCategories(false);
          console.error("Failed to fetch attribute categories:", err);
        }
      );
    }
  }, [isOpen, attribute?.id, token]);

  // Handle category dropdown selection change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    const selected = categories.find((c) => c.id === catId);
    if (selected) {
      setCategoryValues(selected.values);
    } else {
      setCategoryValues(attribute?.values ?? []);
    }
  };

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const w = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (w > 0) document.body.style.paddingRight = `${w}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ── Hide / Show toggle ── */
  const handleToggleHide = () => {
    if (!attribute || isToggling) return;
    const newIsActive = !isActive;
    setIsToggling(true);

    updateAdminAttribute(
      attribute.id,
      { is_active: newIsActive },
      () => {
        setIsActive(newIsActive);
        setIsToggling(false);
        if (onHideToggled) onHideToggled(attribute.id, newIsActive, attribute.name);
      },
      (err: any) => {
        setIsToggling(false);
      }
    );
  };

  /* ── Delete ── */
  const handleDelete = () => {
    if (!attribute) return;
    if (onDeleteRequest) {
      onDeleteRequest(attribute.id, attribute.name);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-end z-[9998] p-4 sm:pr-[29px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, x: 160 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 160 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-xl flex flex-col w-full max-w-[432px] rounded-[16px] relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6">
              <h2 className="text-c18 font-MontserratSemiBold text-[#161616]">
                Attribute details
              </h2>
              <button
                onClick={onClose}
                className="text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body — loading skeleton or real content */}
            {isLoading || !attribute ? (
              <div className="px-8 pb-10 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <LoadingSpinner size={36} color="border-[#947FFF]" />
                <p className="text-sm font-MontserratMedium text-[#161616]/50">Loading attribute details...</p>
              </div>
            ) : (
            <div className="px-8 pb-8 space-y-0">
              {/* Attribute name + active badge */}
              <div className="flex items-center justify-between pb-5 border-b border-[#F0F0F0]">
                <span className="text-c20 font-MontserratSemiBold text-[#161616]">
                  {attribute.name}
                </span>
                <span
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-c12 font-MontserratMedium ${
                    isActive
                      ? "bg-[#28A745]/10 text-[#28A745]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-[#28A745]" : "bg-gray-400"
                    }`}
                  />
                  {isActive ? "active" : "hidden"}
                </span>
              </div>

              {/* Metadata rows */}
              <div className="py-5 space-y-4 border-b border-[#F0F0F0]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-MontserratNormal text-[#161616]/60">
                    Date created
                  </span>
                  <span className="text-sm font-MontserratMedium text-[#161616]">
                    {attribute.dateCreated}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-MontserratNormal text-[#161616]/60">
                    Last modified
                  </span>
                  <span className="text-sm font-MontserratMedium text-[#161616]">
                    {attribute.lastModified}
                  </span>
                </div>
                {/* Hide toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-MontserratNormal text-[#161616]/60">
                    Hide
                  </span>
                  <button
                    onClick={handleToggleHide}
                    disabled={isToggling}
                    aria-label={isActive ? "Hide attribute" : "Show attribute"}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                      !isActive ? "bg-[#947FFF]" : "bg-gray-200"
                    } ${isToggling ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                  >
                    <motion.span
                      animate={{ x: !isActive ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              </div>

              {/* Select Category Dropdown */}
              <div className="pt-5 pb-5 border-b border-[#F0F0F0]">
                <Dropdown<AttributeCategoryData>
                  label=""
                  selected={
                    categories.find((c) => c.id === selectedCategoryId)?.name ||
                    (isFetchingCategories ? "Loading categories..." : "Select Category")
                  }
                  onSelect={(item) => handleCategoryChange(item.id)}
                  fetchItems={() => {}}
                  items={categories}
                  loading={isFetchingCategories}
                  placeholder="Select Category"
                />
              </div>

              {/* Values section */}
              <div className="pt-5 pb-6">
                <p className="text-sm font-MontserratMedium text-[#161616]/70 mb-4">
                  Added values
                </p>
                <div className="flex flex-wrap gap-3 max-h-[140px] overflow-y-auto no-scrollbar">
                  {categoryValues.length > 0 ? (
                    categoryValues.map((val, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 h-8 bg-white border border-[#FF715B] rounded-[8px] text-c12 font-MontserratMedium text-[#FF715B]"
                      >
                        <span className="max-w-[100px] truncate">{val}</span>
                        <X className="w-3 h-3 flex-shrink-0" />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 font-MontserratNormal">
                      No values added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#F0F0F0] pt-6">
                {/* Action buttons */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="secondary"
                    className="flex-1 flex items-center justify-center gap-2 border-[#FF715B] text-[#FF715B] hover:bg-[#FF715B]/5"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <LoadingSpinner size={16} color="border-[#FF715B]" />
                    ) : (
                      "Delete attribute"
                    )}
                  </Button>
                  <Button
                    className="flex-1 bg-[#FF715B] hover:bg-[#e85e4a] text-white"
                    onClick={() => onEdit && onEdit(attribute, selectedCategoryId, categoryValues)}
                  >
                    Edit details
                  </Button>
                </div>
              </div>
            </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

