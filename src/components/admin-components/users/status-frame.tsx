import Image, { StaticImageData } from "next/image";
import React from "react";

type props = {
  title: string;
  quantity: number | string;
  width?: number;
  height?: number;
  // Existing callers pass a StaticImageData/string (an imported svg/png)
  // rendered via next/image; newer callers (e.g. the Roles & Permissions
  // and Staff Management stat rows) pass a ready-made icon node (a
  // lucide-react icon wrapped in a colored circle) instead of an image
  // asset — both render through the same tile so there's one stat-tile
  // component, not two near-duplicates.
  icon: string | StaticImageData | React.ReactNode;
};

function isImageSource(icon: props["icon"]): icon is string | StaticImageData {
  return (
    typeof icon === "string" ||
    (typeof icon === "object" && icon !== null && "src" in (icon as StaticImageData))
  );
}

export default function StatusFrame({ title, quantity, icon, width = 32, height = 32 }: props) {
  return (
    <div className="w-full h-28 flex flex-col justify-center items-start">
      <p className="text-c12 font-MontserratNormal text-000000/68 mb-2">{title}</p>
      <div className="flex items-center gap-3">
        <p className="text-c32 font-MontserratMedium">{quantity}</p>
        <div className="h-c32  w-c32 flex items-center justify-center shrink-0">
          {isImageSource(icon) ? (
            <Image src={icon} alt={title} width={width} height={height} />
          ) : (
            icon
          )}
        </div>
      </div>
    </div>
  );
}
