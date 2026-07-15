"use client";

import React from "react";
import Image from "next/image";
import UploadIcon from "@/assets/FormIcon/Vector.svg";

interface FileInputProps {
  placeholder: string;
  disabled?: boolean;
  fileName?: string;
  fileUrl?: string;
  onFileSelect?: (file: File) => void;
  onViewImage?: (url: string) => void;
}

export const FileInput = ({
  placeholder,
  disabled = false,
  fileName = "",
  fileUrl = "",
  onFileSelect,
  onViewImage,
}: FileInputProps) => {
  const handleButtonClick = () => {
    if (fileUrl && onViewImage) {
      onViewImage(fileUrl);
    }
  };

  const hasFile = Boolean(fileName || fileUrl);

  return (
    <div className="h-12 px-3.5 w-full rounded-c8 text-ffffff border outline-none md:text-sm p-1.5 flex items-center justify-between bg-white">
      <div
        className={`px-4 h-full flex items-center rounded-lg text-[12px] font-MontserratMedium truncate max-w-[70%] ${
          hasFile ? "bg-[#e5e5e5] text-[#666666]" : "bg-transparent text-[#cccccc]"
        }`}
      >
        {fileName || (fileUrl ? "Document.jpg" : placeholder)}
      </div>
      <div className="relative inline-block">
        {/* View button (shown when disabled and file exists) */}
        {disabled ? (
          <button
            type="button"
            onClick={handleButtonClick}
            className={`w-[57px] h-[24px] cursor-pointer rounded-[4px] flex items-center justify-center text-[11px] font-MontserratMedium transition-colors ${
              hasFile
                ? "bg-[#f0f0f0] text-[#333] hover:bg-[#e0e0e0] cursor-pointer"
                : "bg-[#f0f0f0] text-[#aaa] cursor-not-allowed"
            }`}
            disabled={!hasFile}
          >
            View
          </button>
        ) : (
          /* Upload button (shown when editing) */
          <button
            type="button"
            className="w-[57px] h-[24px] cursor-pointer rounded-[4px] bg-transparent flex items-center justify-center"
          >
            <Image src={UploadIcon} alt="Upload" width={16} height={16} className="w-4 h-4" />
          </button>
        )}
        {!disabled && (
          <input
            type="file"
            className="absolute inset-0 w-[57px] h-[24px] opacity-0 cursor-pointer"
            onChange={(e) => e.target.files?.[0] && onFileSelect?.(e.target.files[0])}
          />
        )}
      </div>
    </div>
  );
};

