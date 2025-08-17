"use client";

import ProfileImage from "@/components/ui/buyer-components/profile-picture";
import profilePicture from "@/assets/icons/user-dashboard/profile-picture.png";
import { StaticImageData } from "next/image";

import ProfileImageModal from "@/components/ui/Modals/ProfileImageModal";
import ProfileDetailsModal from "@/components/ui/Modals/edit-profile-modal";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function OverView() {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [currentProfile, setCurrentProfile] = useState<StaticImageData | string>(profilePicture);

  const [profileDetails, setProfileDetails] = useState({
    name: "Frank Ubara",
    email: "frankubi2023@gmail.com",
    mobile: "+2347034567654",
    homeNumber: "+2347034567654",
  });

  function handleUpload(file: File) {
    const url = URL.createObjectURL(file);
    setCurrentProfile(url);
    setProfileModalOpen(false);
  }

  function handleRemove() {
    setCurrentProfile(profilePicture);
    setProfileModalOpen(false);
  }

  function handleSaveDetails(updatedDetails: typeof profileDetails) {
    setProfileDetails(updatedDetails);
    setDetailsModalOpen(false);
  }

  return (
    <>
      <div className="flex gap-c48">
        <ProfileImage
          src={currentProfile}
          onEditClick={() => setProfileModalOpen(true)}
        />
        <div className="w-full">
          <div className="w-full flex justify-between mb-c24">
            <p className="font-MontserratSemiBold text-base leading-c24 text-000000">
              Personal details
            </p>
            {/* Edit details button triggers details modal */}
            <button
              className="font-MontserratSemiBold text-ff715b text-sm leading-c20"
              onClick={() => setDetailsModalOpen(true)}
            >
              Edit details
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex gap-c32">
              <p className="min-w-27.5 text-sm leading-c20 font-MontserratNormal text-000000 opacity-32">
                Full name
              </p>
              <span className="text-sm leading-c20 font-MontserratNormal text-000000">
                {profileDetails.name}
              </span>
            </div>
            <div className="flex gap-c32">
              <p className="min-w-27.5 text-sm leading-c20 font-MontserratNormal text-000000 opacity-32">
                Email address
              </p>
              <span className="text-sm leading-c20 font-MontserratNormal text-000000">
                {profileDetails.email}
              </span>
            </div>
            <div className="flex gap-c32">
              <p className="min-w-27.5 text-sm leading-c20 font-MontserratNormal text-000000 opacity-32">
                Mobile number
              </p>
              <span className="text-sm leading-c20 font-MontserratNormal text-000000">
                {profileDetails.mobile}
              </span>
            </div>
            <div className="flex gap-c32">
              <p className="min-w-27.5 text-sm leading-c20 font-MontserratNormal text-000000 opacity-32">
                Home number
              </p>
              <span className="text-sm leading-c20 font-MontserratNormal text-000000">
                {profileDetails.homeNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Image Modal */}
      <AnimatePresence>
        {profileModalOpen && (
          <ProfileImageModal
            isOpen={profileModalOpen}
            onClose={() => setProfileModalOpen(false)}
            currentProfile={currentProfile}
            onUpload={handleUpload}
            onRemove={handleRemove}
          />
        )}
      </AnimatePresence>

      {/* Profile Details Modal */}
      <AnimatePresence>
        {detailsModalOpen && (
          <ProfileDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            currentDetails={profileDetails}
            onSave={handleSaveDetails}
          />
        )}
      </AnimatePresence>
    </>
  );
}
