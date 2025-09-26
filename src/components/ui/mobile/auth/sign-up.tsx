"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Mail from "@/assets/FormIcon/email.svg";
import FcGoogle from "@/assets/mobile/google_symbol.svg.png";
import { EyeIcon, EyeOffIcon, LogIn } from "lucide-react";
import { toast } from "sonner";
import { RegisterParams } from "@/types/global";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "../../loading-spinner";
import { tokenActions } from "@/store/token/token-slice";
import { useDispatch } from "react-redux";
import MobileLogin from "./sign-in";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<
    "signup" | "verify" | "signin" | "forgot" | "resetVerify"
  >("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { loading, sendHttpRequest: registerUserReq } = useHttp();

  const [formData, setFormData] = useState<RegisterParams>({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registerUserRes = (res: any) => {
    toast.success("Registration successful. Please sign in.");
    setStep("signin");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    registerUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/register",
        method: "POST",
        body: {
          ...formData,
        },
        successMessage: "Registration Complete, Please login.",
      },
    });

    console.log("Registration data:", { ...formData });
  };
  //  LogIn

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Modal */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-3.5 right-3.5 bg-white rounded-t-2xl shadow-lg p-8 z-50"
          >
            {/* ---------- SIGN UP ---------- */}
            {step === "signup" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="font-MontserratSemiBold text-c20">Sign up</h2>
                  <p className="font-MontserratNormal text-sm">
                    Have access to the largest African market at your fingertips
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="relative w-full">
                    <Image
                      src={Mail}
                      alt="Email"
                      width={16}
                      height={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-black/10 rounded-lg pl-10 pr-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
                      placeholder="Email address"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full border border-black/10 rounded-lg pr-10 pl-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative w-full">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      className="w-full border border-black/10 rounded-lg pr-10 pl-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Sign Up */}
                  <button
                    type="submit"
                    className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold flex items-center justify-center"
                  >
                    {loading ? <LoadingSpinner /> : "Sign Up"}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className="flex-1 h-px bg-black" />
                    <span>or</span>
                    <div className="flex-1 h-px bg-black" />
                  </div>

                  {/* Google */}
                  <button
                    type="button"
                    className="w-full h-c56 rounded-lg font-medium flex justify-center items-center gap-4 circle-shadow"
                    onClick={() => alert("Google Signup coming soon!")}
                  >
                    <Image src={FcGoogle} alt="Google" width={24} height={24} />
                    Sign up with Google
                  </button>
                </form>

                <p className="text-sm text-center font-MontserratNormal">
                  Already have an account?{" "}
                  <span
                    onClick={() => setStep("signin")}
                    className="text-6a0dad font-medium cursor-pointer"
                  >
                    Sign in
                  </span>
                </p>
              </div>
            )}

            {/* ---------- VERIFY EMAIL (SIGNUP) ---------- */}
            {step === "verify" && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-c20 font-MontserratSemiBold">
                    Verify your email address
                  </h2>
                  <p className="font-MontserratNormal text-sm">
                    A verification link has been sent to your email. Check your
                    inbox and click the link to proceed.
                  </p>
                </div>

                <button className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold">
                  Open mail app
                </button>

                <div>
                  <p className="text-sm font-MontserratNormal">
                    Didn’t get the email?
                  </p>
                  <div className="flex justify-center gap-4 text-sm font-MontserratSemiBold text-6a0dad mt-2">
                    <button>Resend verification</button>
                    <button onClick={() => setStep("signup")}>
                      Change email
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------- SIGN IN ---------- */}
            {step === "signin" && (
              <MobileLogin
                onClose={onClose} // ✅ pass down close handler
                setStep={setStep} 
             
              />
            )}

            {/* ---------- FORGOT PASSWORD ---------- */}
            {step === "forgot" && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="font-MontserratSemiBold text-c20">
                    Forgot password
                  </h2>
                  <p className="font-MontserratNormal text-sm">
                    Enter your email and we’ll send you a reset link.
                  </p>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-black/10 rounded-lg px-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
                  placeholder="Email address"
                />

                <button
                  onClick={() => setStep("resetVerify")}
                  className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold"
                >
                  Send reset link
                </button>

                <p className="text-sm text-center font-MontserratNormal">
                  Remember your password?{" "}
                  <span
                    onClick={() => setStep("signin")}
                    className="text-6a0dad font-medium cursor-pointer"
                  >
                    Sign in
                  </span>
                </p>
              </div>
            )}

            {/* ---------- RESET VERIFY (FORGOT PASSWORD) ---------- */}
            {step === "resetVerify" && (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-c20 font-MontserratSemiBold">
                    Check your email
                  </h2>
                  <p className="font-MontserratNormal text-sm">
                    We’ve sent a password reset link to your email. Click the
                    link to reset your password.
                  </p>
                </div>

                <button className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold">
                  Open mail app
                </button>

                <div>
                  <p className="text-sm font-MontserratNormal">
                    Didn’t get the email?
                  </p>
                  <div className="flex justify-center gap-4 text-sm font-MontserratSemiBold text-6a0dad mt-2">
                    <button>Resend link</button>
                    <button onClick={() => setStep("forgot")}>
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
