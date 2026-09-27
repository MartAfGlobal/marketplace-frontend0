"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import {
  FaFacebook,
  FaWhatsapp,
  FaXTwitter,
  FaLinkedin,
  FaTelegram,
} from "react-icons/fa6";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      bgColor: "bg-[#25D366] hover:bg-[#20ba59]",
      textColor: "text-white",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      bgColor: "bg-[#1877F2] hover:bg-[#166fe5]",
      textColor: "text-white",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X (Twitter)",
      icon: FaXTwitter,
      bgColor: "bg-black hover:bg-neutral-800",
      textColor: "text-white",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      bgColor: "bg-[#0A66C2] hover:bg-[#095196]",
      textColor: "text-white",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      bgColor: "bg-[#229ED9] hover:bg-[#1d8bc0]",
      textColor: "text-white",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-lg font-MontserratSemiBold text-gray-900">
              Share Product
            </h3>
            <button
              onClick={onClose}
              aria-label="Close share modal"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Social icons */}
          <div className="py-6">
            <p className="text-xs font-MontserratMedium text-gray-500 mb-3">
              Share via
            </p>
            <div className="flex items-center justify-around gap-2">
              {shareOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <a
                    key={opt.name}
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${opt.bgColor} ${opt.textColor} shadow-sm transition-transform group-hover:scale-105`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-MontserratMedium text-gray-600 group-hover:text-gray-900 text-center">
                      {opt.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copy link input */}
          <div>
            <p className="text-xs font-MontserratMedium text-gray-500 mb-2">
              Or copy link
            </p>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1.5 bg-gray-50">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-transparent text-xs text-gray-700 px-2 outline-none font-MontserratNormal truncate"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-ff715b text-white text-xs font-MontserratMedium rounded-md hover:bg-[#e05d4a] transition-colors whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
