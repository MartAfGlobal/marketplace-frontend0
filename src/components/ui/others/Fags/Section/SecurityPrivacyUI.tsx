  "use client";
import FaqSection from "../FagsQuestion";

export default function SecurityPrivacyUI() {
  const questions = [
    {
      id: 1,
      question: "How does Martaf protect my data?",
      answer:
        "We use secure encryption and comply with data protection laws to ensure your information is safe.",
    },
    {
      id: 2,
      question: "What should I do if I suspect fraud?",
      answer:
        "Never share your password or payment details with anyone. Report suspicious activity immediately to support@martaf.com.",
    },
    
  ];

  return (
    <div>
      <FaqSection title="Security & Privacy" questions={questions} />
    </div>
  );
}
