 "use client";
import FaqSection from "../FagsQuestion";

export default function ShoppingOrdersUI () {
  const questions = [
    {
      id: 1,
      question: "How do I place an order?",
      answer:
        "Search for the product you want. Click “Add to Cart” and proceed to checkout. Enter your shipping details and select a payment method. Confirm your order and receive an order confirmation email.",
    },
    {
      id: 2,
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel an order before it has been shipped. To cancel: Go to My Orders Select the order and click Cancel Order If the order has already shipped, you may need to request a return instead after it has been delivered.",
    },
    {
      id: 3,
      question: "How do I track my order?",
      answer:
        "Once your order is shipped, you’ll receive a tracking number via email. You can track your order  by: Logging into your MartAf account Going to My Orders Clicking Track Order",
    },
  ];

  return (
    <div>
      <FaqSection title="Shopping & Orders" questions={questions} />
    </div>
  );
}
