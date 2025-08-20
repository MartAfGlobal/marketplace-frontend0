// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";



// const slides: Slide[] = [
//   {
//     id: 1,
//     image: "/ads/ad1.jpg",
//     title: "Summer Collection",
//     description: "Discover our hottest summer fashion trends",
//     discount: "25% OFF",
//   },
//   {
//     id: 2,
//     image: "/ads/ad2.jpg",
//     title: "Electronics Mega Sale",
//     description: "Upgrade your gadgets with amazing discounts",
//     discount: "Up to 40% OFF",
//   },
//   {
//     id: 3,
//     image: "/ads/ad3.jpg",
//     title: "Beauty Essentials",
//     description: "Glow up with our premium beauty products",
//     discount: "15% OFF",
//   },
// ];

// export default function ImageAdCarousel() {
//   const [current, setCurrent] = useState(0);

//   Auto slide every 5s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative w-full h-[400px] overflow-hidden rounded-2xl shadow-lg">
//       <AnimatePresence>
//         <motion.div
//           key={slides[current].id}
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -50 }}
//           transition={{ duration: 0.6 }}
//           className="absolute inset-0"
//         >
//           <img
//             src={slides[current].image}
//             alt={slides[current].title}
//             className="w-full h-full object-cover"
//           />

//           {/* Overlay Content */}
//           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
//             <motion.h2
//               initial={{ y: -20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-white text-3xl font-bold mb-2"
//             >
//               {slides[current].title}
//             </motion.h2>

//             <motion.p
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="text-white/90 text-lg mb-3"
//             >
//               {slides[current].description}
//             </motion.p>

//             <motion.span
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="bg-red-600 text-white px-4 py-1 rounded-full text-sm mb-4"
//             >
//               {slides[current].discount}
//             </motion.span>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-white text-black font-semibold px-6 py-2 rounded-full shadow-md"
//             >
//               Shop Now
//             </motion.button>
//           </div>
//         </motion.div>
//       </AnimatePresence>

//       {/* Pagination Dots */}
//       <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrent(index)}
//             className={`w-3 h-3 rounded-full transition-all ${
//               index === current ? "bg-white scale-125" : "bg-white/50"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
