"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

type ImageWithSkeletonProps = Omit<ImageProps, "src" | "alt" | "fill" | "onLoad" | "onError"> & {
  src?: string | null;
  alt: string;
  isLoading?: boolean;
};

export default function ImageWithSkeleton({
  src,
  alt,
  className,
  isLoading = false,
  ...imageProps
}: ImageWithSkeletonProps) {
  const sourceKey = src ?? "";
  const [loadedSource, setLoadedSource] = useState("");
  const [failedSource, setFailedSource] = useState("");
  const isLoaded = sourceKey !== "" && loadedSource === sourceKey && !isLoading;
  const canRenderImage = sourceKey !== "" && failedSource !== sourceKey;

  return (
    <>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gray-200"
        />
      )}
      {canRenderImage && (
        <Image
          key={sourceKey}
          {...imageProps}
          src={src!}
          alt={alt}
          fill
          className={`${className ?? ""} ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoadedSource(sourceKey)}
          onError={() => setFailedSource(sourceKey)}
        />
      )}
    </>
  );
}