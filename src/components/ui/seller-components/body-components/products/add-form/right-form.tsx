// import { motion } from "framer-motion"

// export default function RightForm(){

  
//   const genderOptions = ["Men", "Women", "Unisex"];

//     return(

//           <div className="flex w-full gap-c48 h-235">
//           <motion.div
//             initial={{ x: 100, opacity: 0 }}
//             whileInView={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//             viewport={{ once: true, amount: 0.2 }}
//             className="w-full h-235 overflow-y-scroll rounded-xl text-000000/60 bg-ffffff p-8 space-y-c48"
//           >
//             <h1 className="text-c18 font-MontserratSemiBold text-000000">
//               Upload Image
//             </h1>

//             {/* Main Image */}
//             <div className="text-c12 font-MontserratMedium w-full">
//               <div className="h-fit w-full relative mt-2">
//                 <input
//                   ref={mainImageRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleMainImage}
//                   className="hidden"
//                 />
//                 <Input
//                   placeholder="Add Main Image"
//                   className="w-full"
//                   readOnly
//                 />
//                 <button
//                   type="button"
//                   className="absolute top-1/2 -translate-1/2 right-3.5"
//                   onClick={() => mainImageRef.current?.click()}
//                 >
//                   <Image src={PlusIcon} alt="Add" width={15} height={15} />
//                 </button>
//               </div>
//               {mainImage && (
//                 <div className="mt-4 w-full h-90  flex justify-center">
//                   <div className=" w-90 h-90 rounded-c12 ">
//                     <Image
//                       width={90}
//                       height={90}
//                       src={mainImage}
//                       alt="Main"
//                       className="w-full h-full rounded-lg object-cover"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="text-c12 font-MontserratMedium w-full">
//               <div className="h-fit w-full relative ">
//                 <input
//                   ref={additionalImagesRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleAdditionalImages}
//                   className="hidden"
//                 />
//                 <Input
//                   placeholder="Upload Additional Image (Max 8)"
//                   className="w-full"
//                   readOnly
//                 />
//                 <button
//                   type="button"
//                   className="absolute top-1/2 -translate-1/2 right-3.5"
//                   onClick={() => additionalImagesRef.current?.click()}
//                 >
//                   <Image src={PlusIcon} alt="Add" width={15} height={15} />
//                 </button>
//               </div>
//               {additionalImages.length > 0 && (
//                 <div className="flex gap-6 no-scrollbar mt-4 overflow-x-auto">
//                   {additionalImages.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`Additional ${idx}`}
//                       className="w-25 h-25 object-cover rounded-lg flex-shrink-0"
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//             <h1 className="text-c18 font-MontserratSemiBold text-000000">
//               Add Variants
//             </h1>
//             <h1 className="text-c18 font-MontserratSemiBold text-000000 mt-6">
//               Add Variants
//             </h1>
//             <div>
//                 <div className="flex w-full gap-6">
//               <div className="text-c12 font-MontserratMedium w-full">
//                 <label>Add Colour</label>
//                 <Input
//                   placeholder="Enter Colour"
//                   className="mt-2"
//                   value={color}
//                   onChange={(e) => setColor(e.target.value)}
//                 />
//               </div>
//               <div className="text-c12 font-MontserratMedium w-full">
//                 <label>Add Product Image</label>
//                 <div className="h-fit w-full relative mt-2">
//                   <input
//                     ref={variantImageRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleVariantImage}
//                     className="hidden"
//                   />
//                   <Input
//                     placeholder="Add Colour Image"
//                     className="w-full"
//                     readOnly
//                   />
//                   <button
//                     type="button"
//                     className="absolute top-1/2 -translate-1/2 right-3.5"
//                     onClick={() => variantImageRef.current?.click()}
//                   >
//                     <Image src={PlusIcon} alt="Add" width={15} height={15} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {variants.length > 0 && (
//               <div className="flex gap-5.5  overflow-y-scroll no-scrollbar  mt-6">
//                 {variants.map((v, idx) => (
//                   <div key={idx} className="flex flex-col items-center">
//                     <img
//                       src={v.image}
//                       alt={v.color}
//                       className="w-24 h-24 object-cover rounded-lg"
//                     />
//                     <span className="mt-2 text-base font-MontserratNormal text-000000">{v.color}</span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             </div>
//             <div className="w-full h-fit text-c12 font-MontserratMedium">
//               <label>Add Size Format</label>
//               <DropdownInput
//                 placeholder="Select Size Format"
//                 options={[
//                   "Standard Size (S, M, L, etc.)",
//                   "US",
//                   "EU",
//                   "UK",
//                   "China",
//                 ]}
//               />
//             </div>
//           </motion.div>
//         </div>
//     )n

// }