"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Input } from "@/components/ui/forms/Input";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Spinner from "@/assets/icons/spinner.png";
import cancelUpload from "@/assets/icons/close.png";
import cloud from "@/assets/icons/cloudupload.png";
import PDF from "@/assets/icons/pdf.svg";
import ConfirmModal from "./modals/confirm-delete-upload";
import EditModal from "./modals/edit-upload";
import { RootState } from "@/store";

import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UploadedFile } from "@/types/global";

export default function DocumentUploadForm({
  goBack,
  onContinue,
}: {
  goBack: () => void;
  onContinue: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<UploadedFile | null>(null);

  // ✅ Grab seller data from Redux
  const sellerData = useSelector((state: RootState) => state.seller.data);
  const token = useSelector((state: any) => state.token?.token);
  const dispatch = useDispatch();

  const { loading, sendHttpRequest: UserkycUdateReq } = useHttp();

  const registerUserRes = (res: any) => {
    toast.success("Documents submitted successfully!");
    onContinue();
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!title.trim() || !description.trim()) {
        setShowError(true);
        return;
      }
      setShowError(false);

      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        uploadedSize: 0,
        progress: 0,
        uploaded: false,
        title: title.trim(),
        description: description.trim(),
        rawFile: file,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Fake upload progress
      newFiles.forEach((file) => {
        const interval = setInterval(() => {
          setFiles((prev) => {
            const updated = prev.map((f) => {
              if (f.id === file.id && f.progress < 100) {
                const nextProgress = f.progress + 20;
                const uploadedSize = Math.min(
                  f.size,
                  f.uploadedSize + f.size * 0.2
                );
                if (nextProgress >= 100) clearInterval(interval);
                return {
                  ...f,
                  progress: nextProgress >= 100 ? 100 : nextProgress,
                  uploaded: nextProgress >= 100,
                  uploadedSize,
                };
              }
              return f;
            });
            return updated;
          });
        }, 300);
      });

      setTitle("");
      setDescription("");
    },
    [title, description]
  );

  const handleCancelUpload = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDelete = (file: UploadedFile) => {
    setFileToDelete(file);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
    }
    setShowConfirm(false);
    setFileToDelete(null);
  };

  const handleEdit = (file: UploadedFile) => {
    setFileToEdit(file);
    setShowEdit(true);
  };

  const saveEdit = (updatedFile: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === updatedFile.id ? { ...f, ...updatedFile } : f))
    );
    setShowEdit(false);
    setFileToEdit(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024,
  });

const handleSubmit = async () => {
  // ✅ Check for exactly 3 documents
  if (files.length < 3) {
    toast.error("Please upload 3 documents before continuing.");
    return;
  }

  const formData = new FormData();

  // ✅ Add seller data
  Object.entries(sellerData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });

  // ✅ Add exactly 3 documents in array format
  files.slice(0, 3).forEach((file) => {
    formData.append("documents[title][]", file.title);
    formData.append("documents[description][]", file.description);
    formData.append("documents[file][]", file.rawFile);
  });

  // ✅ Debug log
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(
        `${key}: FILE -> name=${value.name}, size=${value.size}, type=${value.type}`
      );
    } else {
      console.log(`${key}:`, value);
    }
  }

  UserkycUdateReq({
    successRes: registerUserRes,
    requestConfig: {
      url: "/accounts/UserDetails/",
      method: "PATCH",
      body: formData,
      token,
      successMessage: "Data submitted, please verify.",
    },
  });
};

  const uploadingFiles = files.filter((f) => !f.uploaded);
  const uploadedFiles = files.filter((f) => f.uploaded);

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Title + Description + Upload */}
      <div className="flex w-full gap-20">
        <div className="flex flex-col gap-2 w-full max-w-125">
          <label className="font-MontserratSemiBold text-black/60 text-base">
            Title:
          </label>
          <Input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="font-MontserratMedium text-sm mt-2">
            Description:
          </label>
          <textarea
            className="appearance-none outline-none border border-black/5 focus:ring focus:ring-ff715b p-4 h-20 rounded text-black bg-transparent resize-none"
            placeholder="Enter brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {showError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-red-500 text-sm font-MontserratNormal mt-1"
            >
              Please fill in Title and Description before uploading a file.
            </motion.p>
          )}
        </div>

        {/* File Upload */}
        <motion.div
          className="flex flex-col gap-2 w-full max-w-125 h-50.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label className="font-MontserratSemiBold text-000000/60 text-base">
            Upload File:
          </label>
          <div
            {...getRootProps()}
            className={`border border-000000/5 rounded-xl bg-cf4e7fd/60 p-6 flex flex-col h-45 items-center justify-center cursor-pointer ${
              isDragActive
                ? "border-cf4e7fd/88 bg-cf4e7fd/60"
                : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <div>
              <Image src={cloud} width={32} height={32} alt="upload" />
            </div>
            <p className="font-MontserratSemiBold text-sm text-000000/5 mt-3 mb-1">
              PDF, PNG, JPG or JPEG not more than 5MB
            </p>
            <p className="text-center font-MontserratSemiBold text-base text-000000/60">
              Drag & Drop file here or{" "}
              <span className="text-purple-600 underline">Browse file</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-2 w-full gap-x-20 gap-y-6">
          {uploadingFiles.map((file) => (
            <motion.div
              key={file.id}
              className="flex flex-col justify-center gap-6 upload-shadow rounded-lg p-6 upload h-37.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-6">
                  {file.name.toLowerCase().endsWith(".pdf") && (
                    <Image src={PDF} alt="PDF" width={64} height={64} />
                  )}
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-MontserratSemiBold text-000000/60">
                      {file.name}
                    </span>
                    <div className="flex gap-11.75 items-center w-full">
                      <span className=" text-c12 font-MontserratMedium text-a2a2a2">
                        {`${Math.round(
                          file.uploadedSize / 1024
                        )} KB of ${Math.round(file.size / 1024)} KB`}
                      </span>
                      <span className="text-base font-MontserratNormal text-646464 flex items-center gap-2">
                        <Image src={Spinner} alt="loading" />
                        {file.progress < 100 ? "Uploading..." : "Done"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-fit h-fit flex-shrink-0"
                  onClick={() => handleCancelUpload(file.id)}
                >
                  <Image
                    src={cancelUpload}
                    alt="cancel upload"
                    width={15.75}
                    height={19.69}
                  />
                </button>
              </div>
              <div className="w-full h-1.5 bg-d9d9d9 rounded">
                <div
                  className="h-1.5 bg-6a0dad rounded"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 w-full gap-x-20 gap-y-6">
          {uploadedFiles.map((file) => (
            <motion.div
              key={file.id}
              className="flex w-full max-w-125 justify-center items-center h-c192 rounded-lg p-6 upload-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-col gap-3 w-full">
                  <p className="font-MontserratSemiBold text-000000/60 text-c20 m-0">
                    {file.title}
                  </p>
                  <p className="text-base font-MontserratNormal text-000000/60">
                    {file.description}
                  </p>
                </div>
                <div className="flex justify-between w-full mt-4">
                  <div className="flex items-center w-full gap-2">
                    <div className="flex w-full max-w-83.25 h-c64 upload-shadow rounded-xl items-center px-5 gap-6 py-1">
                      {file.name.toLowerCase().endsWith(".pdf") && (
                        <Image src={PDF} alt="PDF" width={64} height={64} />
                      )}
                      <div className="flex flex-col gap-3">
                        <span className="text-sm font-MontserratSemiBold text-000000/60">
                          {file.name}
                        </span>
                        <span className=" text-c12 font-MontserratMedium text-a2a2a2">
                          {`${Math.round(file.size / 1024)} KB`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button type="button" onClick={() => handleEdit(file)}>
                      <FiEdit className="text-purple-600" />
                    </button>
                    <button type="button" onClick={() => handleDelete(file)}>
                      <FiTrash2 className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showConfirm && (
        <ConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmDelete}
        />
      )}

      {showEdit && fileToEdit && (
        <EditModal
          file={fileToEdit}
          onCancel={() => setShowEdit(false)}
          onSave={saveEdit}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={goBack}
          className="px-6 py-2 border border-red-500 rounded-lg text-red-500"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Continue"}
        </button>
      </div>
    </div>
  );
}
