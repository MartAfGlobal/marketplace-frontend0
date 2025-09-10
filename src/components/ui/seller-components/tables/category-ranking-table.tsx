import Image from "next/image";

import HandBug from "@/assets/Seller/handBug.png";
import { useSelector } from "react-redux";
import Empty from "@/assets/Seller/Empty.svg"


export default function CategoryRankingTable() {
   const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  return (
    <div className="mt-c32 w-full">
        
      <table className="w-full">
        <thead className="text-ffffff font-MontserratSemiBold text-base bg-947fff w-full h-12">
          <tr>
            <th className="px-4 text-center w-21">s/n</th>
            <th className="px-4 w-66 text-left">Category</th>
          
            <th className="px-4 w-33.5">Q. in stock</th>
            
            <th></th>
          </tr>
        </thead>
       {
        isIncomplete? (
           <tbody>
        <tr className="h-64.5 ">
              <td
                colSpan={6}
                className="text-center py-6 text-gray-500 text-sm"
              >
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image src={Empty} height={18} width={18} alt="empty" />
                  <p className="text-base font-MontserratNormal text-000000/10">No data available</p>
                </div>
              </td>
            </tr>
        </tbody>
        ):(
           <tbody>
          <tr className="h-c48 border-b text-sm font-MontserratNormal border-b-000000/10">
            <td className="px-4 ">0021</td>
            <td className="px-6">Fashion & Shoes</td>
            
            <td className="px-4 text-center">30</td>
          
            <td>
              <button className="w-6 h-6 flex-shrink-0">
                <Image
                  src={HandBug}
                  alt="side button"
                  width={24}
                  height={24}
                  className=" flex-shrink-0"
                />
              </button>
            </td>
          </tr>
          <tr className="h-c48 border-b border-b-000000/10">
            <td className="px-4 ">0021</td>
            <td className="px-6">Fashion & Shoes</td>
            
            <td className="px-4 text-center">30</td>
          
            <td>
              <button className="w-6 h-6 flex-shrink-0">
                <Image
                  src={HandBug}
                  alt="side button"
                  width={24}
                  height={24}
                  className=" flex-shrink-0"
                />
              </button>
            </td>
          </tr>
          <tr className="h-c48 border-b border-b-000000/10">
            <td className="px-4 ">0021</td>
            <td className="px-4">Fashion & Shoes</td>
            
            <td className="px-4 text-center">30</td>
          
            <td>
              <button className="w-6 h-6 flex-shrink-0">
                <Image
                  src={HandBug}
                  alt="side button"
                  width={24}
                  height={24}
                  className=" flex-shrink-0"
                />
              </button>
            </td>
          </tr>
          <tr className="h-c48 border-b border-b-000000/10">
            <td className="px-4 ">0021</td>
            <td className="px-4">Fashion & Shoes</td>
            
            <td className="px-4 text-center">30</td>
          
            <td>
              <button className="w-6 h-6 flex-shrink-0">
                <Image
                  src={HandBug}
                  alt="side button"
                  width={24}
                  height={24}
                  className=" flex-shrink-0"
                />
              </button>
            </td>
          </tr>
          <tr className="h-c48 border-b border-b-000000/10">
            <td className="px-4 ">0021</td>
            <td className="px-4">Fashion & Shoes</td>
            
            <td className="px-4 text-center">30</td>
          
            <td>
              <button className="w-6 h-6 flex-shrink-0">
                <Image
                  src={HandBug}
                  alt="side button"
                  width={24}
                  height={24}
                  className=" flex-shrink-0"
                />
              </button>
            </td>
          </tr>
          <tr className="h-c48 border-b border-b-000000/10">
            <td className="px-4 ">0021</td>
            <td className="px-4">Fashion & Shoes</td>
            
            <td className="px-4 text-center">30</td>
          
            <td>
              <button className="w-6 h-6 flex-shrink-0">
                <Image
                  src={HandBug}
                  alt="side button"
                  width={24}
                  height={24}
                  className=" flex-shrink-0"
                />
              </button>
            </td>
          </tr>
          <tr className="h-c48 border-b border-b-000000/10">
            <td className="px-4 ">0021</td>
            <td className="px-4">Fashion & Shoes</td>
            
            <td className="px-4 text-center">30</td>
          
            <td>
              <button className="w-6 h-6 flex-shrink-0">
                <Image
                  src={HandBug}
                  alt="side button"
                  width={24}
                  height={24}
                  className=" flex-shrink-0"
                />
              </button>
            </td>
          </tr>
        </tbody>
        )
       }
      </table>
    </div>
  );
}
