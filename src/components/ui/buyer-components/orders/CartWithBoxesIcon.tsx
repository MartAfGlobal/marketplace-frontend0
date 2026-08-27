"use client";

import React from "react";

interface CartWithBoxesProps {
  className?: string;
  itemsCount?: number;
}

export default function CartWithBoxesIcon({
  className = "w-24 h-24",
  itemsCount,
}: CartWithBoxesProps) {
  return (
    <div
      className={`relative flex items-center justify-center  overflow-hidden select-none shrink-0 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className="w-full h-full p-2"
        fill="none"
      >
        <defs>
          <linearGradient id="boxGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="boxGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="boxGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* --- BOX 1 (Back Left Box) --- */}
        <g id="box-back-left">
          <rect
            x="19"
            y="11"
            width="15"
            height="17"
            rx="1.5"
            fill="#fcd34d"
            stroke="#d97706"
            strokeWidth="1.2"
          />
          <rect x="25.5" y="11" width="2.5" height="17" fill="#b45309" opacity="0.3" />
          <line
            x1="19"
            y1="15"
            x2="34"
            y2="15"
            stroke="#d97706"
            strokeWidth="0.8"
            opacity="0.6"
          />
        </g>

        {/* --- BOX 2 (Back Right Box) --- */}
        <g id="box-back-right">
          <rect
            x="32"
            y="8"
            width="16"
            height="20"
            rx="1.5"
            fill="#fdba74"
            stroke="#ea580c"
            strokeWidth="1.2"
          />
          <rect x="39" y="8" width="2.5" height="20" fill="#c2410c" opacity="0.3" />
          <rect x="34" y="12" width="4" height="3" rx="0.5" fill="#ffffff" opacity="0.9" />
        </g>

        {/* --- BOX 3 (Front Center Box) --- */}
        <g id="box-front-center">
          <rect
            x="22"
            y="17"
            width="22"
            height="18"
            rx="2"
            fill="#fed7aa"
            stroke="#ea580c"
            strokeWidth="1.3"
          />
          <rect x="31.5" y="17" width="3" height="18" fill="#c2410c" opacity="0.25" />
          <line
            x1="22"
            y1="25"
            x2="44"
            y2="25"
            stroke="#ea580c"
            strokeWidth="1"
            strokeDasharray="1.5 1"
          />
          <rect x="25" y="27" width="5.5" height="4.5" rx="0.5" fill="#ffffff" />
          <line x1="26" y1="28.5" x2="29.5" y2="28.5" stroke="#334155" strokeWidth="0.6" />
          <line x1="26" y1="30" x2="29" y2="30" stroke="#334155" strokeWidth="0.6" />
        </g>

        {/* --- SHOPPING BASKET / CART (EmptyCart style) --- */}
        <g id="shopping-basket">
          <path
            d="M7 10h6l5.5 28h28.5l5.5 -22H17"
            stroke="#ff715b"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 24h29.5"
            stroke="#ff715b"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <path
            d="M20 31h27"
            stroke="#ff715b"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <line
            x1="27"
            y1="16"
            x2="24"
            y2="38"
            stroke="#ff715b"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
          <line
            x1="36"
            y1="16"
            x2="35"
            y2="38"
            stroke="#ff715b"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
          <line
            x1="45"
            y1="16"
            x2="45"
            y2="38"
            stroke="#ff715b"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />

          <path
            d="M18.5 38l2 6.5h24l2 -6.5"
            stroke="#ff715b"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx="23.5"
            cy="49.5"
            r="3.5"
            fill="#ffffff"
            stroke="#ff715b"
            strokeWidth="2.2"
          />
          <circle cx="23.5" cy="49.5" r="1.2" fill="#ff715b" />

          <circle
            cx="41.5"
            cy="49.5"
            r="3.5"
            fill="#ffffff"
            stroke="#ff715b"
            strokeWidth="2.2"
          />
          <circle cx="41.5" cy="49.5" r="1.2" fill="#ff715b" />
        </g>
      </svg>

      {typeof itemsCount === "number" && (
        <span className="absolute bottom-1 right-1 bg-[#1a1a1a] text-white text-[10px] font-MontserratSemiBold px-1.5 py-0.5 rounded-full shadow-sm leading-tight">
          x{itemsCount}
        </span>
      )}
    </div>
  );
}
