"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import cloud from "@/assets/icons/cloudupload.png";

import PDF from "@/assets/icons/pdf.svg";
import Close from "@/assets/icons/close.png";
import DeleteIcon from "@/assets/icons/delete.png";
import ViewIcon from "@/assets/icons/view.png";
import whiteClose from "@/assets/icons/whiteClose.png";
import ConfirmModal from "./confirm-delete-upload";
import { Input } from "@/components/ui/forms/Input";
import FilePreviewModal from "../previewDocument";
import { UploadedFile } from "@/types/global";

export default function EditModal({
  file,
  onCancel,
  onSave,
}: {
  file: UploadedFile;
  onCancel: () => void;
  onSave: (file: UploadedFile) => void;
}) {
  const [title, setTitle] = useState(file.title);
  const [description, setDescription] = useState(file.description);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempFile, setTempFile] = useState<UploadedFile | null>(file);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [file]);

  const handleDelete = () => setShowConfirm(true);
  const confirmDelete = () => {
    onSave({ ...file, title: "", description: "" });
    setShowConfirm(false);
    onCancel();
  };

// inside EditModal handleSave
const handleSave = () => {
  onSave({
    ...file,
    title,
    description,
    rawFile: tempFile?.rawFile || file.rawFile, 
  });
};

  const handleView = () => {
    const previewUrl = tempFile?.url || file.url;
    if (previewUrl) {
      setShowPreview(true);
    } else {
      alert("No preview available for this file.");
    }
    console.log("checking.....", previewUrl);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0];
        const newFileObj: UploadedFile = {
          ...file,
          name: newFile.name,
          size: newFile.size,
          uploadedSize: newFile.size,
          progress: 100,
          uploaded: true,
          url: URL.createObjectURL(newFile),
        };
        setTempFile(newFileObj);
      }
    },
    [file]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 5 * 1024 * 1024,
    noClick: true,
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Top Close Button */}
        <button
          className="absolute top-20 right-20 h-10 w-10 rounded-full flex items-center justify-center bg-ffffff/25"
          onClick={onCancel}
        >
          <Image src={whiteClose} alt="closeModal" width={24} height={24} />
        </button>
        <motion.div
          className="bg-white rounded-c24 px-12.5 py-12 w-full max-w-150 h-fit max-h-screen flex flex-col gap-4 relative overflow-hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="overflow-y-auto w-full"
            style={{
              maxHeight: "calc(100% - 2rem)",
              scrollbarWidth: "thin",
              scrollbarColor: "transparent transparent",
            }}
          >
            <div className="flex justify-between items-center pb-6 border-b-4 border-b-d9d9d9 mb-12 ">
              <p className="text-c32 font-MontserratSemiBold text-161616">
                Edit Document
              </p>
              <button className="h-fit w-fit flex-shrink-0" onClick={onCancel}>
                <Image
                  src={Close}
                  alt="closeModal"
                  width={15.75}
                  height={19.69}
                />
              </button>
            </div>
            <label className="font-MontserratSemiBold text-black/60 text-base">
              Title:
            </label>
            <Input
              className="h-14 mb-4 mt-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <label className="font-MontserratMedium text-base ">
              Brief Description
            </label>
            <textarea
              className="w-full mt-2 appearance-none outline-none border border-black/5 focus:ring focus:ring-ff715b p-4 h-35 rounded text-black bg-transparent resize-none"
              placeholder="Enter brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex w-full mt-6 items-center gap-4 h-20 rounded-lg upload-shadow px-4 py-3">
              <div className="flex items-center gap-4 text-wrap max-w-98.75">
                {tempFile?.url &&
                (tempFile.name.endsWith(".png") ||
                  tempFile.name.endsWith(".jpg") ||
                  tempFile.name.endsWith(".jpeg")) ? (
                  <img
                    src={tempFile.url}
                    alt={tempFile.name}
                    width={64}
                    height={64}
                    className="object-cover rounded"
                  />
                ) : (
                  <Image src={PDF} alt="PDF" width={64} height={64} />
                )}

                <div className="flex flex-col gap-3 w-full">
                  <p className="break-all w-full text-sm font-MontserratSemiBold">
                    {tempFile?.name || file.name}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-a2a2a2">
                    {`${Math.round((tempFile?.size || file.size) / 1024)} KB`}
                  </span>
                </div>
              </div>

              <div className="flex w-full max-w-18.25 gap-6 items-center">
                <button
                  type="button"
                  className="h-fit w-fit flex-shrink-0"
                  onClick={handleView}
                >
                  <Image src={ViewIcon} alt="View" width={24} height={24} />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="h-fit w-fit flex-shrink-0"
                >
                  <Image src={DeleteIcon} alt="Delete" width={24} height={24} />
                </button>
              </div>
            </div>

            {/* Upload New File Section */}
            <motion.div
              className="flex flex-col gap-2 w-full max-w-125 h-50.5 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <label className="font-MontserratSemiBold text-000000/60 text-base">
                Upload Document
              </label>
              <div
                {...getRootProps()}
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className={`text-000000/60 border-2 border-dashed border-000000/5 rounded-xl bg-cf4e7fd/60 p-6 flex flex-col h-45 items-center justify-center cursor-pointer ${
                  isDragActive
                    ? "border-4 border-dashed border-cf4e7fd/88 bg-cf4e7fd/60"
                    : "border border-dashed border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <div>
                  <Image src={cloud} width={32} height={32} alt="upload" />
                </div>
                <p className="font-MontserratSemiBold text-sm text-000000/50 mt-3 mb-1">
                  PDF, PNG, JPG or JPEG not more than 5MB
                </p>
                <p className="text-center flex gap-1 font-MontserratSemiBold text-base text-000000/50">
                  Drag & Drop file here or{" "}
                  <span className="text-purple-600 underline">Browse file</span>
                </p>
              </div>
            </motion.div>

            <div className="flex gap-2 mt-12 justify-end">
              <button
                className="w-full max-w-36.5 h-14 border border-000000/30 rounded-lg text-000000/30"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="w-full max-w-36.5 h-14 bg-ff715b text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>

        {showPreview && (
          <FilePreviewModal
            fileName={tempFile?.name || file.name}
            fileUrl={tempFile?.url || file.url!}
            onClose={() => setShowPreview(false)}
          />
        )}

        {showConfirm && (
          <ConfirmModal
            onCancel={() => setShowConfirm(false)}
            onConfirm={confirmDelete}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
