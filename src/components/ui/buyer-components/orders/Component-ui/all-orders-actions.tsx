"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { OrderItem } from "@/types/global";
import { getOrderReviewState } from "@/utils/buyerOrderReview";

interface AllOrderActionsProps {
  item: OrderItem;
  totalPrice: number;
  repaying: boolean;
  selectedId: string | null;
  onConfirmDelivery: () => void;
  onTrackOrder: () => void;
  onAddToCart: () => void;
  onReview: () => void;
  onEditAddress: () => void;
  onCancel: () => void;
  onRepay: (expectedAmount: number) => void;
}

type Props = AllOrderActionsProps & {
  reviewState: ReturnType<typeof getOrderReviewState>;
};

export function AllOrderMobileActions({
  item,
  totalPrice,
  repaying,
  selectedId,
  reviewState,
  onConfirmDelivery,
  onTrackOrder,
  onAddToCart,
  onReview,
  onEditAddress,
  onCancel,
  onRepay,
}: Props) {
  return (
    <div className="w-full gap-4 text-c10 flex flex-row-reverse md:hidden mt-4 space-y-4">
      {(item.buyer_status?.toLowerCase() === "shipped" ||
        item.buyer_status?.toLowerCase() === "shipped_to_buyer" ||
        item.buyer_status?.toLowerCase() === "out_for_delivery") && (
        <>
          <Button onClick={onConfirmDelivery}>Confirm delivery</Button>
          <Button variant="secondary" onClick={onTrackOrder}>
            Track order
          </Button>
        </>
      )}
      {(item.buyer_status === "Completed" ||
        item.buyer_status === "delivered" ||
        item.buyer_status === "Cancelled") && (
        <>
          <div></div>
          <Button className="" onClick={onAddToCart}>
            Add to cart
          </Button>
        </>
      )}
      {item.buyer_status === "Delivered" && (
        <>
          <Button onClick={onAddToCart}>Add to cart</Button>
          {reviewState.hasReviewableItems && (
            <Button
              disabled={!reviewState.canReview}
              variant="secondary"
              onClick={onReview}
            >
              {reviewState.allReviewed ? "Reviewed" : "Leave a review"}
            </Button>
          )}
        </>
      )}
      {item.buyer_status === "RECEIVED_AT_HUB" && (
        <>
          <div className="w-full"></div>
          <Button variant="secondary" onClick={onTrackOrder}>
            Track order
          </Button>
        </>
      )}
      {item.buyer_status === "PENDING" && item.can_cancel && (
        <>
          <Button onClick={onEditAddress}>Edit address</Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel order
          </Button>
        </>
      )}
      {item.buyer_status === "Processing" && item.can_cancel && (
        <Button onClick={onCancel} variant="primary">
          Cancel order
        </Button>
      )}
      {item.buyer_status === "AWAITING_PAYMENT" && (
        <>
          <Button disabled={repaying} onClick={() => onRepay(totalPrice)}>
            {selectedId === item.id && repaying ? (
              <LoadingSpinner />
            ) : (
              "Confirm & pay"
            )}
          </Button>
          <Button variant="secondary" onClick={onEditAddress}>
            Edit address
          </Button>
        </>
      )}
    </div>
  );
}

export function AllOrderDesktopActions({
  item,
  repaying,
  onConfirmDelivery,
  onTrackOrder,
  onAddToCart,
  onReview,
  onEditAddress,
  onCancel,
  onRepay,
  reviewState,
}: Props) {
  const buyerStatus = item.buyer_status?.toLowerCase();

  return (
    <div className="hidden w-full gap-4 pl-4 md:flex md:flex-col md:max-w-70 space-y-4">
      {(buyerStatus === "shipped" ||
        buyerStatus === "shipped_to_buyer" ||
        buyerStatus === "out_for_delivery") && (
        <>
          <Button onClick={onConfirmDelivery}>Confirm delivery</Button>
          <Button variant="secondary" key={item.id} onClick={onTrackOrder}>
            Track order
          </Button>
        </>
      )}

      {item.buyer_status === "Delivered" && (
        <>
          <Button className="" onClick={onAddToCart}>
            Add to cart
          </Button>
          {reviewState.hasReviewableItems && (
            <Button
              disabled={!reviewState.canReview}
              onClick={onReview}
              variant="secondary"
              className=""
            >
              {reviewState.allReviewed ? "Reviewed" : "Leave a review"}
            </Button>
          )}
        </>
      )}

      {(item.buyer_status === "Completed" ||
        item.buyer_status === "delivered" ||
        item.buyer_status === "Cancelled") && (
        <>
          <div></div>
          <Button className="" onClick={onAddToCart}>
            Add to cart
          </Button>
        </>
      )}
      {item.buyer_status === "RECEIVED_AT_HUB" && (
        <Button variant="secondary" key={item.id} onClick={onTrackOrder}>
          Track order
        </Button>
      )}

      {item.buyer_status === "Processing" && item.can_cancel && (
        <>
          {/* <Button onClick={onEditAddress} variant="secondary" className="">
            Edit address
          </Button> */}
          <Button variant="secondary" onClick={onCancel}>
            Cancel order
          </Button>
        </>
      )}

      {item.buyer_status === "Processing" && item.can_cancel && (
        <Button onClick={onCancel} variant="primary">
          Cancel order
        </Button>
      )}

      {item.buyer_status === "AWAITING_PAYMENT" && (
        <>
          <Button variant="secondary" onClick={onEditAddress}>
            Edit address
          </Button>
          <Button disabled={repaying} onClick={() => onRepay(item.total_price)}>
            {repaying ? <LoadingSpinner /> : "Confirm & pay"}
          </Button>
        </>
      )}

      {/* Default fallback (optional)
      {![
        "Shipped",
        "To Ship",
        "Delivered",
        "Awaiting Payment",
      ].includes(item.buyer_status) && (
        <Button variant="secondary" className="">
          View details
        </Button>
      )} */}

      <div className="w-full hidden md:flex justify-center">
        <Link
          href={`/dashboard/buyer/orders/${item.id}?mode=${String(item.buyer_status ?? item.status ?? "").toLowerCase()}`}
          className="text-c14 font-MontserratSemiBold text-ff715b"
        >
          Order details
        </Link>
      </div>
    </div>
  );
}
