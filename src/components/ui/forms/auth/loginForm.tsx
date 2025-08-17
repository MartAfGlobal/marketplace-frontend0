"use client";

import { Input } from "../Input";
import { Label } from "../Label";
import Link from "next/link";
import { Button } from "../../Button/Button";
import { useState } from "react";
import Image from "next/image";
import Google from "@/assets/socialIcons/Google.svg";
import eye from "@/assets/FormIcon/eyeIcon.svg";
import Email from "@/assets/FormIcon/email.svg";

export default function LoginForm() {
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isFormValid = email !== "" && password !== "";

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);
  //   };

  return (
    <div className="w-full">
      <form className="">
        <div className="flex flex-col gap-2 pt-4">
          <Label className="text-c12 font-MontserratMedium ">email</Label>
          <Input
            icon={<Image src={Email} alt="email" width={20} height={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-efefef "
          />
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <Label className="text-c12 font-MontserratMedium ">Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            icon={
              <button type="button" onClick={toggleVisibility}>
                <Image src={eye} alt="email" width={20} height={20} />
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" "
          />
        </div>
        <div className="flex justify-between pt-6  mb-c32 items-center">
          <div className="flex items-center gap-2">
            <label className="relative flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="peer h-5 w-5 rounded-c4 border cursor-pointer border-ff715b appearance-none checked:bg-ff715b checked:border-ff715b"
              />
              {/* Custom checkmark */}
              <span className="absolute left-0 top-0 h-5 w-5 flex items-center justify-center text-white font-bold scale-0 peer-checked:scale-100 transition-transform">
                ✓
              </span>
              <span className="text-c12 font-MontserratMedium text-161616">
                Remember me
              </span>
            </label>
            <label
              htmlFor="check"
              className="text-c12 font-MontserratMedium text-161616"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-ff715b text-c12 font-MontserratMedium "
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          //   loading={isSubmitting}
          disabled={!isFormValid}
        >
          Sign in
        </Button>
      </form>
      <div className="flex justify-between items-center gap-c24 mt-c8 mb-c8 h-c24">
        <p className="h-c1 w-full bg-efefef"></p>
        <p className="text-base font-MontserratNormal">or</p>
        <p className="h-c1 w-full bg-efefef"></p>
      </div>
      <div>
        <button className="w-full border flex items-center justify-center h-c56 font-MontserratSemiBold text-base gap-4 border-161616 rounded-c8">
          <Image src={Google} alt="google sign in" />
          Sign in with Google
        </button>
      </div>
      <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-c24">
        <p className="text-161616"> Don’t have an account?</p>
        <Link href="/auth/register" className="text-ff715b">
          Sign up
        </Link>
      </div>
    </div>
  );
}
