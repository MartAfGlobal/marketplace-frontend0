import { useState } from "react";
import { motion, TargetAndTransition } from "framer-motion";
import Image from "next/image";
import GoogleIcon from "@/assets/icons/user-dashboard/Flags/google.png";
import dropdown from "@/assets/icons/dropDown.svg";
import ResetPasswordModal from "@/components/ui/Modals/update-password-modal"

export default function PassWordSecurity() {
  const [settings, setSettings] = useState<Record<number, boolean>>({
    1: true,
    2: false,
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false); // modal state

  const toggleSetting = (id: number) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const itemVariants: { hidden: TargetAndTransition; visible: TargetAndTransition } = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

  const toggleNotifications = [
    { id: 1, title: "Two-factor authentication", description: "Use an authenticator or SMS OTP each time you login", type: "toggle" },
    { id: 2, title: "Change password", description: "Update password to maintain account integrity", type: "button" },
  ];

  const handleSavePassword = (passwords: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    console.log("Passwords submitted:", passwords);
    // Here you can call your API to update the password
  };

  return (
    <div>
      <h2 className="text-base leading-6 font-semibold text-black mb-6">Password & security</h2>
      
      <motion.div className="space-y-4 mt-c32">
        {toggleNotifications.map((item) => {
          const isActive = settings[item.id];

          return (
            <motion.div key={item.id} variants={itemVariants} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-MontserratSemiBold leading-5 text-black/72">{item.title}</h3>
                <p className="text-c12 font-MontserratNormal text-black/60">{item.description}</p>
              </div>

              {item.type === "toggle" ? (
                <motion.button
                  onClick={() => toggleSetting(item.id)}
                  className="relative w-11.5 h-6 rounded-full flex-shrink-0"
                  style={{
                    borderColor: isActive ? "#FF715B" : "#D1D5DB",
                    backgroundColor: isActive ? "#FF715B" : "#E5E7EB",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                    layout
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{ x: isActive ? 24 : 0 }}
                  />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 text-ff715b text-sm font-MontserratSemiBold"
                  onClick={() => setIsResetModalOpen(true)} // open modal here
                >
                  Update password
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="my-4">
        <p className="text-sm font-MontserratSemiBold leading-5 text-black/72">Third-party accounts</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <Image src={GoogleIcon} alt="google icon" width={32} height={32} className="w-c32 h-c32"/>
            <p className="font-MontserratSemiBold text-sm leading-5 text-000000/74">Google</p>
          </div>
          <button className="flex items-center justify-center gap-3 rounded-c8 w-c125-16 h-c48-15 bg-000000/20">
            <p className="font-MontserratSemiBold text-sm text-000000/72">Linked</p>
            <Image src={dropdown} alt="link" width={16.61} height={9.06}/>
          </button>
        </div>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onSave={handleSavePassword}
      />
    </div>
  );
}
