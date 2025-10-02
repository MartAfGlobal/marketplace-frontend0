import Camera from "@/assets/icons/user-dashboard/Camera.svg";
import profilePicture from "@/assets/icons/user-dashboard/profile-picture.png"; // fallback
import Image, { StaticImageData } from "next/image";
import { ProfileImageProps } from "@/types/global";

export default function ProfileImage({
  src,
  alt = "Profile Image",
  onEditClick,
}: ProfileImageProps) {
  let safeSrc: string | StaticImageData = profilePicture;

  if (typeof src === "string" && src.trim() !== "") {
    try {
      // check if it's an absolute URL (http/https)
      const url = new URL(src, window.location.origin);
      safeSrc = url.href;
    } catch {
      // if not valid URL, fallback stays profilePicture
    }
  }

  return (
    <div className="relative w-fit h-fit">
      <div className="w-26 h-26 rounded-full flex justify-center items-center bg-2d7565 border border-gray-300 relative">
        <Image
          src={safeSrc}
          alt={alt}
          width={104}
          height={104}
          className="rounded-full object-cover h-26 w-26"
        />

        <button
          onClick={onEditClick}
          aria-label="Edit Profile Picture"
          className="absolute -bottom-2 z-50 -right-3 w-c48 h-c48 flex items-center justify-center bg-white p-2 rounded-full hover:bg-gray-100 transition circled-shadow"
          type="button"
        >
          <Image
            src={Camera}
            alt="Edit icon"
            width={24}
            height={24}
            className="h-c24 w-c24"
          />
        </button>
      </div>
    </div>
  );
}
