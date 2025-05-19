import React from "react";

const Footer = () => {
  return (
    <footer className="w-full p-8 bg-gray-900 text-white">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* Links */}
        <div>Links</div>
        {/* Newsletter */}
        <div>Newsletter</div>
        {/* Socials */}
        <div>Socials</div>
      </div>
      <div className="mt-8 text-center text-xs">Martaf 2025. All rights reserved.</div>
    </footer>
  );
};

export default Footer; 