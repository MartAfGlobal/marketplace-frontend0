"use client";

import Image from "next/image";
import AddProductLayout from "../AddProductLayoutProps";

import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";

import RichTextEditor from "@/components/ui/seller-product-form/RichTextEditor";
import { setStep1Data } from "@/store/sellers/addProductSlice";
import { useDispatch, useSelector } from "react-redux";
import ResultModal from "@/components/ui/forms/resultModal";

import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddProductStep1Page() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [specificationsText, setSpecificationsText] = useState("");
  const [successful, setSuccessful] = useState(false);

  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [loading, setLoading] = useState(false);

  const hasImage = images.some((img) => img !== null);

  const isNextEnabled = specificationsText;

  const token = useSelector((state: RootState) => state.token?.token);

  const { sendHttpRequest: savingToDraftReq, loading: savingDraft } = useHttp();
  const { sendHttpRequest, loading: fetchingDraftDetails } = useHttp();
  const { sendHttpRequest: updatingDraft, loading: updating } = useHttp();
  const [saveDraftSuccess, setSaveDraftSuccess] = useState(false);

  const step1Data = useSelector((state: RootState) => state.addProduct.step1);

  //   useEffect(() => {
  //   const existingId = draftId || step1Data.step1.id;

  //   if (!existingId || !token) return;

  //   sendHttpRequest({
  //     requestConfig: {
  //       url: `/products/manufacturer/drafts/${existingId}/`,
  //       method: "GET",
  //       token,
  //       isAuth: true,
  //       userType: "seller",
  //     },
  //     successRes: (responseData: any) => {
  //       const draft = responseData.data;

  //       // 🔥 populate form states
  //       setProductName(draft.name ?? "");
  //       setDescription(draft.description ?? "");
  //       setBasePrice(draft.base_price ?? undefined);

  //       // If your API returns category/subcategory objects
  //       if (draft.category) setCategory(draft.category);
  //       if (draft.sub_category) setSubCategory(draft.sub_category);

  //       // Images (if URLs returned)
  //       if (draft.draft_data.product_images && draft.draft_data.product_images.length > 0) {
  //         setImages(
  //           draft.draft_data.product_images.map(() => null) // keep slots but no File objects
  //         );
  //       }

  //       setDraftId(draft.id);
  //     },
  //   });
  // }, [token, draftId, step1Data.step1.id]);

  useEffect(() => {
    console.log("unknow", step1Data);
  }, [step1Data]);

  const formData = new FormData();

  formData.append("specifications_text", specificationsText);

  // PRODUCT IMAGES (FILES)

  const resetAllSteps = () => {
    dispatch(
      setStep1Data({
        id: "",

        attributes: [],
      }),
    );
  };

  const handleNext = () => {
    if (!isNextEnabled || !token || !step1Data.id) return;

    console.log("new results", step1Data);

    updatingDraft({
      requestConfig: {
        url: `/products/manufacturer/drafts/${step1Data.id}/`,
        method: "PUT",
        token,
        body: formData,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        const draftId = responseData.data.id;
        console.log("final submission", draftId);
        sendHttpRequest({
          requestConfig: {
            url: `/products/manufacturer/drafts/${draftId}/publish/`,
            method: "POST",
            token,
            isAuth: true,
            userType: "seller",
          },
          successRes: (responseData: any) => {
            console.log("PRODUCT PUBLISHED", responseData);
            resetAllSteps();
            setSuccessful(true);
          },
        });
      },
    });
  };

  const handleSaveDraft = () => {
    if (!specificationsText || !token) return;
    console.log("saving draft", step1Data);

    const formData = new FormData();
    formData.append("specifications_text", specificationsText);

    savingToDraftReq({
      requestConfig: {
        url: `/products/manufacturer/drafts/${step1Data.id}/`,
        method: "PUT",
        token,
        body: formData,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        const id = responseData.data.id;
        console.log("draft saved", responseData);

        sendHttpRequest({
          requestConfig: {
            url: `/products/manufacturer/drafts/${id}/`,
            method: "GET",
            token,
            isAuth: true,
            userType: "seller",
          },
          successRes: () => {
            resetAllSteps();
            setSaveDraftSuccess;
          },
        });
      },
    });
  };

  return (
    <AddProductLayout stage={3} title="Product specifications">
      <form>
        <fieldset
          disabled={loading || updating || fetchingDraftDetails || savingDraft}
        >
          <div className="mt-6">
            <RichTextEditor
              label="Product Specifications"
              value={specificationsText}
              onChange={setSpecificationsText}
            />
          </div>
        </fieldset>

        <div className="mt-c48 flex justify-end gap-6 items-center">
          <Button
            type="button"
            disabled={
              loading || updating || fetchingDraftDetails || savingDraft
            }
            onClick={handleSaveDraft}
            variant="secondary"
            className="max-w-32.5"
          >
            {savingDraft ? (
              <LoadingSpinner color="border-ff715b" />
            ) : (
              "Save in draft"
            )}
          </Button>

          <Button
            disabled={
              loading || updating || fetchingDraftDetails || savingDraft
            }
            type="button"
            onClick={handleNext}
            className="max-w-32.5"
          >
            {updating || fetchingDraftDetails ? (
              <LoadingSpinner />
            ) : (
              "Add product"
            )}
          </Button>
        </div>
      </form>
      <ResultModal
        title="Product Submitted Successfully"
        message="Your product has been submitted and is now pending approval."
        discRescription="Once approved by the admin, it will be visible on the marketplace. You can track its status or edit it in your product page."
        buttenText="Go to Products"
        isOpen={successful}
        onConfirm={() => router.push("/dashboard/seller/products")}
      />
      <ResultModal
        title="Product Saved to Draft"
        message="Your product has been saved as a draft."
        discRescription="You can edit it later or submit it for approval."
        buttenText="Go to Products"
        isOpen={saveDraftSuccess}
        onConfirm={() => router.push("/dashboard/seller/products")}
      />
    </AddProductLayout>
  );
}
