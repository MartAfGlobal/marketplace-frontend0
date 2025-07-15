"use client";
import React, { useEffect, useState } from "react";
//import { paymentMethods, shippingAddresses } from "@/app/checkout/page";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";
import { apiService } from "@/lib/api";
import { ShippingAddress } from "@/types/api";

interface Props {
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountPaymentAddress: React.FC<Props>  = ({setIsAddressModalOpen}) => {
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  // Load shipping addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addresses = await apiService.getShippingAddresses();
        setShippingAddresses(addresses);
        if (addresses.length > 0) {
          setSelectedAddress(addresses.find((a) => a.is_default)?.id || addresses[0].id);
        }
      } catch (err) {
        console.error(err);
        setErrors((prev) => ({ ...prev, address: "Failed to load shipping addresses" }));
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressOpen = () => {
    setIsAddressModalOpen(true)
  }
  // const shippingAddresses = [
  //   {
  //     id: 1,
  //     name: "Chisom Ebube Chris",
  //     phone: "+234703456234",
  //     address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
  //     isDefault: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Chisom Ebube Chris",
  //     phone: "+234703456234",
  //     address: "LEA Primary School Dakwo, Abuja Kabusa, Abuja, Nigeria, 900102",
  //     isDefault: false,
  //   },
  //   {
  //     id: 3,
  //     name: "John Doe",
  //     phone: "+234801234567",
  //     address: "Plot 123, Gwarinpa Estate, Abuja, FCT, Nigeria, 900108",
  //     isDefault: false,
  //   },
  // ];
  
  const paymentMethods = [
    {
      id: 1,
      type: "card",
      last4: "7167",
      provider: "Mastercard",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    },
    {
      id: 2,
      type: "card",
      last4: "7167",
      provider: "Visa",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
    },
    {
      id: 3,
      type: "card",
      last4: "7167",
      provider: "American Express",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
    },
    {
      id: 4,
      type: "wallet",
      name: "Pay with Flutterwave",
      logo: "https://flutterwave.com/images/logo/full.svg",
    },
    {
      id: 5,
      type: "wallet",
      name: "Pay with Paystack",
      logo: "https://paystack.com/assets/img/logo/paystack-logo-blue.svg",
    },
  ];

  const [showMoreAddresses, setShowMoreAddresses] = useState(false);
  const [showMorePayments, setShowMorePayments] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(1 as string | number);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [errors, setErrors] = useState<{ address?: string; payment?: string }>(
      {}
    );
  

  const visibleAddresses = showMoreAddresses
    ? shippingAddresses
    : shippingAddresses.slice(0, 2);
  const visiblePayments = showMorePayments
    ? paymentMethods
    : paymentMethods.slice(0, 3);

  return (
    <section className="mt-4">
       {/* Payment Method Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Payment method</h2>
          {paymentMethods.length > 3 && (
            <Link href="/account/payment-methods" className="hidden md:flex">
              <button className="text-[#FF715B] text-sm font-medium">
                View all
              </button>
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visiblePayments.map((payment) => (
            <div
              key={payment.id}
              className={`relative min-h-[152px] p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                selectedPayment === payment.id
                  ? "border-[#FF715B] bg-[black] text-[#ffff]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedPayment(payment.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center md:hidden  ${
                      selectedPayment === payment.id
                        ? "border-[#FF715B]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPayment === payment.id && (
                      <div className="w-3 h-3 bg-[#FF715B] rounded-full"></div>
                    )}
                  </div>
                  <div>
                    {payment.type === "card" ? (
                      <span className="font-medium text">
                        272080••••••{payment.last4}
                      </span>
                    ) : (
                      <span className="font-medium">{payment.name}</span>
                    )}
                  </div>
                </div>
                <div className="h-6 w-12 relative">
                  <Image
                    src={payment.logo}
                    alt={payment.provider || payment.name || ""}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 items-center justify-center hidden md:flex absolute right-4 bottom-4  ${
                  selectedPayment === payment.id
                    ? "border-[#FF715B]"
                    : "border-gray-300"
                }`}
              >
                {selectedPayment === payment.id && (
                  <div className="w-3 h-3 bg-[#ffff] rounded-full"></div>
                )}
              </div>
            </div>
          ))}
          <Link href="/account/payment-method/add" className="hidden md:block">
            <div className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-[#FF715B] transition-all flex items-center justify-center min-h-[140px]">
              <div className="flex flex-col items-center text-gray-600">
                <Plus className="w-6 h-6 mb-1 text-[#343330]" />
                <span className="text-sm font-medium">Add new card</span>
              </div>
            </div>
          </Link>
        </div>

        {paymentMethods.length > 3 && (
          <Link href="/account/payment-methods">
            <button className="text-[#FF715B] text-sm font-medium mt-3 md:hidden">
              See more
            </button>
          </Link>
        )}

        {errors.payment && (
          <p className="text-red-500 text-sm mt-2">{errors.payment}</p>
        )}
      </div>


      {/* Shipping Address Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Shipping address</h2>
            {errors.address && (
              <p className="text-red-500 text-sm mt-2">{errors.address}</p>
            )}
          </div>

          <div>
            {shippingAddresses.length > 2 && (
              <button
                className="text-[#FF715B] text-sm font-medium hidden md:flex"
                onClick={() => setShowMoreAddresses(!showMoreAddresses)}
              >
                {showMoreAddresses ? "See less" : "View all"}
              </button>
            )}
            <Link href="/account/shipping-addresses">
              <button className="w-8 h-8 bg-[#FF715B] rounded-full flex items-center justify-center md:hidden">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visibleAddresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedAddress === address.id
                  ? "bg-[#7C2AE8] border-[#7C2AE8] text-white"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedAddress(address.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    selectedAddress === address.id
                      ? "bg-white border-white"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAddress === address.id && (
                    <div className="w-3 h-3 bg-[#7C2AE8] rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{address.full_name}</div>
                  <div className="text-sm mb-1">{address.phone}</div>
                  <div className="text-sm">{address.address}</div>
                </div>
              </div>
            </div>
          ))}
          
            <div className="hidden p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-[#FF715B] transition-all md:flex items-center justify-center min-h-[140px]" onClick={handleAddressOpen}>
              <div className="flex flex-col items-center text-gray-600" >
                <Plus className="w-6 h-6 mb-1 text-[#343330]" />
                <span className="text-sm font-medium">Add new address</span>
              </div>
            </div>
          
        </div>

        {shippingAddresses.length > 2 && (
          <button
            className="text-[#FF715B] text-sm font-medium mt-3 md:hidden"
            onClick={() => setShowMoreAddresses(!showMoreAddresses)}
          >
            {showMoreAddresses ? "See less" : "See more"}
          </button>
        )}

        {errors.address && (
          <p className="text-red-500 text-sm mt-2">{errors.address}</p>
        )}
      </div>

     
    </section>
  );
};

export default AccountPaymentAddress;
