"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";

export interface FormField {
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "textarea";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface FinanceFormDrawerProps {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  fields: FormField[];
  initialValues?: Record<string, string>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}

const CONTROL =
  "w-full rounded-c8 border border-000000/12 bg-white px-3 text-sm font-MontserratNormal outline-none focus:border-[#ff715b]";

/** Right-side add/edit form used by the Tax & compliance and TPP screens. */
export default function FinanceFormDrawer({
  isOpen,
  title,
  submitLabel,
  fields,
  initialValues,
  loading,
  onClose,
  onSubmit,
}: FinanceFormDrawerProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) setValues(initialValues ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const set = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));
  const canSubmit = fields.every((f) => !f.required || (values[f.name] ?? "").trim() !== "");

  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose}>
      <button onClick={onClose} className="absolute right-8 top-8 text-000000/44 hover:text-000000 cursor-pointer" aria-label="Close">
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-lg font-MontserratMedium mb-8">{title}</h2>

      <form
        className="flex-1 overflow-y-auto scrollbar-hide space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) onSubmit(values);
        }}
      >
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-MontserratMedium text-000000/68 mb-1">{field.label}</label>
            {field.type === "select" ? (
              <select
                className={`${CONTROL} h-c44`}
                value={values[field.name] ?? ""}
                onChange={(e) => set(field.name, e.target.value)}
              >
                <option value="" disabled>
                  {field.placeholder ?? "Select"}
                </option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                className={`${CONTROL} py-2 min-h-24`}
                value={values[field.name] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => set(field.name, e.target.value)}
              />
            ) : (
              <Input
                type={field.type ?? "text"}
                value={values[field.name] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}
          </div>
        ))}

        <Button type="submit" loading={loading} disabled={!canSubmit} className="mt-4">
          {submitLabel}
        </Button>
      </form>
    </DrawerWrapper>
  );
}
