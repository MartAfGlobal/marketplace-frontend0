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

export default function RegisterForm() {
 
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
    <div className=" w-full h-full">
      <div className="h-full w-ful">
        <form className="">
        <div className="flex flex-col gap-2 pt-2">
          <Label className="text-c12 font-MontserratMedium ">email</Label>
          <Input
            icon={<Image src={Email} alt="email" width={20} height={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-efefef "
          />
        </div>
        <div className="flex flex-col gap-2 pt-3 ">
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
        <div className="flex flex-col gap-2 pt-3 mb-c20">
          <Label className="text-c12 font-MontserratMedium ">Confirm password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            icon={
              <button type="button" onClick={toggleVisibility}>
                <Image src={eye} alt="email" width={20} height={20} />
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=""
          />
        </div>
      
        <Button
          type="submit"
        
          disabled={!isFormValid }
        >
          Create account
        </Button>
      </form>
      <div className="flex justify-between items-center gap-c24 mt-c8 mb-c8 h-c24">
        <p className="h-c1 w-full bg-efefef"></p>
        <p className="text-base font-MontserratNormal">or</p>
        <p className="h-c1 w-full bg-efefef"></p>
      </div>
      <div>
        <button className="w-full border flex items-center justify-center h-c48 font-MontserratSemiBold text-base gap-2 border-161616 rounded-c8">
          <Image src={Google} width={24} height={24} alt="google sign in" className="h-c24 w-24" />
          Sign in with Google
        </button>
      </div>
      <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-4">
        <p className="text-161616"> have an account?</p>
        <Link href="/auth/login" className="text-ff715b">
          Sign in
        </Link>
      </div>
      </div>
    </div>
  );
}
