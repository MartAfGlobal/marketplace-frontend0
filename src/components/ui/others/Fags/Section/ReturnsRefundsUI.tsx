   "use client";
import FaqSection from "../FagsQuestion";

export default function ReturnsRefundsUI() {
  const questions = [
    {
      id: 1,
      question: "Can I return a product?",
      answer:
        "Yes! You can return items within the seller’s return policy period (typically 7 days). Items must be unused and in their original packaging.",
    },
    {
      id: 2,
      question: "How do I request a refund?",
      answer:
        "Go to My Orders Select the item and click Request Refund Follow the instructions and submit the request The seller will review your request and process the refund if approved.",
    },
    {
      id: 3,
      question: "How long does it take to receive my refund?",
      answer:
        "Refunds are typically processed within 5-10 business days after approval.",
    },
  ];

  return (
    <div>
      <FaqSection title="Returns & Refunds" questions={questions} />
    </div>
  );
}
