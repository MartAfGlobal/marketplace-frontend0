"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import MobileIcon from "@/assets/icons/mobileIcon.png";
import HomeIcon from "@/assets/icons/callIcon.png";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";

import { BuyerEditParams, ProfileDetailsModalProps } from "@/types/global";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "../loading-spinner";
import { useSelector, useDispatch } from "react-redux";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

export default function ProfileDetailsModal({
  isOpen,
  onClose,
  currentDetails,
  onSave,
}: ProfileDetailsModalProps) {
  const [details, setDetails] = useState(currentDetails);
  const buyer = useSelector((state: any) => state.buyer.BuyerData);
  const dispatch = useDispatch()

    const [formData, setFormData] = useState<BuyerEditParams>(() => ({
      first_name: buyer?.first_name || "",
      last_name: buyer?.last_name || "",
      phone: buyer?.profil?.phone || "",
      phone2: buyer?.profil?.phone2 || "",
    }));
  
    // ✅ Sync form values with buyer data when it updates
    useEffect(() => {
      if (buyer) {
        setFormData({
          first_name: buyer.first_name || "",
          last_name: buyer.last_name || "",
          phone: buyer.profile.phone || "",
          phone2: buyer.profile.phone2  || "",
        });
      }
    }, [buyer]);

  const tokenSlice = useSelector((state: any) => state.token);
  const { token } = tokenSlice;
  const router = useRouter();

  const { loading, sendHttpRequest: editRegisterUserReq } = useHttp();

  const handleeditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   
    const form = new FormData();
    form.append("first_name", formData.first_name ?? "");
    form.append("last_name", formData.last_name ?? "");
    form.append("phone", formData.phone ?? "");
    form.append("phone2", formData.phone2 ?? "");

    const registerUserRes = (res: any) => {
      toast.success("Profile updated successfully!");

        dispatch(
    buyerActions.updateBuyerData({
      first_name: formData.first_name,
      last_name: formData.last_name,
    })
  );

  // Update nested profile fields separately
  dispatch(
    buyerActions.updateBuyerData({
      profile: {
        ...buyer.profile,
        phone: formData.phone,
        phone2: formData.phone2,
      },
    })
  );
      console.log ("profile edited:", res.data)
      onClose();
      router.push(`/dashboard/buyer`);
    };

    editRegisterUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/UserDetails/",
        method: "PATCH",
        body: form,
        token, // ✅ attach token
        isAuth: true, // ✅ r
        userType: "buyer",
        successMessage: "Profile updated successfully.",
      },
    });

    console.log("Registration data:", { ...formData });
  };

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white p-8 rounded-2xl max-w-157.25 w-full h-fit max-h-91 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>
            <form onSubmit={handleeditSubmit} className="w-full ">
              <h2 className=" font-MontserratSemiBold text-c16 mb-c32">
                Personal details
              </h2>

              <div className="flex flex-col gap-c24 text-000000/60">
                {/* Name */}
                <div className="flex gap-c24  w-full ">
                  <div className="flex flex-col gap-2 w-full">
                    <Label className="text-c12 font-MontserratMedium">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label className="text-c12 font-MontserratMedium">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="border border-efefef rounded-md p-4  text-c12 font-MontserratMedium w-full"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex gap-c24 w-full">
                  <div className="flex flex-col gap-2 relative w-full">
                    <Label className="text-c12 font-MontserratMedium">
                      Mobile Number
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="border border-efefef rounded-md p-4 w-full text-c12 pl-8 font-MontserratMedium"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Image
                          src={MobileIcon}
                          alt="mobile"
                          width={11.25}
                          height={17.5}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative w-full">
                    <Label className="text-c12 font-MontserratMedium">
                      Home Number
                    </Label>
                    <div className="relative w-full">
                      <Input
                        type="text"
                        value={formData.phone2}
                        onChange={(e) =>
                          setFormData({ ...formData, phone2: e.target.value })
                        }
                        className="border border-efefef rounded-md p-4 w-full text-c12 pl-8 font-MontserratMedium"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Image
                          src={HomeIcon}
                          alt="home"
                          width={15.62}
                          height={15.62}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="w-full flex justify-end mt-c32">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full max-w-50.5  bg-ff715b text-white flex justify-center items-center"
                >
                  {loading ? <LoadingSpinner /> : "Save changes"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
