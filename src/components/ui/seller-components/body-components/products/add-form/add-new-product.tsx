"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";

import { Input } from "@/components/ui/forms/Input";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { Textarea } from "@/components/ui/forms/auth/text-area";
import PlusIcon from "@/assets/Seller/plusIcon.png";

export default function AddProductForm() {
  const [gender, setGender] = useState<string>("");

  const genderOptions = ["Men", "Women", "Unisex"];

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [keyFeature, setKeyFeature] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<{ color: string; image: string }[]>(
    []
  );
  const [color, setColor] = useState("");

  
  const mainImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const variantImageRef = useRef<HTMLInputElement>(null);



  // convert file to base64 for preview
  const getFilePreview = (file: File, cb: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Main image
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      getFilePreview(e.target.files[0], (url) => setMainImage(url));
    }
  };

  // Additional images
  const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) =>
        getFilePreview(file, (url) =>
          setAdditionalImages((prev) => [...prev, url])
        )
      );
    }
  };

  // Variant image
  const handleVariantImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && color.trim()) {
      getFilePreview(e.target.files[0], (url) => {
        setVariants((prev) => [...prev, { color, image: url }]);
      });
      setColor(""); // reset after add
    }
  };

  return (
    <div className="w-full h-fit">
      <form action="" className="w-full h-fit">
           <div className="flex w-full gap-c48 h-235">
          {/* LEFT SECTION - slides from left */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full h-235 rounded-xl text-000000/60 bg-ffffff p-8 space-y-6"
          >
            <h1 className="text-c18 font-MontserratSemiBold text-000000">
              General Information
            </h1>

            <div className="text-c12 font-MontserratMedium w-full">
              <label>Name of Product</label>
              <Input placeholder="Enter product name" className="mt-2" />
            </div>

            <div className="text-c12 font-MontserratMedium space-y-2 w-full">
              <label>Product Description</label>
              <Textarea
                placeholder="Product description"
                className="mt-2 rounded-lg h-30"
              />
            </div>

            <div className="w-full h-fit text-c12 font-MontserratMedium">
              <label>Select Category</label>
              <DropdownInput
                placeholder="Enter business type"
                options={["Fashion", "Sole Proprietor", "Partnership"]}
              />
            </div>

            <div className="w-full h-fit text-c12 font-MontserratMedium">
              <label>Select Subcategory</label>
              <DropdownInput
                placeholder="Select Subcategory"
                options={["Adult Wears", "Sole Proprietor", "Partnership"]}
              />
            </div>

            <div className="w-full">
              <label>Gender</label>
              <div className="flex gap-10 w-full items-center text-base font-normal mt-6">
                {genderOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setGender(option)}
                  >
                    <div
                      className={`rounded-full h-6 w-6 flex items-center justify-center border ${
                        gender === option
                          ? "bg-[#FF715B] border-0"
                          : "border-[#FF715B] bg-white"
                      }`}
                    >
                      {gender === option && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" stroke="white" />
                        </svg>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full mt-c48">
              <h1 className="text-c18 font-MontserratSemiBold text-000000">
                Pricing and Stock
              </h1>
              <div className="w-full flex items-center gap-6 mt-c32">
                <div className="text-c12 font-MontserratMedium w-full">
                  <label>Add Price</label>
                  <Input placeholder="Enter product name" className="mt-2" />
                </div>

                <div className="text-c12 font-MontserratMedium w-full">
                  <label>Add Price Range (optional)</label>
                  <div className="h-fit w-full relative mt-2">
                    <Input
                      placeholder="Enter product name"
                      className=" w-full"
                    />
                    <button className="absolute top-1/2 -translate-1/2 right-3.5">
                      <Image src={PlusIcon} alt="Add" width={15} height={15} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-6 mt-c32">
                <div className="text-c12 font-MontserratMedium w-full">
                  <label>Stock</label>
                  <Input placeholder="Enter quantity" className="mt-2" />
                </div>
                <div className="w-full h-fit text-c12 font-MontserratMedium">
                  <label>Discount Type</label>
                  <DropdownInput
                    placeholder="Enter business type"
                    options={["No Discount", "Sole Proprietor", "Partnership"]}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full h-235 overflow-y-scroll rounded-xl text-000000/60 bg-ffffff p-8 space-y-c48"
          >
            <h1 className="text-c18 font-MontserratSemiBold text-000000">
              Upload Image
            </h1>

            {/* Main Image */}
            <div className="text-c12 font-MontserratMedium w-full">
              <div className="h-fit w-full relative mt-2">
                <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImage}
                  className="hidden"
                />
                <Input
                  placeholder="Add Main Image"
                  className="w-full"
                  readOnly
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-1/2 right-3.5"
                  onClick={() => mainImageRef.current?.click()}
                >
                  <Image src={PlusIcon} alt="Add" width={15} height={15} />
                </button>
              </div>
              {mainImage && (
                <div className="mt-4 w-full h-90  flex justify-center">
                  <div className=" w-90 h-90 rounded-c12 ">
                    <Image
                      width={90}
                      height={90}
                      src={mainImage}
                      alt="Main"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="text-c12 font-MontserratMedium w-full">
              <div className="h-fit w-full relative ">
                <input
                  ref={additionalImagesRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImages}
                  className="hidden"
                />
                <Input
                  placeholder="Upload Additional Image (Max 8)"
                  className="w-full"
                  readOnly
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-1/2 right-3.5"
                  onClick={() => additionalImagesRef.current?.click()}
                >
                  <Image src={PlusIcon} alt="Add" width={15} height={15} />
                </button>
              </div>
              {additionalImages.length > 0 && (
                <div className="flex gap-6 no-scrollbar mt-4 overflow-x-auto">
                  {additionalImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Additional ${idx}`}
                      className="w-25 h-25 object-cover rounded-lg flex-shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>
            <h1 className="text-c18 font-MontserratSemiBold text-000000">
              Add Variants
            </h1>
            <h1 className="text-c18 font-MontserratSemiBold text-000000 mt-6">
              Add Variants
            </h1>
            <div>
                <div className="flex w-full gap-6">
              <div className="text-c12 font-MontserratMedium w-full">
                <label>Add Colour</label>
                <Input
                  placeholder="Enter Colour"
                  className="mt-2"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="text-c12 font-MontserratMedium w-full">
                <label>Add Product Image</label>
                <div className="h-fit w-full relative mt-2">
                  <input
                    ref={variantImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleVariantImage}
                    className="hidden"
                  />
                  <Input
                    placeholder="Add Colour Image"
                    className="w-full"
                    readOnly
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-1/2 right-3.5"
                    onClick={() => variantImageRef.current?.click()}
                  >
                    <Image src={PlusIcon} alt="Add" width={15} height={15} />
                  </button>
                </div>
              </div>
            </div>

            {variants.length > 0 && (
              <div className="flex gap-5.5  overflow-y-scroll no-scrollbar  mt-6">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <img
                      src={v.image}
                      alt={v.color}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <span className="mt-2 text-base font-MontserratNormal text-000000">{v.color}</span>
                  </div>
                ))}
              </div>
            )}

            </div>
            <div className="w-full h-fit text-c12 font-MontserratMedium">
              <label>Add Size Format</label>
              <DropdownInput
                placeholder="Select Size Format"
                options={[
                  "Standard Size (S, M, L, etc.)",
                  "US",
                  "EU",
                  "UK",
                  "China",
                ]}
              />
            </div>
          </motion.div>
        </div>

      

        {/* BOTTOM SECTION - slides from bottom */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="w-full mt-c48 h-60 rounded-xl text-000000/60 bg-ffffff p-8 space-y-c48"
        >
          <h1 className="text-c18 font-MontserratSemiBold text-000000">
            Product Specification
          </h1>
          <div className="flex gap-10">
            <div className="text-c12 font-MontserratMedium w-full">
              <div className="h-fit w-full relative ">
                <Input placeholder="Add Key Features" className=" w-full" />
                <button className="absolute top-1/2 -translate-1/2 right-3.5">
                  <Image src={PlusIcon} alt="Add" width={15} height={15} />
                </button>
              </div>
            </div>
            <div className="text-c12 font-MontserratMedium w-full">
              <div className="h-fit w-full relative ">
                <Input placeholder="Add Specifications" className=" w-full" />
                <button className="absolute top-1/2 -translate-1/2 right-3.5">
                  <Image src={PlusIcon} alt="Add" width={15} height={15} />
                </button>
              </div>
            </div>
            <div className="text-c12 font-MontserratMedium w-full">
              <div className="h-fit w-full relative ">
                <Input
                  placeholder="Add What’s in the box"
                  className=" w-full"
                />
                <button className="absolute top-1/2 -translate-1/2 right-3.5">
                  <Image src={PlusIcon} alt="Add" width={15} height={15} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="w-full flex gap-c32 justify-end mt-c48">
          <Button variant="secondary" className="w-46.75">
            Save in draft
          </Button>
          <Button className="w-46.75">Add Product</Button>
        </div>
      </form>
    </div>
  );
}
