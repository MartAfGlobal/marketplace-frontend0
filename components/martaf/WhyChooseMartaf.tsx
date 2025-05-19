import React from "react";

const WhyChooseMartaf = () => {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Why Choose Martaf?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Feature placeholders */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 h-20 rounded flex items-center justify-center">Feature {i + 1}</div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseMartaf; 