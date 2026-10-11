import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Trash from "@/assets/icons/trashWhite.svg";

/**
 * Product action controls shared by the product detail page.
 * The component decides which CTA buttons or status text should appear
 * depending on whether the product is a draft or published item and on its
 * approval/activation state.
 */
interface ProductActionsProps {
  /** True when the product has already been published to the marketplace. */
  published: string | undefined;
  /** Full product object from the parent page; this contains the state flags used for the action logic. */
  productDetails: any;
  /** Product id used for routing to the edit form and for validation checks. */
  id: string;
  /** Whether an activation/deactivation request is currently loading. */
  ActivatingLoading: boolean;
  /** Whether the draft is submitting for review. */
  submiting: boolean;
  /** Whether the draft delete request is running. */
  deleteLoading: boolean;
  /** Stops users from submitting a draft if some required product information is still missing. */
  isDraftComplete?: boolean;
  /** Opens the confirmation modal for activation/deactivation/cancel actions. */
  setConfirmAction: (val: "activate" | "deactivate" | "cancel activation" | "cancel deactivation" | null) => void;
  /** Called when the user cancels an activation/deactivation request flow. */
  handleCancelRequest: () => void;
  /** Submits a draft product to the review pipeline. */
  handleSubmitDraftProduct: () => void;
  /** Deletes the current draft product. */
  handleDeleteDraft: () => void;
}

export default function ProductActions({
  published,
  productDetails,
  id,
  ActivatingLoading,
  submiting,
  deleteLoading,
  isDraftComplete = true,
  setConfirmAction,
  handleCancelRequest,
  handleSubmitDraftProduct,
  handleDeleteDraft,
}: ProductActionsProps) {
  // `useRouter` lets us navigate to the edit-product form without passing props through multiple layers.
  const router = useRouter();

  return (
    <>
      {/*
        MOBILE VIEW
        This area prioritizes compact stacked buttons for smaller screens.
        The checks below render different actions depending on product lifecycle state.
      */}
      <div className="w-full flex gap-2 items-center lg:hidden">
        {/* Drafts can always be deleted before they are published. */}
        {!published && (
          <button
            onClick={handleDeleteDraft}
            className="bg-ca0202 rounded-c8 flex items-center justify-center w-c48 h-c48 flex-shrink-0 lg:ml-auto"
          >
            {deleteLoading ? (
              <LoadingSpinner />
            ) : (
              <Image src={Trash} alt="Delete" width={18.12} height={19.63} />
            )}
          </button>
        )}

        {/*
          Published products have different CTA states depending on whether they are
          active, approved, or waiting for activation/deactivation approval.
        */}
        {published &&
        productDetails.is_active &&
        productDetails.is_approved === "approved" &&
        productDetails.deactivation_requested === false ? (
          <Button
            onClick={() => setConfirmAction("deactivate")}
            variant="secondary"
            className="w-full border-ca0202 text-ca0202 hover:bg-red-50 text-[14px] leading-tight px-1 py-1 min-h-[44px] h-auto whitespace-normal text-center"
          >
            Deactivate product
          </Button>
        ) : published &&
          productDetails.is_active === false &&
          productDetails.activation_requested === false &&
          productDetails.is_approved === "approved" ? (
          <Button
            disabled={ActivatingLoading}
            onClick={() => setConfirmAction("activate")}
            className="w-full text-[14px] leading-tight px-1 py-1 min-h-[44px] h-auto whitespace-normal text-center"
            variant="primary"
          >
            {ActivatingLoading ? <LoadingSpinner /> : "Activate product"}
          </Button>
        ) : published && productDetails.activation_requested ? (
          <Button
            disabled={ActivatingLoading}
            onClick={() => setConfirmAction("cancel activation")}
            className="w-full text-[14px] leading-tight px-1 py-1 min-h-[44px] h-auto whitespace-normal text-center"
            variant="primary"
          >
            {ActivatingLoading ? <LoadingSpinner /> : "Cancel activation"}
          </Button>
        ) : published && productDetails.deactivation_requested ? (
          <Button
            disabled={ActivatingLoading}
            onClick={() => setConfirmAction("cancel deactivation")}
            className="w-full text-[14px] leading-tight px-1 py-1 min-h-[44px] h-auto whitespace-normal text-center"
            variant="primary"
          >
            {ActivatingLoading ? <LoadingSpinner /> : "Cancel deactivation"}
          </Button>
        )
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "pending" ? (
          <p className="text-ff715b font-MontserratSemiBold text-sm w-full text-center">
            Pending approval
          </p>
        )
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "pending_update" ? (
          <p className="text-ff715b font-MontserratSemiBold text-sm w-full text-center">
            Pending update
          </p>)
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "rejected" ? (
          <p className="text-ca0202 font-MontserratSemiBold text-sm w-full text-center">
            Rejected
          </p>)
          : (
          !published && (
            <Button
              disabled={submiting || !id || !isDraftComplete}
              onClick={handleSubmitDraftProduct}
              title={!isDraftComplete ? "Please complete all product details before submitting for review" : undefined}
              className="w-full text-[14px] leading-tight px-1 py-1 min-h-[44px] h-auto whitespace-normal text-center disabled:opacity-50 disabled:cursor-not-allowed"
              variant="primary"
            >
              {submiting ? <LoadingSpinner /> : "Submit for review"}
            </Button>
          )
        )}

        {/*
          Users can edit a draft or a published item when edit permissions are available.
          The route changes depending on whether the item is still a draft or has already been published.
        */}
        {(
          (!published) ||
          (published &&
           productDetails.can_edit)
        ) && (
          <Button variant="primary"
            onClick={() => router.push(`/dashboard/seller/products/add-product/updateProduct/${id}${!published ? '?isPublish=false' : ''}`)}
            className="w-full "
          >
            Edit product
          </Button>
        )}
      </div>

      {/*
        DESKTOP VIEW
        Same state logic as the mobile layout, but optimized for larger screens with a
        wider action area and layout alignment.
      */}
      <div className="hidden md:flex w-full  justify-end gap-3 items-center">
        {/* Desktop delete button mirrors the mobile version for drafts. */}
        {!published && (
          <button
            onClick={handleDeleteDraft}
            className="bg-ca0202 rounded-c8 flex items-center justify-center w-c48 h-c48 flex-shrink-0"
          >
            {deleteLoading ? (
              <LoadingSpinner />
            ) : (
              <Image src={Trash} alt="Delete" width={18.12} height={19.63} />
            )}
          </button>
        )}

        {/* Desktop version of the same published-state lifecycle actions. */}
        {published &&
        productDetails.is_active &&
        productDetails.is_approved === "approved" &&
        productDetails.deactivation_requested === false ? (
          <Button
            onClick={() => setConfirmAction("deactivate")}
            className="max-w-[200px] bg-ca0202 text-white text-sm"
          >
            Deactivate product
          </Button>
        ) : published &&
          productDetails.is_active === false &&
          productDetails.activation_requested === false &&
          productDetails.is_approved === "approved" ? (
          <Button
            disabled={ActivatingLoading}
            onClick={() => setConfirmAction("activate")}
            className="max-w-[200px] text-sm"
            variant="primary"
          >
            {ActivatingLoading ? <LoadingSpinner /> : "Activate product"}
          </Button>
        ) : published && productDetails.activation_requested ? (
          <Button
            disabled={ActivatingLoading}
            onClick={() => setConfirmAction("cancel activation")}
            className="max-w-[200px] text-sm"
            variant="primary"
          >
            {ActivatingLoading ? <LoadingSpinner /> : "Cancel activation"}
          </Button>
        ) : published && productDetails.deactivation_requested ? (
          <Button
            disabled={ActivatingLoading}
            onClick={() => setConfirmAction("cancel deactivation")}
            className="max-w-[200px] text-sm"
            variant="primary"
          >
            {ActivatingLoading ? <LoadingSpinner /> : "Cancel deactivation"}
          </Button>
        ) : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "pending" ? (
          <p className="w-full text-ff715b font-MontserratSemiBold text-sm text-left">
            Pending approval
          </p>
        )
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "pending_update" ? (
          <p className="w-full text-ff715b font-MontserratSemiBold text-sm text-left">
            Pending update
          </p>)
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "rejected" ? (
          <p className="text-ca0202 font-MontserratSemiBold text-sm text-left w-full">
            Rejected
          </p>): (
          !published && (
            <Button
              disabled={submiting || !id || !isDraftComplete}
              onClick={handleSubmitDraftProduct}
              title={!isDraftComplete ? "Please complete all product details before submitting for review" : undefined}
              className="max-w-[200px] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              variant="primary"
            >
              {submiting ? <LoadingSpinner /> : "Submit for review"}
            </Button>
          )
        )}

        {/* Desktop edit action uses the same route logic as the mobile version. */}
        {(
          (!published) ||
          (published &&
           productDetails.can_edit)
        ) && (
          <Button variant="primary"
            onClick={() => router.push(`/dashboard/seller/products/add-product/updateProduct/${id}${!published ? '?isPublish=false' : ''}`)}
            className="w-full "
          >
            Edit product
          </Button>
        )}
      </div>
    </>
  );
}
