 "use client";
import FaqSection from "../FagsQuestion";

export default function PaymentsBillingUI () {
  const questions = [
    {
      id: 1,
      question: "What payment methods does Martaf accept?",
      answer:
        "We accept: Debit/Credit Cards (Visa, Mastercard) Bank Transfers Opay",
    },
    {
      id: 2,
      question: "Is my payment secure?",
      answer:
        "Yes! We use encrypted payment gateways to ensure all transactions are safe and secure.",
    },
    {
      id: 3,
      question: "Why was my payment declined?",
      answer:
        "If your payment fails, it may be due to: Insufficient funds Incorrect card details Payment restrictions from your bank. If issues persist, contact your bank or try a different payment method.",
    },
  ];

  return (
    <div>
      <FaqSection title="Payment & Billing" questions={questions} />
    </div>
  );
}
