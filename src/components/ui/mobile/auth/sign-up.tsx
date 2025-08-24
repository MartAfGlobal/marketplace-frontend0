"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Mail from "@/assets/FormIcon/email.svg";
import FcGoogle from "@/assets/mobile/google_symbol.svg.png";

export default function SignUpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [email, setEmail] = useState("");

  // 🔹 Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 🔹 Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* 🔹 Bottom Modal */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-3.75 right-3.75 bg-white rounded-t-2xl shadow-lg p-8 z-50"
          >
            {step === "signup" && (
              <div className="space-y-c32">
                <div className="space-y-2">
                  <h2 className="font-MontserratSemiBold text-c20">Sign up</h2>
                  <p className="font-MontserratNormal text-sm">
                    Have access to the largest African market at your fingertips
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="space-y-2">
                    <label className="text-c12 font-MontserratNormal">
                      Email address
                    </label>
                    <div className="relative w-full mb-4">
                      <Image
                        src={Mail}
                        alt="Email"
                        width={16}
                        height={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-000000/10 rounded-lg pl-10 pr-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep("verify")}
                    className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold flex justify-center items-center gap-2"
                  >
                    Sign Up
                  </button>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className="flex-1 h-px bg-000000" />
                    <span> or </span>
                    <div className="flex-1 h-px bg-000000" />
                  </div>
                  <button className="w-full  h-c56 rounded-lg font-medium flex justify-center items-center gap-4 circle-shadow">
                    <Image src={FcGoogle} alt="Google" width={24} height={24} />
                    Sign up with Google
                  </button>
                </div>

                <p className="text-sm text-center font-MontserratNormal">
                  Already have an account?
                  <span className="text-6a0dad font-medium cursor-pointer">
                    Sign in
                  </span>
                </p>
              </div>
            )}

            {step === "verify" && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-c20 font-MontserratSemiBold">
                    Verify your email address
                  </h2>
                  <p className="font-MontserratNormal text-sm">
                    A verification link has been sent to your email. Check your
                    inbox and click the link to proceed
                  </p>
                </div>

                <button className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold">
                 Opem mail app
                </button>

               <div>
                 <p className="text-sm font-MontserratNormal">
                  Didn’t get the email?
                </p>
                <div className="flex justify-center gap-4 text-sm font-MontserratSemiBold text-6a0dad mt-2">
                  <button className="">Resend verification</button>
                  <button onClick={() => setStep("signup")}>
                    Change email
                  </button>
                </div>
               </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
