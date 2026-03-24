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
    <div className="w-full flex gap-6 justify-end">
      {(
        (!published) ||
        (published &&
         productDetails.activation_requested === false &&
         productDetails.deactivation_requested === false &&
         productDetails.is_approved !== "pending")
      ) && (
        <Button variant="secondary"
          onClick={() => router.push(`/dashboard/seller/products/add-product/updateProduct/${id}${!published ? '?isPublish=false' : ''}`)}
          className="max-w-41.75"
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
          className="max-w-41.75 bg-ca0202"
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
          className="max-w-41.75"
          variant="primary"
        >
          {ActivatingLoading ? <LoadingSpinner /> : "Activate product"}
        </Button>
      ) : published && productDetails.activation_requested ? (
        <Button
          disabled={ActivatingLoading}
          onClick={() => setConfirmAction("cancel activation")}
          className="max-w-41.75"
          variant="primary"
        >
          {ActivatingLoading ? <LoadingSpinner /> : "Cancel activation"}
        </Button>
      ) : published && productDetails.deactivation_requested ? (
        <Button
          disabled={ActivatingLoading}
          onClick={() => setConfirmAction("cancel deactivation")}
          className="max-w-41.75"
          variant="primary"
        >
          {ActivatingLoading ? <LoadingSpinner /> : "Cancel deactivation"}
        </Button>
      ) : published &&
        !productDetails.activation_requested &&
        !productDetails.deactivation_requested &&
        productDetails.is_approved === "pending" ? (
        <p className="text-ff715b font-MontserratSemiBold text-sm">
          Pending approval
        </p>
      )
      : published &&
        !productDetails.activation_requested &&
        !productDetails.deactivation_requested &&
        productDetails.is_approved === "pending_update" ? (
        <p className="text-ff715b font-MontserratSemiBold text-sm">
          Pending update
        </p>)
        : published &&
        !productDetails.activation_requested &&
        !productDetails.deactivation_requested &&
        productDetails.is_approved === "rejected" ? (
        <p className="text-ca0202 font-MontserratSemiBold text-sm">
          Rejected
        </p>): (
        !published && (
          <Button
            disabled={submiting || !id}
            onClick={handleSubmitDraftProduct}
            className="max-w-41.75"
            variant="primary"
          >
            {submiting ? <LoadingSpinner /> : "Submit for review"}
          </Button>
        )
      )}
      {!published && (
        <button
          onClick={handleDeleteDraft}
          className="bg-ca0202 rounded-c8 flex items-center justify-center w-c48 flex-shrink-0"
        >
          {deleteLoading ? (
            <LoadingSpinner />
          ) : (
            <Image src={Trash} alt="Delete" width={18.12} height={19.63} />
          )}
        </button>
      )}
    </div>
  );
}
