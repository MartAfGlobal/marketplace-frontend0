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
import ResultModal from "@/components/ui/forms/resultModal";
import { Input } from "@/components/ui/forms/Input";
import RegisterForm from "@/components/ui/forms/auth/registerForm";
import { useDispatch, useSelector } from "react-redux";
import { registrationActions } from "@/store/auth/registration-slice";

import MobileLogin from "./sign-in";
import { AuthStep } from "@/types/global";

import ResetVerify from "./reset-verifyModal";
import ForgotPasswordModal from "./forgot-password";
import ResetPasswordModal from "./reset-passwordModal";

export default function AuthModal({
  open,
  onClose,
  defaultStep = "signup",
}: {
  open: boolean;
  onClose: () => void;
  defaultStep?: AuthStep;
}) {
  const [step, setStep] = useState<AuthStep>(defaultStep);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  // Pull saved email from Redux so it survives any component re-renders
  const savedEmail = useSelector((state: any) => state.registration.email);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, sendHttpRequest: registerUserReq } = useHttp();

  const [formData, setFormData] = useState({
    email: "",
  });

  const RESEND_TIMEOUT = 120;
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { loading: resendLoading, sendHttpRequest: resendUserReq } = useHttp();
  const { loading: verifying, sendHttpRequest: verifyOtpReq } = useHttp();

  useEffect(() => {
    if (step === "verificationSent") {
      setSecondsLeft(RESEND_TIMEOUT);
    }
  }, [step]);

  useEffect(() => {
    if (step !== "verificationSent" || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, step]);

  const resetTimer = () => {
    setSecondsLeft(RESEND_TIMEOUT);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`signup-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`signup-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifySignupOtp = () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    verifyOtpReq({
      requestConfig: {
        url: "/accounts/register/verify-otp/",
        method: "POST",
        body: {
          // Use saved Redux email as fallback in case formData cleared
          email: formData.email || savedEmail,
          otp: otpString,
        },
        userType: "buyer",
      },
      successRes: (res: any) => {
        console.log(" checking seller", res)
        // Some backends return 200 OK with an error in the body
        if (res?.data?.error || (res?.data?.status === false) || res?.data?.message?.toLowerCase().includes("invalid")) {
          toast.error(res?.data?.message || res?.data?.error || "Invalid OTP");
          return;
        }
        
        const token = res?.data?.token || otpString;
        dispatch(registrationActions.setToken(token));
        setVerifiedOtp(token);
        setStep("personalDetails");
      },
      errorRes: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.otp?.[0] ||
            "Invalid OTP"
        );
      },
    });
  };

  const handleResendLink = (e: React.FormEvent) => {
    e.preventDefault();

    resendUserReq({
      successRes: () => {
        setShowSuccessModal(true);
        resetTimer();
      },
      requestConfig: {
        url: "/accounts/register/resend-otp/",
        method: "POST",
        body: { email: formData.email },
        userType: "buyer",
      },
    });
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    if (open) {
      setStep(defaultStep);
    }
  }, [defaultStep, open]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registerUserRes = (res: any) => {
    dispatch(registrationActions.setEmail(formData.email));
    console.log("new res", res)
    setStep("verificationSent");
    
  };

  const handleRegisterError = (err: any) => {
    const data = err?.response?.data;
    const errorMsg = typeof data === "string" ? data : JSON.stringify(data);
    const lowerError = errorMsg.toLowerCase();
    if (
      lowerError.includes("already been sent") ||
      lowerError.includes("already sent")
    ) {
      dispatch(registrationActions.setEmail(formData.email));
      setStep("verificationSent");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email?.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    registerUserReq({
      successRes: registerUserRes,
      errorRes: handleRegisterError,
      requestConfig: {
        url: "/accounts/register",
        method: "POST",
        body: {
          email: formData.email,
        },
      },
    });

    console.log("Registration data:",  { email: formData.email });
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
    <>
      <AnimatePresence>
        {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 w-full "
            onClick={onClose}
          />

         <div className="fixed inset-0 flex items-end md:items-center justify-center md:p-4 px-4 z-[9999] pointer-events-none">
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white rounded-t-2xl shadow-lg p-8 z-50 pointer-events-auto"
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

            {step === "signin" && (
              <MobileLogin
                onClose={onClose} 
                setStep={setStep}
              />
            )}

            {/* ---------- FORGOT PASSWORD ---------- */}
            {step === "forgot" && (
              <ForgotPasswordModal
                onClose={onClose}
                setStep={setStep}
                setEmail={setEmail}
              />
            )}

            {/* ---------- RESET VERIFY (FORGOT PASSWORD) ---------- */}
            {step === "resetVerify" && (
              <ResetVerify onClose={onClose} setStep={setStep} email={email} />
            )}

            {step === "resetPassword" && (
              <ResetPasswordModal onClose={onClose} setStep={setStep} />
            )}

            {step === "verificationSent" && (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-c20 font-MontserratSemiBold">Enter OTP</h2>
                  <p className="font-MontserratNormal text-sm">
                    We’ve sent a 6-digit code to:
                    <br />
                    <span className="font-semibold text-ff715b">{formData.email}</span>
                    <br />
                    Enter it below to continue.
                  </p>
                </div>
                
                <div className="flex justify-center mb-8 gap-2 w-full">
                  {otp.map((digit, idx) => (
                    <Input
                      key={idx}
                      id={`signup-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-12 h-12 text-center text-xl font-MontserratBold px-0"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVerifySignupOtp}
                  disabled={otp.some((d) => d === "") || verifying}
                  className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold flex items-center justify-center disabled:opacity-50"
                >
                  {verifying ? <LoadingSpinner /> : "Verify"}
                </button>

                <button
                  type="button"
                  disabled={secondsLeft > 0 || resendLoading}
                  onClick={handleResendLink}
                  className={`w-full h-c48 rounded-lg text-c12 font-MontserratSemiBold flex items-center justify-center border ${
                    secondsLeft > 0
                      ? "border-[#EFEFEF] text-black/40 bg-transparent"
                      : "border-ff715b text-ff715b hover:bg-ff715b/5 bg-transparent"
                  }`}
                >
                  {resendLoading ? (
                    <LoadingSpinner color="border-ff715b" />
                  ) : secondsLeft > 0 ? (
                    `Resend OTP (${minutes}:${seconds.toString().padStart(2, "0")})`
                  ) : (
                    "Resend OTP"
                  )}
                </button>

                <p className="text-sm text-center font-MontserratNormal mt-4">
                  If you didn't receive the email, check your spam folder or{" "}
                  <span
                    onClick={() => setStep("signup")}
                    className="text-6a0dad font-medium cursor-pointer"
                  >
                    try signing up again
                  </span>
                </p>
              </div>
            )}

            {/* ---------- PERSONAL DETAILS ---------- */}
            {step === "personalDetails" && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-c20 font-MontserratSemiBold">Personal details</h2>
                  <p className="font-MontserratNormal text-sm">
                    Add your phone number and create your password
                  </p>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  <RegisterForm userType="buyer" token={verifiedOtp} onSuccess={onClose} />
                </div>
              </div>
            )}
          </motion.div>
          </div>
        </>
      )}
      </AnimatePresence>
      <ResultModal
        isOpen={showSuccessModal}
        title="Verification email resent"
        message="A new verification link has been resent to your email address."
        buttenText="Okay"
        onConfirm={() => setShowSuccessModal(false)}
        onCancel={() => setShowSuccessModal(false)}
      />
    </>
  );
}
