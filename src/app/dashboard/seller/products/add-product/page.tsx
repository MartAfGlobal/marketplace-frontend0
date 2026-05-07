"use client";

import Image from "next/image";
import AddProductLayout from "./AddProductLayoutProps";
import Plus from "@/assets/icons/plusOrange.svg";
import Trash from "@/assets/icons/trash.svg";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";
import {
  CategoryDropdown,
  SubCategoryDropdown,
  AttributesSection,
  Category,
  SubCategory,
  EffectiveAttribute,
} from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";
import RichTextEditor from "@/components/ui/seller-product-form/RichTextEditor";
import { setStep1Data } from "@/store/sellers/addProductSlice";
import { useDispatch, useSelector } from "react-redux";

import { number } from "framer-motion";
import { base } from "framer-motion/client";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import ResultModal from "@/components/ui/forms/resultModal";

export default function AddProductStep1Page() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [category, setCategory] = useState<Category | undefined>();
  const [basePrice, setBasePrice] = useState<number | string | undefined>();
  const [subCategory, setSubCategory] = useState<SubCategory | undefined>();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [loading, setLoading] = useState(false);

  const [attributesValues, setAttributesValues] = useState<
    Record<string, string>
  >({});

  const [showDraftSuccess, setShowDraftSuccess] = useState(false);

  const hasAllImages = images.every((img) => img !== null);

  const isNextEnabled =
    productName && category && subCategory && hasAllImages && description && !!basePrice;

  const isSaveEnabled = !!productName && !!basePrice;

  const handleImageChange = (file: File, index: number) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const token = useSelector((state: RootState) => state.token?.token);

  const { sendHttpRequest: savingToDraftReq, loading: savingDraft, error: saveDraftError, setError: setSaveDraftError } = useHttp();
  const { sendHttpRequest, loading: fetchingDraftDetails, error: fetchDraftError, setError: setFetchDraftError } = useHttp();
  const { sendHttpRequest: updatingDraft, loading: updating, error: updateDraftError, setError: setUpdateDraftError } = useHttp();

  const anyError = saveDraftError || fetchDraftError || updateDraftError;
  const clearError = () => {
    setSaveDraftError(null);
    setFetchDraftError(null);
    setUpdateDraftError(null);
  };

  const step1Data = useSelector((state: RootState) => state.addProduct);

  const [draftId, setDraftId] = useState("");

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

  const url =
    draftId === "" || step1Data.step1.id === ""
      ? "/products/manufacturer/drafts/"
      : `/products/manufacturer/drafts/${draftId || step1Data.step1.id}/`;

  const method = draftId === "" || step1Data.step1.id === "" ? "POST" : "PUT";

  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  useEffect(() => {
    console.log("unknow", step1Data.step1);
  }, [dispatch]);

  const getValidFiles = () => images.filter((i): i is File => i !== null);

  const handleNext = () => {
    if (!isNextEnabled || !token) return;

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("base_price", String(basePrice));
    formData.append("category_id", subCategory?.id || "");

    images.forEach((file) => {
      if (file) formData.append("images", file);
    });

    updatingDraft({
      requestConfig: {
        url,
        method,
        token,
        body: formData,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        const id = responseData.data.id;
        setDraftId(id);

        sendHttpRequest({
          requestConfig: {
            url: `/products/manufacturer/drafts/${id}/`,
            method: "GET",
            token,
            isAuth: true,
            userType: "seller",
          },
          successRes: (responseData: any) => {
            const draft = responseData.data;

            console.log("ggggggggg", draft);

            dispatch(
              setStep1Data({
              id: draft.id ?? id,
                
                attributes: subCategory?.effective_attributes ?? []
                // images: images.filter((i): i is File => i !== null), // File[]
              }),
            );

             router.push("/dashboard/seller/products/add-product/step2");
          },
        });
      },
    });
  };

  const handleSaveDraft = () => {
    if (!isSaveEnabled || !token) return;

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);

    images.forEach((file) => {
      if (file) formData.append("images", file);
    });

    formData.append("base_price", String(basePrice));
    formData.append("category_id", subCategory?.id || "");

    savingToDraftReq({
      requestConfig: {
        url: url,
        method: method,
        token,
        body: formData,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        const id = responseData.data.id;
        setDraftId(id);

        sendHttpRequest({
          requestConfig: {
            url: `/products/manufacturer/drafts/${id}/`,
            method: "GET",
            token,
            isAuth: true,
            userType: "seller",
          },
          successRes: (responseData: any) => {
            const draft = responseData.data;

            console.log("ggggggggg", draft);

            dispatch(
              setStep1Data({
                id: draft.id ?? id,
                attributes: subCategory?.effective_attributes ?? [],
              }),
            );
            
            setShowDraftSuccess(true);
          },
        });
      },
    });
  };

  return (
    <AddProductLayout stage={1} title="Upload Image">
      <form>
        <p className="text-c12 font-MontserratNormal lg:mt-3 mt-2">
          Images need to be between 500x500 and 1080x1080. White backgrounds are
          advised.
        </p>

        <fieldset
          disabled={loading || updating || fetchingDraftDetails || savingDraft}
        >
          <div className="mt-8 flex items-center gap-4 w-full flex-wrap">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative lg:h-24 lg:w-24 h-20 w-20 rounded-c8 border border-ff715b overflow-hidden"
              >
                {img ? (
                  <>
                    <Image
                      src={URL.createObjectURL(img)}
                      alt={`image-${i}`}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(i)}
                      className="absolute top-1 right-1 rounded-c8 p-1 w-6 h-6 flex items-center justify-center bg-ffffff"
                    >
                      <Image
                        src={Trash}
                        alt="delete"
                        width={13.33}
                        height={15}
                      />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0])
                          handleImageChange(e.target.files[0], i);
                      }}
                    />
                    <Image src={Plus} alt="add" width={15} height={15} />
                    <p className="text-c8 font-MontserratNormal">
                      {i === 0 ? "Main image" : "Image"}
                    </p>
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="lg:mt-c48 mt-8 space-y-6">
            <h1 className="font-MontserratSemiBold text-c18">
              General product information
            </h1>

            <div className="md:flex-row flex flex-col items-center  md:gap-8 justify-center">
              <div className="w-full mb-6 md:mb-0 ">
                <Label>Name of Product</Label>
                <Input
                  className="mt-2"
                  placeholder="Ankara shorts and blouse"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="w-full">
                <Label>Price</Label>
                <Input
                  className="mt-2"
                  placeholder="Product base price"
                  type="text"
                  inputMode="decimal"
                  value={basePrice ?? ""}
                  onChange={(e) => setBasePrice(e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <CategoryDropdown
                selected={category?.name}
                onSelect={(cat: Category) => {
                  setCategory(cat);
                  setSubCategory(undefined);
                  setAttributesValues({});
                }}
              />

              <SubCategoryDropdown
                category={category}
                selected={subCategory?.name}
                onSelect={(sub: SubCategory) => {
                  setSubCategory(sub);
                  setAttributesValues({});
                }}
              />
            </div>
          </div>

          <div className="mt-6">
            <RichTextEditor
              label="Product Description"
              value={description}
              onChange={setDescription}
            />
          </div>
        </fieldset>

        <div className="mt-c48 flex justify-end gap-6 items-center">
          <Button
            type="button"
            disabled={loading || updating || fetchingDraftDetails || savingDraft || !isSaveEnabled}
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
            disabled={loading || updating || fetchingDraftDetails || savingDraft || !isNextEnabled}
            type="button"
            onClick={handleNext}
            className="max-w-32.5"
          >
            {updating || fetchingDraftDetails ? <LoadingSpinner /> : "Next"}
          </Button>
        </div>
      </form>

      <ResultModal
        title="Product Saved to Draft"
        message="Your product has been securely saved as a draft."
        discRescription="You can continue editing now, or view your drafts from the products dashboard."
        buttenText="Continue"
        secondaryButtonText="Go back to products"
        isOpen={showDraftSuccess}
        onConfirm={() => setShowDraftSuccess(false)}
        onCancel={() => setShowDraftSuccess(false)}
        onSecondaryAction={() => router.push("/dashboard/seller/products")}
      />

      {/* ERROR MODAL */}
      <ResultModal
        result="error"
        title="Action Failed"
        message={anyError || "An unexpected error occurred."}
        discRescription="Please review the error and try again."
        buttenText="Close"
        isOpen={!!anyError}
        onConfirm={clearError}
        onCancel={clearError}
      />
    </AddProductLayout>
  );
}
