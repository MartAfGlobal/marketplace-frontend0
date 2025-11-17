"use client";

import ProfileImage from "@/components/ui/buyer-components/profile-picture";
import profilePicture from "@/assets/icons/user-dashboard/profile-picture.png";
import { StaticImageData } from "next/image";


import ProfileImageModal from "@/components/ui/Modals/ProfileImageModal";
import ProfileDetailsModal from "@/components/ui/Modals/edit-profile-modal";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";



export default function OverView() {
  const buyer = useSelector((state: any) => state.buyer.BuyerData);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [currentProfile, setCurrentProfile] = useState<StaticImageData | string>(profilePicture);

  const [profileDetails, setProfileDetails] = useState({
    name: "Frank Ubara",
    email: "frankubi2023@gmail.com",
    mobile: "+2347034567654",
    homeNumber: "+2347034567654",
  });

  console.log ("new buyer details:", buyer)
  console.log ("number:", buyer?.profile?.phone)
  console.log ("number:", buyer?.profile?.phone2)

  console.log("Current profile image:", buyer?.profile);

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
          src={buyer?.profile?.profile_picture || "Add +"
          }
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
                {`${buyer.first_name ? buyer.first_name.charAt(0).toUpperCase() + buyer.first_name.slice(1) : "Not set"} ${buyer.last_name ? buyer.last_name.charAt(0).toUpperCase() + buyer.last_name.slice(1) : ""}`}

              </span>
            </div>
            <div className="flex gap-c32">
              <p className="min-w-27.5 text-sm leading-c20 font-MontserratNormal text-000000 opacity-32">
                Email address
              </p>
              <span className="text-sm leading-c20 font-MontserratNormal text-000000">
                {buyer.email}
              </span>
            </div>
            <div className="flex gap-c32">
              <p className="min-w-27.5 text-sm leading-c20 font-MontserratNormal text-000000 opacity-32">
                Mobile number
              </p>
              <span className="text-sm leading-c20 font-MontserratNormal text-000000">
                 {buyer?.profile?.phone || "N/A"}
              </span>
            </div>
            <div className="flex gap-c32">
              <p className="min-w-27.5 text-sm leading-c20 font-MontserratNormal text-000000 opacity-32">
                Home number
              </p>
              <span className="text-sm leading-c20 font-MontserratNormal text-000000">
                 {buyer?.profile?.phone2 || "N/A"}
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
