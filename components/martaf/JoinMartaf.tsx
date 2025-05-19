import React from "react";
import Image from "next/image";

const JoinMartaf = () => {
  return (
    <section className="w-full flex flex-col md:flex-row items-stretch min-h-[320px]">
      {/* Left: Image */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto">
        <Image src="/assets/man.png" alt="Join Martaf" fill className="object-cover" priority />
      </div>
      {/* Right: Content */}
      <div className="flex flex-col justify-center items-start bg-[#7C2AE8] text-white p-8 md:w-1/2">
        <div className="max-w-md mx-auto">
          <div className="mb-2 text-sm opacity-80">Empowering African Commerce</div>
          <h2 className="text-3xl font-bold mb-2">Join Martaf Today</h2>
          <p className="mb-6 opacity-90">Become a part of Africa's largest e-commerce marketplace. Whether you're a buyer or a seller, we offer the tools and support you need to succeed.</p>
          <button className="px-8 py-3 rounded bg-white text-[#7C2AE8] font-semibold text-base transition hover:bg-gray-200">Register now</button>
        </div>
      </div>
    </section>
  );
};

export default JoinMartaf; 