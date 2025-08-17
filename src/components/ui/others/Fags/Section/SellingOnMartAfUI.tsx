"use client";
import FaqSection from "../FagsQuestion";

export default function SellingOnMartAfUI() {
  const questions = [
    {
      id: 1,
      question: "How do I become a seller on MartAf?",
      answer:
        "Register as a seller on martaf.com Complete your profile and verify your business details List your products with images, descriptions, and pricing Start selling!",
    },
    {
      id: 2,
      question: "Are there any fees for selling on Martaf?",
      answer:
        "MartAf charges a small commission on successful sales. Additional fees may apply for premium services or advertising.",
    },
    {
      id: 3,
      question: "How do I receive payments for my sales?",
      answer:
        "Payments are transferred to your preferred bank account or digital wallet after order completion and confirmation.",
    },
  ];

  return (
    <div>
      <FaqSection title="Selling on MartAf" questions={questions} />
    </div>
  );
}
