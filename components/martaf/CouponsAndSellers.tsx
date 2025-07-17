import React from 'react';

export default function CouponsAndSellers() {
  const coupons = [
    { code: "RF385424", discount: "50% OFF" },
    { code: "RF756483", discount: "20% OFF" },
    { code: "RF756483", discount: "65% OFF" }
  ];

  const sellers = Array(7).fill({
    name: "Chijoke LTD",
    logo: "COMPANY LOGO"
  });

  return (
    <div className="bg-white py-4 max-w-6xl mx-auto">
      {/* Coupons Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Coupons</h2>
          <button className="text-red-500 hover:text-red-600 text-sm font-medium">
            View all
          </button>
        </div>
        
        <div className="flex justify-between gap-4 ">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className="bg-gray-100 px-6 py-6 text-center shadow-sm hover:shadow-md transition-shadow rounded-md relative w-[30%]"
              style={{
                mask: 'radial-gradient(circle at 0% 50%, transparent 12px, black 13px), radial-gradient(circle at 100% 50%, transparent 12px, black 13px)',
                maskComposite: 'intersect'
              }}
            >
              <div className="text-gray-700 font-semibold text-xl mb-1">
                {coupon.code}
              </div>
              <div className="text-gray-600 text-sm">
                {coupon.discount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sellers Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sellers</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {sellers.map((seller, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              <div className="bg-[#F89F1C] rounded-lg w-30 h-30 flex flex-col items-center justify-center mb-2 hover:bg-orange-500 transition-colors cursor-pointer">
                <div className="text-black text-xs font-semibold text-center leading-tight">
                  {seller.logo}
                </div>
              </div>
              <div className="text-gray-700 text-sm text-center">
                {seller.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}