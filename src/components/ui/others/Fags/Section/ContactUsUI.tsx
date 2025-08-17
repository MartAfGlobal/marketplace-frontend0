"use client";
import FaqSection from "../FagsQuestion";

export default function ContactUsUI() {
  const questions = [
    {
      id: 1,
      question: "Still need help? Our team is happy to assist!",
      answer:
        "MartAf is an African-focused e-commerce marketplace that connects manufacturers, producers, and artisans directly with consumers, offering high-quality African-made products locally and globally.",
    },

  ];

  return (
    <div>
      <FaqSection title="Contact Us" questions={questions} />
    </div>
  );
}
