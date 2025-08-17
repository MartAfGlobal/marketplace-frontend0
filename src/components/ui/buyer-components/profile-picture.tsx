import Camera from "@/assets/icons/user-dashboard/Camera.svg";
import Image from "next/image";
import { ProfileImageProps } from "@/types/global";

export default function ProfileImage({ src, alt = "Profile Image", onEditClick }: ProfileImageProps) {
  return (
    <div className="relative w-fit h-fit ">
     <div className="w-26 h-26 rounded-full overflow-hidden border border-gray-300">
       <Image
        src={src}
        alt={alt}
        width={104}
        height={104}
        className="rounded-full object-cover"
      />
      <button
        onClick={onEditClick}
        aria-label="Edit Profile Picture"
        className="absolute -bottom-2 z-20 -right-3 w-c48 h-c48 items-center justify-center flex bg-white p-2 rounded-full  hover:bg-gray-100 transition circled-shadow"
        type="button"
      >
        <Image src={Camera} alt="Edit icon" width={24} height={24}  className="h-c24 w-c24"/>
      </button>
     </div>
    </div>
  );
}
