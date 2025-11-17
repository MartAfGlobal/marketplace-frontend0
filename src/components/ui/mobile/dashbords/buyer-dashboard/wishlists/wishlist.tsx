"use client";

import { useCallback, useEffect, useState } from "react";
import OrdersNav from "@/components/ui/buyer-components/orders/order-status-bar";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import Plus from "@/assets/Icons2/PlusWhite.svg";
import Image from "next/image";

import Cookies from "js-cookie";
import { motion } from "framer-motion";
import AllWishlist from "@/app/dashboard/buyer/wishlist/all-wishlist";
import { Button } from "@/components/ui/Button/Button";
import Mylist from "@/app/dashboard/buyer/wishlist/my-list";
import { useHttp } from "@/hooks/use-http";
import {
  setWishlistLabels,
  addWishlistLabel,
  deleteWishlistLabel,
} from "@/store/wishlistLabel/wishlistLabelSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Trash from "@/assets/icons/trash.svg";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const tabs = ["All", "My List"];

export default function WishList() {
  const [activeTab, setActiveTab] = useState("All");
  const { sendHttpRequest } = useHttp();
  const { loading, sendHttpRequest: handleDeleteReq } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);
  const labels = useSelector((state: RootState) => state.wishlistLabel.labels);


const handleDeleteLabel = () => {
  if (!token) return;

  handleDeleteReq({
    requestConfig: {
      url: "/wishlist/labels/delete/",
      method: "DELETE",
      token,
      body: {
        label_ids: selectedIds,
      },
      isAuth: true,
      userType: "buyer",
    },
    successRes: () => {
      toast.success("List deleted successfully");

      // REMOVE EACH ID FROM REDUX
      selectedIds.forEach((id) => {
        dispatch(deleteWishlistLabel(id));
      });

      setSelectedIds([]);
    },
  });
};


  useEffect(() => {
    if (!token) return;

    sendHttpRequest({
      requestConfig: {
        url: "/wishlist/labels/",
        method: "GET",
        token,
        isAuth: true,
        userType: "buyer",
      },
      successRes: (res) => {
        const labels = res?.data || [];
        dispatch(setWishlistLabels(labels));
        console.log(" Wishlist labels stored in Redux:", labels);
      },
    });
  }, [token, sendHttpRequest, dispatch]);

  return (
    <div className="w-full flex flex-col flex-1 min-h-screen bg-white">
      <div className="sticky top-20 z-40 bg-white shadow-sm  md:px-0">
        <div className="flex justify-between items-center mt-c32 pb-3 md:w-full">
          <OrdersNav
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="md:w-39.75 "
          />
          <SearchInput
            placeholder="Order ID, Store name, Product name"
            className="border border-000000/18 focus:ring-ff715b shadow-neutral-50 hidden md:hidden"
          />

          {activeTab === "My List" && (
            <>
              {selectedIds.length ? (
                <Button
                  onClick={handleDeleteLabel}
                  className="md:flex items-center justify-center max-w-[176.15px] gap-3 hidden"
                >
                  <span>
                    {loading ? <LoadingSpinner /> : "Delete selected lists"}
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="md:flex items-center justify-center max-w-[176.15px] gap-3 hidden"
                >
                  <Image src={Plus} alt="Add" width={13} height={13} />
                  <span>Create new list</span>
                </Button>
              )}
            </>
          )}

          {activeTab === "All" && hasSelected && (
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(true)}
              className="md:flex items-center justify-center max-w-[248px] gap-3 hidden"
            >
              Add to list
            </Button>
          )}
        </div>
      </div>

    
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
        <div className="md:pt-c32 md:pb-c60">
          {activeTab === "All" && (
            <AllWishlist
              onSelectionChange={setHasSelected}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onOpen={() => setIsModalOpen(true)}
            />
          )}
          {activeTab === "My List" && (
            <Mylist
              labels={labels}
              onSelectionChange={handleSelectionChange}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onOpen={() => setIsModalOpen(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
