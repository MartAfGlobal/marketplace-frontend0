import { SellerDetails } from "@/types/global";

export default function Seller() {
  const sellerDetails: SellerDetails[] = [
    {
      id: 1,
      title: "COMPANY LOGO",
      discription: "Chijoke LTD",
    },
    {
      id: 2,
      title: "COMPANY LOGO",
      discription: "Chijoke LTD",
    },
    {
      id: 3,
      title: "COMPANY LOGO",
      discription: "Chijoke LTD",
    },
    {
      id: 4,
      title: "COMPANY LOGO",
      discription: "Chijoke LTD",
    },
    {
      id: 5,
      title: "COMPANY LOGO",
      discription: "Chijoke LTD",
    },
    {
      id: 6,
      title: "COMPANY LOGO",
      discription: "Chijoke LTD",
    },
    {
      id: 7,
      title: "COMPANY LOGO",
      discription: "Chijoke LTD",
    },
  ];

  return (
    <div className="w-full">
      <p className="font-MontserratSemiBold text-base leading-c24 text-000000 mb-c24">
        Sellers
      </p>
      <div className="flex  gap-[25.83px] w-full flex-wrap">
        {sellerDetails.map((items) => (
          <div key={items.id}>
            <div className="w-31 h-31 flex-1 rounded-c12 bg-f89f1c border border-a2a2a2 flex justify-center items-center">
              <p className="font-MontserratBold text-c12 text-wrap   leading-c100p text-000000">
                {items.title}
              </p>
            </div>
            <p className="font-MontserratMedium text-c12 leading-4 mt-1 text-161616">
              {items.discription}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
