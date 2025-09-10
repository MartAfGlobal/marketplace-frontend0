"use client";

import { useSearchParams } from "next/navigation";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name") || "Document";

  if (!fileUrl) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>No preview available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 text-white">
        <span className="font-medium">{fileName}</span>
        <div className="flex items-center gap-4">
          <a href={fileUrl} download className="hover:text-blue-400">
            Download
          </a>
        </div>
      </div>

      {/* Document Preview */}
      <div className="flex-1 flex justify-center items-center overflow-auto">
        <iframe
          src={fileUrl}
          className="w-[80%] h-[95%] bg-white shadow-lg rounded"
        />
      </div>
    </div>
  );
}
