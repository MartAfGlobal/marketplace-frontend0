"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Open from "@/assets/icons/fags/arrow-down.png";
import Close from "@/assets/icons/fags/arrow-up.png";

interface Question {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  questions: Question[];
}

export default function FAQSection({ title, questions }: FAQSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-170">
      <h2 className="text-2xl font-bold mb-c48">{title}</h2>

      <div className="flex flex-col gap-c32">
        {questions.map((q) => {
          const isOpen = openId === q.id;
          return (
            <div
              key={q.id}
              className="bg-white rounded-c12 font-MontserratBold text-c20 circle-shadow"
            >
              {/* Question row */}
              <div className="flex flex-col rounded-t-c12">
                {/* Question row */}
                <div className="flex justify-between items-center p-4">
                  <span className="font-MontserratBold text-c20 text-161616 leading-c100p">
                    {q.question}
                  </span>

                  <button
                    onClick={() => toggle(q.id)}
                    className={`rounded-full h-9 w-9 flex items-center justify-center ${
                      isOpen ? "bg-d9d9d9" : "bg-6a0dad"
                    }`}
                  >
                    <Image
                      src={isOpen ? Close : Open}
                      alt={isOpen ? "Close" : "Open"}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>

                {/* Divider line only when open */}
                {isOpen && <span className="block w-full h-px bg-gray-300" />}
              </div>

              {/* Answer inside same container */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-gray-700">{q.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
