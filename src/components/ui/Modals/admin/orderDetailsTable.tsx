import {
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
} from "lucide-react";


export default function OrderDetailsTable() {
  return (
    <div className="space-y-6  bg-white rounded-2xl p-6 pb-8   animate-in fade-in duration-300" >
      <h3 className="text-sm text-000000/68 font-MontserratNormalds">
        Order items
      </h3>

      {/* Accepted Items */}
      <div className="space-y-4">
        <p className="text-xs text-[#00BE5C] font-MontserratMedium">
          Accepted items
        </p>
        <div className="overflow-x-auto admincustom-scroll">
          <table className="w-full text-left min-w-[650px]">
            <thead>
              <tr className="bg-[#947FFF] text-white text-[12px] font-MontserratSemiBold h-10">
                <th className="p-3">SKU</th>
                <th className="p-3">Items</th>
                <th className="p-3">Unit price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className=" text-sm font-MontserratNormal ">
              {/* Item 1 */}
              <tr className="h-16">
                <td className="px-3 font-MontserratMedium text-xs ">
                  NKB-XL
                </td>
                <td className="px-3">
                  <div className="flex items-center gap-4 text-sm font-MontserratNormal">
                    <div className="w-12 h-12   flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&q=80"
                        alt="Cap red/black"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>Cap red/black</span>
                  </div>
                </td>
                <td className="px-3">N700</td>
                <td className="px-3 text-center">2</td>
                <td className="px-3 font-MontserratSemiBold ">
                  N1400
                </td>
                <td className="px-3 text-center">
                  <button className=" hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {/* Item 2 */}
              <tr className="h-16">
                <td className="px-3 font-MontserratMedium text-xs">
                  NKB-XL
                </td>
                <td className="px-3">
                  <div className="flex items-center gap-4 text-sm font-MontserratNormal">
                    <div className="w-12 h-12   flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&q=80"
                        alt="Earring diamond studded"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>Earring diamond studded</span>
                  </div>
                </td>
                <td className="px-3">N3500</td>
                <td className="px-3 text-center">2</td>
                <td className="px-3 font-MontserratSemiBold ">
                  N7000
                </td>
                <td className="px-3 text-center">
                  <button className=" hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {/* Item 3 */}
              <tr className="h-16">
                <td className="px-3 font-MontserratMedium text-xs">
                  NKB-XL
                </td>
                <td className="px-3">
                  <div className="flex items-center gap-4 text-sm font-MontserratNormal">
                    <div className="w-12 h-12   flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&q=80"
                        alt="Earring diamond studded"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>Earring diamond studded</span>
                  </div>
                </td>
                <td className="px-3">N3500</td>
                <td className="px-3 text-center">2</td>
                <td className="px-3 font-MontserratSemiBold ">
                  N7000
                </td>
                <td className="px-3 text-center">
                  <button className=" hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancelled Items */}
      <div className="space-y-4">
        <p className="text-xs text-ca0202 font-MontserratNormal">
          Cancelled items
        </p>
        <div className="overflow-x-auto admincustom-scroll">
          <table className="w-full text-left min-w-[650px]">
             <thead>
              <tr className="bg-[#947FFF] text-white text-[12px] font-MontserratSemiBold h-10">
                <th className="p-3">SKU</th>
                <th className="p-3">Items</th>
                <th className="p-3">Unit price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead> 
            <tbody className="text-sm font-MontserratNormal ">
              <tr className="h-16 bg-ca0202/12">
                <td className="px-3 font-MontserratMedium text-xs">
                  NKB-XL
                </td>
                <td className="px-3">
                  <div className="flex items-center gap-4 text-sm font-MontserratNormal">
                    <div className="w-12 h-12  lex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80"
                        alt="Nike shoes Xl fine blue"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>Nike shoes Xl fine blue</span>
                  </div>
                </td>
                <td className="px-3">N1500</td>
                <td className="px-3 text-center">2</td>
                <td className="px-3 font-MontserratSemiBold ">
                  N3000
                </td>
                <td className="px-3 text-center">
                  <button className=" hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
