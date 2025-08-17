"use client";

import { Input } from "../Input";
import { Label } from "../Label";
import Link from "next/link";
import { Button } from "../../Button/Button";
import { useState } from "react";
import Image from "next/image";

import Email from "@/assets/FormIcon/email.svg";

export default function RecoveryEmailSent() {
 
  const [email, setEmail] = useState("");
    const isFormValid = email !== "";







  return (
    <div className="full">
      <form className="full">
        <div className="flex flex-col gap-2 pt-4 mb-c32">
          
        </div>
        
        <Button
          type="submit"
       
          disabled={!isFormValid}
        >
          Sign in
        </Button>
      </form>

      <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-c24">
       
        <Link href="/auth/login" className="text-ff715b">Return to login</Link>
      </div>
    </div>
  );
}
