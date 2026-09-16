"use client";

import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Override the panel's max-width for wider content (e.g. a permissions
   * matrix) — defaults to the width every existing right-side drawer in
   * the app already uses. */
  maxWidthClassName?: string;
}

// Right-side slide-in drawer — the app's established pattern for editing
// panels (see the refund drawers under admin-components/disputes), as
// opposed to a centered dialog (see comfirmation-modal.tsx) used for plain
// yes/no confirmations. Extracted here so both can share one definition
// instead of each screen re-implementing its own copy.
export default function DrawerWrapper({
  isOpen,
  onClose,
  children,
  maxWidthClassName = "max-w-[426px]",
}: DrawerWrapperProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const w = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (w > 0) document.body.style.paddingRight = `${w}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-end z-[9998] p-4 sm:pr-[29px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, x: 160 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 160 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white shadow-xl flex flex-col p-8 w-full ${maxWidthClassName} max-h-[92vh] rounded-[16px] relative overflow-hidden`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
