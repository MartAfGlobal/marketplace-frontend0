"use client";
import FaqSection from "../FagsQuestion";

export default function GeneralInformationUI() {
  const questions = [
    {
      id: 1,
      question: "What is MartAf?",
      answer:
        "MartAf is an African-focused e-commerce marketplace that connects manufacturers, producers, and artisans directly with consumers, offering high-quality African-made products locally and globally.",
    },
    {
      id: 2,
      question: "How does Martaf work?",
      answer:
        "For Buyers: Browse and purchase products directly from verified sellers. For Sellers: List and sell your products to a wide audience. For Businesses: Partner with us to expand your reach and grow your business.",
    },
    {
      id: 3,
      question: "How do I create an account?",
      answer:
        "Click on “Sign Up” at the top of the homepage. Enter your details (name, email, password). Verify your email address. Start shopping or selling!",
    },
    {
      id: 4,
      question: "Is Martaf available internationally?",
      answer:
        "Yes! Martaf caters to customers across Africa and globally. Shipping availability depends on the seller’s delivery options.",
    },
  ];

  return (
    <div>
      <FaqSection title="General Information" questions={questions} />
    </div>
  );
}
