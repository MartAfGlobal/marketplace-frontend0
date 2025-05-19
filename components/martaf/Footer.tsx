import { Facebook, Twitter, Instagram, Linkedin, X, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#18181B] text-white pt-8 pb-4 px-4 md:px-12">
      {/* Top: Logo and Socials */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto w-full mb-8 gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-white rounded p-1"><span className="text-[#7C2AE8] font-black text-2xl">M</span></span>
          <span className="font-bold text-2xl tracking-wide">MARTAF</span>
        </div>
        <div className="flex items-center gap-3 text-lg">
          <span className="text-base font-normal">Follow Us :</span>
          <a href="#" aria-label="X"><X className="w-5 h-5 hover:text-[#7C2AE8]" /></a>
          <a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-[#7C2AE8]" /></a>
          <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-[#7C2AE8]" /></a>
          <a href="#" aria-label="Linkedin"><Linkedin className="w-5 h-5 hover:text-[#7C2AE8]" /></a>
          <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5 hover:text-[#7C2AE8]" /></a>
        </div>
      </div>
      <div className="border-t border-gray-700 max-w-7xl mx-auto w-full mb-2 pb-5"></div>
      {/* Middle: 5 columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl mx-auto w-full mb-6">
        <div>
          <div className="font-semibold mb-3">Company Info</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Return Policy</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Help</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#">Support center</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Purchase Protection</a></li>
            <li><a href="#">Sitemap</a></li>
            <li><a href="#">Partner with us</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Selling on MartAf</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#">Become a Seller</a></li>
            <li><a href="#">Login to Seller Panel</a></li>
            <li><a href="#">MartAf Seller Policy</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Contacts</div>
          <div className="text-sm opacity-80 mb-2">
            <div>Address:</div>
            <div>No. 353 road and street, Ikota, Lagos State, Nigeria</div>
          </div>
          <div className="text-sm opacity-80 mb-2">Phone :<br />+234-024316870</div>
          <div className="text-sm opacity-80 mb-2">Email :<br />info@martaf.com.ng</div>
        </div>
        <div>
          <div className="font-semibold mb-3">Newsletter</div>
          <form className="bg-[#232326] rounded-xl p-4 flex flex-col gap-3">
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="rounded w-full px-3 py-1.5 pr-10 text-black bg-white focus:outline-none"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" className="accent-[#7C2AE8]" />
              I agree with privacy terms and policy
            </label>
            <button
              type="submit"
              className="mt-2 w-full border border-white text-white bg-black rounded-full px-4 py-2 font-semibold hover:bg-[#18181B] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-700 max-w-7xl mx-auto w-full mb-2"></div>
      {/* Copyright */}
      <div className="text-center text-xs opacity-70">© Martaf 2025. All rights reserved</div>
    </footer>
  );
};

export default Footer; 