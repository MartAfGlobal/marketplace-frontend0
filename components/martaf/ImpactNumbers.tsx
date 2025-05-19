import React from "react";

const ImpactNumbers = () => {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Our impact in Numbers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat placeholders */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-100 h-24 rounded flex items-center justify-center">Stat {i + 1}</div>
        ))}
      </div>
    </section>
  );
};

export default ImpactNumbers; 