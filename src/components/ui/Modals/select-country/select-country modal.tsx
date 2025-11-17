"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SelectModalProps<T> {
  isOpen: boolean;
  title: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  onClose: () => void;
  onSelect: (option: T) => void;
}

export function SelectModal<T>({
  isOpen,
  title,
  options,
  getOptionLabel,
  onClose,
  onSelect,
}: SelectModalProps<T>) {
  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-40 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="bg-white w-11/12 max-w-md rounded-lg max-h-[80vh] overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="flex flex-col gap-2">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  className="p-2 text-left rounded hover:bg-gray-100"
                  onClick={() => {
                    onSelect(opt);
                    onClose();
                  }}
                >
                  {getOptionLabel(opt)}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
