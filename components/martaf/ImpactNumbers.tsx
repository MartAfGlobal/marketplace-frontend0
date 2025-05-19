import { Hand, Box, Star, Globe2 } from "lucide-react";

const impactNumbers = [
  {
    icon: <Hand className="text-purple-600 w-10 h-10 mb-2" />,
    value: "1.5M",
    label: "Satisfied Customers",
  },
  {
    icon: <Box className="text-purple-600 w-10 h-10 mb-2" />,
    value: "500K",
    label: "Products Listed",
  },
  {
    icon: <Star className="text-purple-600 w-10 h-10 mb-2" />,
    value: "4.7/5",
    label: "Average Rating",
  },
  {
    icon: <Globe2 className="text-purple-600 w-10 h-10 mb-2" />,
    value: "100+",
    label: "Countries Served",
  },
];

const ImpactNumbers = () => {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Our impact in Numbers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {impactNumbers.map((n, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-purple-600 mb-2">
              {n.icon}
            </div>
            <div className="text-2xl font-bold text-black">{n.value}</div>
            <div className="text-gray-500 text-sm">{n.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactNumbers; 