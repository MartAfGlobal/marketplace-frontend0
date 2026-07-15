"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { BusinessRegisterParams, RegisterParams } from "@/types/global";
import { EyeOffIcon } from "lucide-react";
import BusinessIcon from "@/assets/FormIcon/NameIcon.svg";
import Image from "next/image";
import { DropdownInput } from "./sellers/registrastionSteps/registered-business/modals/business-type";
import { setBusinessStep } from "@/store/slices/registration-slice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/use-http";
import { Root } from "react-dom/client";
import { RootState } from "@/store";
import { LoadingSpinner } from "../../loading-spinner";

type BusinessType = "registered" | "individual";

interface RegProps {
  userType: string;
}

const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Federal Capital Territory",
];

export default function RegisterFormStep2({ userType }: RegProps) {
  const [businessType, setBusinessType] = useState(false);
  const router = useRouter();

  const email = useSelector((state: RootState) => state.registration.email);
  const token = useSelector((state:RootState)=>state.token?.token)

  const { loading, error, sendHttpRequest: registerUserReq } = useHttp();
  const { loading: fetchingIndustry, sendHttpRequest } = useHttp();
  const [businessIndustry, setBusinessIndustry] = useState<string[]>([]);
  const [shippingZone, setShippingZone] = useState<{ label: string; value: string }[]>([])

  const dispatch = useDispatch();

  const [formData, setFormData] = useState<BusinessRegisterParams>({
    company_name: "",

    business_industry: "",
    shipping_zone: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      is_registered_business: businessType === true,
    }));
  }, [businessType]);

  const Invalid =
    !formData.company_name ||
    !formData.business_industry ||
    !formData.shipping_zone;

  useEffect(() => {
    sendHttpRequest({
      requestConfig: {
        url: `/accounts/manufacturer/business-industries/`,
        method: "GET",
        body: {
          ...formData,
        },
        userType: "seller",
      },
      successRes: (res: any) => {
        const industries = res.data.map((item: any) => item.value);

        console.log("Business", res.data, industries);

        setBusinessIndustry(industries);
        console.log("Business Industries", businessIndustry);
      },
    });
    sendHttpRequest({
      requestConfig: {
        url: `/shippingcalculator/zones/active/`,
        method: "GET",
        body: {
          ...formData,
        },
        userType: "seller",
      },
      successRes: (res: any) => {
        const shippingZones = res.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));

        console.log("Business", res.data, shippingZones);

        setShippingZone(shippingZones);
        console.log("Business shippingZone", shippingZone);
      },
    });
  }, []);

  const registerUserRes = (res: any) => {
    if (businessType) {
      router.push(`/auth/seller/sign-up/reg-registration-step3`);
      return;
    } else {
      router.push(`/auth/seller/sign-up/individual-registration-step3`);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    if(!token){
      return
    }

    
    console.log("Submitting payload:", {
      ...formData,
      is_registered_business: businessType,

      
    }, "is token trueee:", token);
    e.preventDefault();
    if (Invalid) {
      return;
    }
    registerUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: `/accounts/manufacturer/basic-info/`,
        method: "PATCH",
        body: {
          ...formData,
          is_registered_business: businessType,
        },
        token,
        userType: "seller",
        successMessage: "Shop information saved successfully.",
      },
    });
  };

  return (
    <div className="w-full h-full text-000000/78">
      {/* ================= Business Type Toggle ================= */}
      <div>
        <h1 className="mt-2 font-MontserratMedium">Business type</h1>

        <div className="flex text-nowrap items-center text-c12 font-MontserratMedium md:gap-6 gap-4  mt-3 mb-6">
          {/* Registered Company */}
          <button
            type="button"
            onClick={() => setBusinessType(true)}
            className="flex items-center gap-2"
          >
            <span className="w-4.5 h-4.5 rounded-full border border-ff715b flex items-center justify-center">
              {businessType && (
                <span className="w-2.5 h-2.5 bg-ff715b rounded-full" />
              )}
            </span>
            <p>Registered company</p>
          </button>

          {/* Individual */}
          <button
            type="button"
            onClick={() => setBusinessType(false)}
            className="flex items-center gap-2"
          >
            <span className="w-4.5 h-4.5 rounded-full border border-ff715b flex items-center justify-center">
              {!businessType && (
                <span className="w-2.5 h-2.5 bg-ff715b rounded-full" />
              )}
            </span>
            <p>Individual</p>
          </button>
        </div>
      </div>

      {/* ================= Conditional Forms ================= */}
      <div className="w-full h-full">
        <div className="h-full w-ful">
          <form className="" onSubmit={handleSubmit}>
            <fieldset>
              <div className="flex flex-col gap-2 pt-2">
                <Label className="text-c12 font-MontserratMedium ">
                  Business name
                </Label>
                <Input
                  icon={
                    <Image
                      src={BusinessIcon}
                      alt="email"
                      width={20}
                      height={20}
                    />
                  }
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      company_name: e.target.value,
                    })
                  }
                  className="border border-efefef "
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Label className="text-c12 font-MontserratMedium ">
                  Business Industry
                </Label>
                <DropdownInput
                  loading={fetchingIndustry}
                  placeholder="Select business industry"
                  options={[...businessIndustry]}
                  value={formData.business_industry}
                  onChange={(val) =>
                    setFormData({ ...formData, business_industry: val })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 pt-3 ">
                <Label className="text-c12 font-MontserratMedium ">
                  Shipping zone
                </Label>
                <DropdownInput
                  placeholder="Enter shipping zone"
                  options={shippingZone}
                  value={formData.shipping_zone}
                  onChange={(val) =>
                    setFormData({ ...formData, shipping_zone: val })
                  }
                />
              </div>
            </fieldset>

            <Button
              className="mt-6"
              type="submit"
              disabled={loading || Invalid}
            >
              {loading ? <LoadingSpinner /> : "Next"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
