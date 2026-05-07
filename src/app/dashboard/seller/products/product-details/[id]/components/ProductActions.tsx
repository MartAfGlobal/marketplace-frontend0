import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Trash from "@/assets/icons/trashWhite.svg";

interface ProductActionsProps {
  published: string | undefined;
  productDetails: any;
  id: string;
  ActivatingLoading: boolean;
  submiting: boolean;
  deleteLoading: boolean;
  setConfirmAction: (val: "activate" | "deactivate" | "cancel activation" | "cancel deactivation" | null) => void;
  handleCancelRequest: () => void;
  handleSubmitDraftProduct: () => void;
  handleDeleteDraft: () => void;
}

export default function ProductActions({
  published,
  productDetails,
  id,
  ActivatingLoading,
  submiting,
  deleteLoading,
  setConfirmAction,
  handleCancelRequest,
  handleSubmitDraftProduct,
  handleDeleteDraft,
}: ProductActionsProps) {
  const router = useRouter();

  return (
    <>
      {/* --- MOBILE VIEW (Unchanged) --- */}
      <div className="w-full grid grid-cols-2 gap-2 items-center lg:hidden">
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
        ) : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "pending" ? (
          <p className="text-ff715b font-MontserratSemiBold text-sm col-span-2 text-center">
            Pending approval
          </p>
        )
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "pending_update" ? (
          <p className="text-ff715b font-MontserratSemiBold text-sm col-span-2 text-center">
            Pending update
          </p>)
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "rejected" ? (
          <p className="text-ca0202 font-MontserratSemiBold text-sm col-span-2 text-center">
            Rejected
          </p>): (
          !published && (
            <Button
              disabled={submiting || !id}
              onClick={handleSubmitDraftProduct}
              className="w-full text-[14px] leading-tight px-1 py-1 min-h-[44px] h-auto whitespace-normal text-center"
              variant="primary"
            >
              {submiting ? <LoadingSpinner /> : "Submit for review"}
            </Button>
          )
        )}

        {(
          (!published) ||
          (published &&
           productDetails.activation_requested === false &&
           productDetails.deactivation_requested === false &&
           productDetails.is_approved !== "pending")
        ) && (
          <Button variant="primary"
            onClick={() => router.push(`/dashboard/seller/products/add-product/updateProduct/${id}${!published ? '?isPublish=false' : ''}`)}
            className="w-full bg-ff715b text-white text-[14px] leading-tight px-1 py-1 min-h-[44px] h-auto whitespace-normal text-center"
          >
            Edit product
          </Button>
        )}
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden lg:flex w-full justify-end gap-6 items-center">
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

        {(
          (!published) ||
          (published &&
           productDetails.activation_requested === false &&
           productDetails.deactivation_requested === false &&
           productDetails.is_approved !== "pending")
        ) && (
          <Button variant="primary"
            onClick={() => router.push(`/dashboard/seller/products/add-product/updateProduct/${id}${!published ? '?isPublish=false' : ''}`)}
            className="max-w-[200px] bg-ff715b text-white text-sm"
          >
            Edit product
          </Button>
        )}

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
          <p className="text-ff715b font-MontserratSemiBold text-sm text-right">
            Pending approval
          </p>
        )
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "pending_update" ? (
          <p className="text-ff715b font-MontserratSemiBold text-sm text-right">
            Pending update
          </p>)
        : published &&
          !productDetails.activation_requested &&
          !productDetails.deactivation_requested &&
          productDetails.is_approved === "rejected" ? (
          <p className="text-ca0202 font-MontserratSemiBold text-sm text-right">
            Rejected
          </p>): (
          !published && (
            <Button
              disabled={submiting || !id}
              onClick={handleSubmitDraftProduct}
              className="max-w-[200px] text-sm"
              variant="primary"
            >
              {submiting ? <LoadingSpinner /> : "Submit for review"}
            </Button>
          )
        )}
      </div>
    </>
  );
}
