"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";

import BodyGuideImage from "@/assets/images/body-measurement.svg";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "mens-shoes" | "womens-shoes" | "clothes";
}

const clothingSizes = [
  { size: "XS", us: "6", uk: "5", china: "38", chest: "24.1 (23.9 - 24.3)" },
  { size: "S", us: "7", uk: "6", china: "40", chest: "24.8 (24.6 - 25.0)" },
  { size: "M", us: "8", uk: "7", china: "41", chest: "25.4 (25.2 - 25.6)" },
  { size: "L", us: "9", uk: "8", china: "42", chest: "26.0 (25.8 - 26.2)" },
  { size: "XL", us: "10", uk: "9", china: "43", chest: "26.7 (26.5 - 26.9)" },
  { size: "2XL", us: "11", uk: "10", china: "44", chest: "27.3 (27.1 - 27.5)" },
  { size: "3XL", us: "12", uk: "11", china: "45", chest: "28.0 (27.8 - 28.2)" },
];

const trouserSizes = [
  { size: "XS", us: "6", uk: "5", china: "38", waist: "24", inseam: "24.1" },
  { size: "S", us: "6", uk: "5", china: "38", waist: "24", inseam: "24.1" },
  { size: "M", us: "6", uk: "5", china: "38", waist: "24", inseam: "24.1" },
  { size: "L", us: "6", uk: "5", china: "38", waist: "24", inseam: "24.1" },
  { size: "XL", us: "6", uk: "5", china: "38", waist: "24", inseam: "24.1" },
  { size: "2XL", us: "6", uk: "5", china: "38", waist: "24", inseam: "24.1" },
  { size: "3XL", us: "6", uk: "5", china: "38", waist: "24", inseam: "24.1" },
];

function SizeTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <section className="min-w-0 max-w-[311.49px]">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-0 border-collapse text-center text-[10px] font-MontserratNormal">
          <thead className="bg-purple-800 text-white">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-2 py-2 font-normal">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-x border-[#D9D9D9]  text-161616">
                {row.map((value, index) => (
                  <td key={`${row[0]}-${index}`} className="px-2 py-2 text-center">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  type,
}: SizeGuideModalProps) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !portalTarget) return null;

  const clothingRows = clothingSizes.map(({ size, us, uk, china, chest }) => [
    size,
    us,
    uk,
    china,
    chest,
  ]);
  const trouserRows = trouserSizes.map(
    ({ size, us, uk, china, waist, inseam }) => [
      size,
      us,
      uk,
      china,
      waist,
      inseam,
    ],
  );

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-transparent overscroll-contain p-3">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        className="relative max-h-[90dvh] w-[min(100vw,60rem)] md:max-w-fit overflow-y-auto rounded-2xl bg-white pt-6 px-8  pb-12 shadow-xl sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close size guide"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-700 transition hover:bg-[#D9D9D9]"
        >
          ×
        </button>

        <h2 id="size-guide-title" className="mb-5 pr-10 text-c18 font-MontserratNormal leading-6.5">
          {type === "clothes"
            ? "Men's Clothing Size Chart"
            : type === "mens-shoes"
              ? "Men's Shoe Size Chart"
              : "Women's Shoe Size Chart"}
        </h2>

        {type === "clothes" ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <SizeTable
                title="Shirts"
                headers={["SIZE", "US", "UK", "China", "Chest"]}
                rows={clothingRows}
              />
              <SizeTable
                title="Trousers"
                headers={["SIZE", "US", "UK", "China", "Waist (cm)", "Inseam"]}
                rows={trouserRows}
              />
            </div>
            <section className="mt-4 items-center flex flex-col md:flex-row gap-8">
              <div>
                <Image
                  src={BodyGuideImage}
                  alt="measurement"
                  width={250.24}
                  height={173.57}
                />
              </div>
              <div>
                <h3 className="mb-3 font-MontserratSemiBold text-sx leading-4">How to Take Measurements</h3>
                <ul className="space-y-2 text-c10 font-MontserratMedium leading-c20">
                  <li>Chest: Measure around the fullest part of the chest.</li>
                  <li>
                    Waist: Measure around the narrowest part of the waist.
                  </li>
                  <li>Hips: Measure around the widest part of the hips.</li>
                  <li>
                    Inseam: Measure from the inside of the leg to the ankle.
                  </li>
                </ul>
              </div>
            </section>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            This size guide is not available yet.
          </p>
        )}
      </div>
    </div>,
    portalTarget,
  );
}
