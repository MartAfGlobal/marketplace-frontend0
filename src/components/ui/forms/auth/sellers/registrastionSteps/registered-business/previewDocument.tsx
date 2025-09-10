"use client";

import React from "react";

export default function FilePreviewModal({
  fileName,
  fileUrl,
  onClose,
}: {
  fileName: string;
  fileUrl: string;
  onClose: () => void;
}) {
  const isPdf = fileName.endsWith(".pdf");

  // Google Docs needs PUBLIC URL, not blob:
  const googleViewerUrl = isPdf && !fileUrl.startsWith("blob:")
    ? `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`
    : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
         <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black bg-ffffff"
        >
          Close
        </button>
      <div className=" p-4 rounded-lg  w-full h-screen mt-50 relative">
       

        {isPdf ? (
          googleViewerUrl ? (
            <iframe
              src={googleViewerUrl}
              className="w-full h-full"
              title="PDF Preview"
            />
          ) : (
            <iframe
              src={fileUrl}
              className="w-full h-full"
              title="PDF Preview"
            />
          )
        ) : (
          <img
            src={fileUrl}
            alt="Preview"
            className="max-h-full mx-auto"
          />
        )}
      </div>
    </div>
  );
}
