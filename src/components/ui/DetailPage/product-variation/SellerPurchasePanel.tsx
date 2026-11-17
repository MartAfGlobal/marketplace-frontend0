"use client";

import Image from "next/image";
import { ProductDetail, ProductVariation } from "@/types/global";
import ItemAddToCart from "@/components/ui/ItemAddToCart";
import truck from "@/assets/icons/truck.png";
import Security from "@/assets/icons/security-check.svg";
import refund from "@/assets/icons/refund.svg";
import Location from "@/assets/mobile/MapPinArea.png";

interface SellerPurchasePanelProps {
  productDetails: ProductDetail | null;
  selectedVariation: ProductVariation | null;
  isModal: boolean;
  onIncompleteVariation: () => void;
}

export default function SellerPurchasePanel({
  productDetails,
  selectedVariation,
  isModal,
  onIncompleteVariation,
}: SellerPurchasePanelProps) {
  return (
    <>
      {/* Desktop purchase card and mobile seller details intentionally use separate layouts. */}
      {!isModal && (
        <>
          <div className="w-full md:max-w-[260px] lg:max-w-[300px] xl:max-w-110.5 hidden md:block p-6 bg-ffffff rounded-c16 shadow-customW h-fit sticky top-32 ">
            <div className="">
              <div className=" flex flex-col   gap-c24 pb-4 md:border-b md:border-gray-100">
                <div className="w-full flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="h-c88 w-c88 rounded-c12 bg-gray-100 flex items-center justify-center text-center overflow-hidden">
                      {productDetails?.seller?.company_logo ? (
                        <Image
                          src={productDetails.seller.company_logo}
                          alt="Seller logo"
                          width={88}
                          height={88}
                          className="object-cover"
                        />
                      ) : (
                        <p className="font-MontserratBold text-c12 text-000000">
                          COMPANY LOGO
                        </p>
                      )}
                    </div>
                    <div>
                      <h1 className="font-MontserratSemiBold text-161616 text-c18">
                        {productDetails?.manufacturer_name}
                      </h1>
                      <div className="flex gap-2 items-center">
                        <div className="w-5 h-5">
                          <Image
                            src={Location}
                            alt="location"
                            width={20}
                            height={20}
                          />
                        </div>
                        <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                          {productDetails?.seller?.address?.state ||
                            productDetails?.seller?.company_address?.state ||
                            "Suppliers Location"}
                        </p>
                      </div>
                      {/* <div className="md:hidden flex gap-2 items-center">
                        <div className="w-5 h-5">
                          <Image
                            src={phone}
                            alt="phone"
                            width={20}
                            height={20}
                          />
                        </div>
                        <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                          +234 80312345678
                        </p>
                      </div> */}
                    </div>
                  </div>
                </div>
                {/* Shipping Info */}
                <div className="md:flex gap-4 items-start hidden ">
                  {/* <div>
                    <Image
                      src={truck}
                      alt="truck"
                      width={22.5}
                      height={15.76}
                    />
                  </div> */}
                  {/* <div className="md:flex flex-col gap-2">
                    <p className="font-MontserratSemiBold text-base text-161616">
                      Shipping fee
                    </p>
                    <p className="text-c12 font-MontserratMedium text-gray-500">
                      Delivery:{" "}
                      <span className="font-MontserratSemiBold text-c12 text-161616">
                        May 25, 2020
                      </span>
                    </p>
                    <p className="text-c12 font-MontserratMedium text-gray-500">
                      Courier company:{" "}
                      <span className="font-MontserratSemiBold text-c12 text-161616">
                        SpeedAf
                      </span>
                    </p>
                  </div> */}
                </div>
                {/* Security & Refund */}
                <div className="space-y-6 ">
                  <div className="flex gap-4 items-start">
                    <Image
                      src={Security}
                      alt="security check"
                      width={22.5}
                      height={15.76}
                    />
                    <div className="flex flex-col gap-2">
                      <p className="font-MontserratSemiBold text-sm text-161616">
                        Secure payments
                      </p>
                      <p className="text-sm font-MontserratNormal text-gray-500">
                        Every payment you make on MartAf is secured with strict
                        SSL encryption and PCI DSS data protection protocols
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <Image
                      src={refund}
                      alt="refund"
                      width={26}
                      height={24.76}
                    />
                    <div className="flex flex-col gap-2">
                      <p className="font-MontserratSemiBold text-sm text-161616">
                        Standard refund policy
                      </p>
                      <p className="text-sm font-MontserratNormal text-gray-500">
                        Claim a refund if your order doesn&apos;t ship, is
                        missing, or arrives with product issues
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ItemAddToCart
                selectedVariation={selectedVariation}
                productId={productDetails?.id || ""}
                isModal={isModal}
                product_slug={productDetails?.slug || ""}
                product_name={productDetails?.name || ""}
                onIncompleteVariation={onIncompleteVariation}
              />
            </div>
          </div>
          <div className="md:hidden flex flex-col-reverse mt-c32 m  gap-c24 pb-4 md:border-b md:border-gray-100">
            <div className="w-full flex justify-between items-start">
              <div className="flex gap-4">
                <div className="h-c88 w-c88 rounded-c12 bg-f89f1c flex items-center justify-center text-center overflow-hidden">
                  {productDetails?.seller?.company_logo ? (
                    <Image
                      src={productDetails.seller.company_logo}
                      alt="Seller logo"
                      width={88}
                      height={88}
                      className="object-cover"
                    />
                  ) : (
                    <p className="font-MontserratBold text-c12 text-000000">
                      COMPANY LOGO
                    </p>
                  )}
                </div>
                <div>
                  <h1 className="font-MontserratSemiBold text-161616 text-c18">
                    {productDetails?.manufacturer_name || "Seller Name"}
                  </h1>
                  <div className="flex gap-2 items-center">
                    <div className="w-5 h-5">
                      <Image
                        src={Location}
                        alt="location"
                        width={20}
                        height={20}
                      />
                    </div>
                    <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                      {productDetails?.seller?.address?.state ||
                        productDetails?.seller?.company_address?.state ||
                        "Suppliers Location"}
                    </p>
                  </div>
                  {/* <div className="md:hidden flex gap-2 items-center">
                    <div className="w-5 h-5">
                      <Image src={phone} alt="phone" width={20} height={20} />
                    </div>
                    <p className="font-MontserratMedium text-c12 text-161616 pt-1 pb-2">
                      +234 80312345678
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
            {/* Shipping Info */}
            <div className="md:flex gap-4 items-start hidden">
              <div>
                <Image src={truck} alt="truck" width={22.5} height={15.76} />
              </div>
              <div className="md:flex flex-col gap-2">
                <p className="font-MontserratSemiBold text-base text-161616">
                  Shipping fee
                </p>
                <p className="text-c12 font-MontserratMedium text-gray-500">
                  Delivery:{" "}
                  <span className="font-MontserratSemiBold text-c12 text-161616">
                    May 25, 2020
                  </span>
                </p>
                <p className="text-c12 font-MontserratMedium text-gray-500">
                  Courier company:{" "}
                  <span className="font-MontserratSemiBold text-c12 text-161616">
                    SpeedAf
                  </span>
                </p>
              </div>
            </div>
            {/* Security & Refund */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <Image
                  src={Security}
                  alt="security check"
                  width={22.5}
                  height={15.76}
                />
                <div className="flex flex-col gap-2">
                  <p className="font-MontserratSemiBold text-sm text-161616">
                    Secure payments
                  </p>
                  <p className="text-sm font-MontserratNormal text-gray-500">
                    Every payment you make on MartAf is secured with strict SSL
                    encryption and PCI DSS data protection protocols
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Image src={refund} alt="refund" width={26} height={24.76} />
                <div className="flex flex-col gap-2">
                  <p className="font-MontserratSemiBold text-sm text-161616">
                    Standard refund policy
                  </p>
                  <p className="text-sm font-MontserratNormal text-gray-500">
                    Claim a refund if your order doesn&apos;t ship, is missing,
                    or arrives with product issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
