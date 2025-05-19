import { Globe, ShieldCheck, Truck, Users, Smartphone, Lock } from "lucide-react";

const features = [
  {
    icon: <Globe className="text-yellow-400 w-8 h-8 mb-2" />, // Pan-African Reach
    title: "Pan-African Reach",
    desc: "Connecting buyers and sellers across Africa.",
  },
  {
    icon: <ShieldCheck className="text-yellow-400 w-8 h-8 mb-2" />, // Secure Transactions
    title: "Secure Transactions",
    desc: "Ensuring safe and secure transactions to all users.",
  },
  {
    icon: <Truck className="text-yellow-400 w-8 h-8 mb-2" />, // Fast Delivery
    title: "Fast Delivery",
    desc: "Quick and reliable delivery services.",
  },
  {
    icon: <Users className="text-yellow-400 w-8 h-8 mb-2" />, // Trusted by Millions
    title: "Trusted by Millions",
    desc: "A platform trusted by millions of users.",
  },
  {
    icon: <Smartphone className="text-yellow-400 w-8 h-8 mb-2" />, // Mobile Friendly
    title: "Mobile Friendly",
    desc: "Our platform is optimized for mobile devices.",
  },
  {
    icon: <Lock className="text-yellow-400 w-8 h-8 mb-2" />, // Secure
    title: "Secure",
    desc: "We prioritize security to protect your data.",
  },
];

const WhyChooseMartaf = () => {
  return (
    <section className="p-8">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">Why Choose Martaf?</h2>
      <p className="text-gray-500 text-center mb-8">Connecting you to the heart of African Commerce</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center bg-gray-50 rounded-lg p-6 shadow-sm h-full">
            {f.icon}
            <div className="font-semibold text-lg mb-1">{f.title}</div>
            <div className="text-gray-500 text-sm">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseMartaf; 