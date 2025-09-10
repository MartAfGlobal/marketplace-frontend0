import Image from "next/image";
import ArrowIcon from "@/assets/Seller/ArrowRight.svg";

export default function RecentPaymentTable() {
  const allRows = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    date: "15/08/2017",
    transactionid: "TRZ2038543453",
    amount: "N25,000",
    payoutmethod: i % 2 === 0 ? "Bank transfer" : "Credit card",
  }));

  return (
    <div className="w-full h-100.75 flex gap-18.75 mt-8">
      <div className="w-full max-w-104 h-full">
        <div className="flex justify-between">
          <p className="text-c18 font-MontserratNormal">Recent payouts</p>
          <div>
            <Image src={ArrowIcon} alt="payout" width={20} height={20} />
          </div>
        </div>
        <table className="w-full ">
          <thead className="w-full h-10 border-b border-b-947fff/90">
            <tr className="text-c12 font-MontserratSemiBold text-left text-947fff">
              <th className="px-3">Date</th>
              <th className="px-3">Transaction ID</th>
              <th className="px-3">Amount</th>
              <th className="px-3">Payout method</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row) => (
              <tr
                key={row.id}
                className="text-000000/60 font-MontserratSemiBold text-c12 h-12 text-center"
              >
                <td className="px-3">{row.date}</td>
                <td className="px-3">{row.transactionid}</td>
                <td className="px-3">{row.amount}</td>
                <td className="font-MontserratNormal px-3">{row.payoutmethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-1 h-full bg-000000/5"></div>

      <div className="w-full max-w-104">
        <div className="flex justify-between">
          <p className="text-c18 font-MontserratNormal">Recent transactions</p>
          <div>
            <Image src={ArrowIcon} alt="payout" width={20} height={20} />
          </div>
        </div>
        <table className="w-full">
          <thead className="w-full h-10 border-b border-b-947fff/90">
            <tr className="text-c12 font-MontserratSemiBold text-947fff text-left">
              <th className="px-3">Date</th>
              <th className="px-3">Transaction ID</th>
              <th className="px-3">Amount</th>
              <th className="px-3">Payout method</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row) => (
              <tr
                key={row.id}
                className="text-000000/60 font-MontserratSemiBold text-c12 h-12 text-center "
              >
                <td className="px-3">{row.date}</td>
                <td className="px-3">{row.transactionid}</td>
                <td className="px-3">{row.amount}</td>
                <td className="font-MontserratNormal px-3">{row.payoutmethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
