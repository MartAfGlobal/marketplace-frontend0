"use client";

import React, { useState } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedFile {
  file: File;
  preview: string;
  title: string;
}

interface ImageFormProps {
  onSubmit: (files: SelectedFile[]) => Promise<void>;
  isSubmitting: boolean;
}

export default function ImageForm({ onSubmit, isSubmitting }: ImageFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.split(".")[0] || "Showcase Image"
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateTitle = (index: number, title: string) => {
    setSelectedFiles(prev => prev.map((f, i) => i === index ? { ...f, title } : f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      await onSubmit(selectedFiles);
      setSelectedFiles([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <label className="block text-sm font-MontserratSemiBold text-[#22223f]">Select Images (Multiple supported)</label>
        <div className="space-y-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#d9d8f1] bg-[#fafafe] px-5 py-12 text-center transition hover:border-6a0dad hover:bg-6a0dad/[0.02]">
            <Upload size={32} className="text-6a0dad mb-4" />
            <span className="text-sm font-MontserratSemiBold text-[#4b4a6c]">Click to select multiple images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence>
                {selectedFiles.map((item, idx) => (
                  <motion.div 
                    key={item.preview}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative rounded-2xl overflow-hidden border border-[#efefef] bg-white shadow-sm flex flex-col"
                  >
                    <div className="relative aspect-square">
                      <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 shadow-sm hover:bg-white transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="p-3">
                      <input 
                        type="text"
                        value={item.title}
                        onChange={(e) => updateTitle(idx, e.target.value)}
                        placeholder="Image Title"
                        className="w-full text-[10px] font-MontserratSemiBold bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 outline-none focus:border-6a0dad/30"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || selectedFiles.length === 0}
        className="w-full rounded-full bg-6a0dad px-8 py-4 text-sm font-MontserratBold text-white transition hover:bg-[#5a0dad] shadow-lg shadow-6a0dad/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
        {isSubmitting ? "Uploading..." : `Save ${selectedFiles.length} Images`}
      </button>
    </form>
  );
}
