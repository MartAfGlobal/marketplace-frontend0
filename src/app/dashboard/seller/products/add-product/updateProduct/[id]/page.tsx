"use client";

import Image from "next/image";
import AddProductLayout from "../../AddProductLayoutProps";
import Plus from "@/assets/icons/plusOrange.svg";
import Trash from "@/assets/icons/trash.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
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
  Values,
} from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";
import RichTextEditor from "@/components/ui/seller-product-form/RichTextEditor";
import { setStep1Data } from "@/store/sellers/addProductSlice";
import { useDispatch, useSelector } from "react-redux";

import { number } from "framer-motion";
import { base } from "framer-motion/client";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { VariantForm as BaseVariantForm } from "../../step2/page";
import ResultModal from "@/components/ui/forms/resultModal";

export interface VariantForm extends Omit<BaseVariantForm, 'images'> {
  images: (File | string | null)[];
}

export default function UpdateProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const isLiveMode = searchParams?.get("isPublish") !== "false";
  const [specificationsText, setSpecificationsText] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [basePrice, setBasePrice] = useState<number | undefined>();
  const [subCategory, setSubCategory] = useState<SubCategory | undefined>();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState<(File | string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [variants, setVariants] = useState<VariantForm[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      attributesValues: {},
      price: undefined,
      stock: 0,
      images: [null, null, null, null],
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [attributesValues, setAttributesValues] = useState<
    Record<string, string>
  >({});

  const hasImage = images.some((img) => img !== null);

  const isNextEnabled =
    productName && category && subCategory && hasImage && description;

  const isSaveEnabled = !!productName;

  const handleImageChange = (file: File, index: number) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const token = useSelector((state: RootState) => state.token?.token);

  const { sendHttpRequest: savingToDraftReq, loading: savingDraft } = useHttp();
  const { sendHttpRequest, loading: fetchingDraftDetails } = useHttp();
  const { sendHttpRequest: updatingDraft, loading: updating } = useHttp();
  const { sendHttpRequest: fetchNextDraftDetails, loading: fetchingNextDraftDetails } = useHttp();
  const { sendHttpRequest: fetchAttributesReq } = useHttp();

  const step1Data = useSelector((state: RootState) => state.addProduct);

  const [draftId, setDraftId] = useState("");
  const [showDraftSuccess, setShowDraftSuccess] = useState(false);
  const [showLiveSuccess, setShowLiveSuccess] = useState(false);

  useEffect(() => {
    if (!id || !token) return;

    sendHttpRequest({
      requestConfig: {
        url: isLiveMode 
          ? `/products/manufacturer/products/${id}/` 
          : `/products/manufacturer/drafts/${id}/`,
        method: "GET",
        token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        const draft = responseData.data;
        if (!draft) return;

        setProductName(draft.name ?? "");
        setDescription(draft.description || draft.description_html || "");
        setBasePrice(draft.base_price ?? undefined);
        setSpecificationsText(draft.specifications_text || draft.specifications_html || draft.draft_data?.specifications_text || "");

        const cat = draft.category_info?.category || draft.category;
        if (cat) setCategory(cat);

        const subCat = draft.category_info?.subcategory || draft.subcategory || draft.sub_category || draft.category?.subcategory;
        if (subCat) setSubCategory(subCat);

        const draftImages = draft.draft_data?.product_images || draft.images || [];
        if (draftImages.length > 0) {
          const newImages: (File | string | null)[] = [null, null, null, null];
          draftImages.forEach((img: any, idx: number) => {
            if (idx < 4) newImages[idx] = img.thumbnail || img.url || img;
          });
          setImages(newImages);
        }

        const draftVariants = draft.variations || draft.draft_data?.variations || [];
        if (draftVariants.length > 0) {
          const mappedVariants = draftVariants.map((v: any) => {
            const variantImages: (File | string | null)[] = [null, null, null, null];
            const vImgs = v.images || v.product_images || [];
            vImgs.forEach((img: any, idx: number) => {
              if (idx < 4) variantImages[idx] = img.thumbnail || img.url || img;
            });
            const attrValues: Record<string, string> = {};
            if (v.attribute_summary) {
              Object.entries(v.attribute_summary).forEach(([slug, val]: [string, any]) => {
                attrValues[slug] = val.value || val.name || val;
              });
            }
            return {
              id: String(v.id || crypto.randomUUID()),
              name: v.variation_name || v.name || "",
              attributesValues: attrValues,
              price: v.base_price || draft.base_price,
              stock: v.stock || v.inventory || draft.inventory || 0,
              images: variantImages,
            };
          });
          setVariants(mappedVariants);
        } else if (draft.inventory || draft.quantity) {
          setVariants((prev) => [
            { ...prev[0], price: draft.base_price, stock: draft.inventory || draft.quantity }
          ]);
        }
      }
    });
  }, [id, token, sendHttpRequest]);

  // Sync subcategory attributes to Redux for Variations display
  useEffect(() => {
    if (!category?.id || !subCategory?.id || !token) return;

    fetchAttributesReq({
      requestConfig: {
        url: `/products/manufacturer/categories/${category.id}/subcategories/`,
        method: "GET",
        token,
      },
      successRes: (res: any) => {
        const subs = res.data?.subcategories || [];
        const fullSub = subs.find((s: any) => s.id === subCategory.id);
        if (fullSub?.effective_attributes) {
          dispatch(
            setStep1Data({
              id: draftId || step1Data.step1.id,
              attributes: fullSub.effective_attributes,
            })
          );
        }
      },
    });
  }, [category?.id, subCategory?.id, token, dispatch]);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        attributesValues: {},
        price: undefined,
        stock: 0,
        images: [null, null, null, null],
      },
    ]);
  };

  const handleDeleteVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleVariantImageRemove = (variantId: string, index: number) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        const newImages = [...v.images];
        newImages[index] = null;
        return { ...v, images: newImages };
      }),
    );
  };

  const getAttributeDisplayName = (attributeSlug: string, value: string) => {
    const attribute = step1Data.step1.attributes?.find(
      (attr) => attr.attribute_slug === attributeSlug,
    );
    if (!attribute) return value;

    const foundValue = attribute.values?.find((v: Values) => v.value === value);
    if (foundValue) return foundValue.value;

    for (const extra of attribute.extra_fields || []) {
      if (extra.default === value || extra.name === value) return extra.name;
    }

    return value;
  };

  const generateVariantName = (values: Record<string, string>) =>
    Object.entries(values)
      .map(([slug, val]) => getAttributeDisplayName(slug, val))
      .filter(Boolean)
      .join(" / ");

  const handleAttributeChange = (
    variantId: string,
    attributeSlug: string,
    value: string,
  ) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        const newValues = { ...v.attributesValues, [attributeSlug]: value };
        return {
          ...v,
          attributesValues: newValues,
          name: generateVariantName(newValues),
        };
      }),
    );
  };

  const url = isLiveMode
    ? `/products/manufacturer/products/${id}/`
    : draftId === "" || step1Data.step1.id === ""
      ? "/products/manufacturer/drafts/"
      : `/products/manufacturer/drafts/${draftId || step1Data.step1.id}/`;

  const method = isLiveMode ? "PUT" : draftId === "" || step1Data.step1.id === "" ? "POST" : "PUT";

  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleUpdateLiveProduct = () => {
    if (!token) return;

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("base_price", String(basePrice));
    formData.append("category_id", subCategory?.id || "");

    images.forEach((file) => {
      if (file && typeof file !== "string") formData.append("images", file);
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
      successRes: () => {
        setShowLiveSuccess(true);
      },
    });
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
      if (file && typeof file !== "string") formData.append("images", file);
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

        fetchNextDraftDetails({
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
      if (file && typeof file !== "string") formData.append("images", file);
    });

    formData.append("base_price", String(basePrice));
    formData.append("category_id", subCategory?.id || "");

    savingToDraftReq({
      requestConfig: {
        url: url,
        method: "POST",
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
    <AddProductLayout stage={4} title="Upload Image">
      <form>
        <p className="text-c12 font-MontserratNormal mt-3">
          Images need to be between 500x500 and 1080x1080. White backgrounds are
          advised.
        </p>

        <fieldset
          disabled={loading || updating || fetchingDraftDetails || savingDraft}
        >
          <div className="mt-8 flex items-center gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative h-24 w-24 rounded-c8 border border-ff715b overflow-hidden"
              >
                {img ? (
                  <>
                    <Image
                      src={typeof img === "string" ? img : URL.createObjectURL(img!)}
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

          <div className="mt-c48 space-y-6">
            <h1 className="font-MontserratSemiBold text-c18">
              General product information
            </h1>

            <div className="flex items-center gap-8 justify-center">
              <div className="w-full">
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
                  type="number"
                  value={basePrice ?? ""}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
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
                  if (sub?.effective_attributes) {
                    dispatch(
                      setStep1Data({
                        id: draftId || step1Data.step1.id,
                        attributes: sub.effective_attributes,
                      })
                    );
                  }
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

          {variants.map((variant) => (
            <div key={variant.id} className="mb-10">
              {/* Images */}
              <div className="flex gap-4 mt-4">
                {variant.images.filter(Boolean).length < 4 && (
                  <label className="relative h-24 w-24 rounded-c8 border flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => {
                        if (!e.target.files?.[0]) return;
                        const newImages = [
                          ...variant.images.filter(Boolean),
                          e.target.files[0],
                        ];
                        while (newImages.length < 4) newImages.push(null);
                        setVariants((prev) =>
                          prev.map((v) =>
                            v.id === variant.id
                              ? { ...v, images: newImages }
                              : v,
                          ),
                        );
                      }}
                    />
                    <Image src={Plus} alt="add" width={15} height={15} />
                    <span className="mt-1 text-c8 font-MontserratNormal">
                      Add Image
                    </span>
                  </label>
                )}
                {variant.images.filter(Boolean).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-24 w-24 overflow-hidden rounded-c8 border"
                  >
                    <Image
                      src={typeof img === "string" ? img : URL.createObjectURL(img!)}
                      alt={`variant-${idx}`}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleVariantImageRemove(variant.id, idx)}
                      className="absolute top-1 right-1 p-1 bg-white rounded"
                    >
                      <Image src={Trash} alt="delete" width={13} height={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Variant name and delete */}
              <div className="mt-8 flex items-center justify-center gap-8">
                <Input
                  disabled
                  className="w-full"
                  placeholder="Variant name"
                  value={variant.name}
                  readOnly
                />
                <div className="w-full max-w-198 border h-0.25 border-000000/18" />
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(variant.id)}
                  className="rounded-c8 bg-ca0202 flex items-center justify-center h-12 w-12 flex-shrink-0"
                >
                  <Image src={DeleteIcon} alt="delete" width={20} height={20} />
                </button>
              </div>

              {/* Attributes, price, stock */}
              <div className="flex w-full gap-6 mt-6">
                <div className="w-full">
                  {step1Data?.step1.attributes?.length ? (
                    <AttributesSection
                      attributes={
                        step1Data.step1.attributes as EffectiveAttribute[]
                      }
                      values={variant.attributesValues}
                      onChange={(name, value) =>
                        handleAttributeChange(variant.id, name, value)
                      }
                    />
                  ) : (
                    <p>No attributes to display</p>
                  )}
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    className="mt-2"
                    value={variant.price ?? ""}
                    onChange={(e) =>
                      setVariants((prev) =>
                        prev.map((v) =>
                          v.id === variant.id
                            ? { ...v, price: Number(e.target.value) }
                            : v,
                        ),
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    className="mt-2"
                    value={variant.stock ?? ""}
                    onChange={(e) =>
                      setVariants((prev) =>
                        prev.map((v) =>
                          v.id === variant.id
                            ? { ...v, stock: Number(e.target.value) }
                            : v,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            className="max-w-32.5 mt-8"
            onClick={handleAddVariant}
          >
            Add variant
          </Button>

          <div className="mt-6">
            <RichTextEditor
              label="Product Specifications"
              value={specificationsText}
              onChange={setSpecificationsText}
            />
          </div>
        </fieldset>

        {isLiveMode ? (
          <div className="mt-c48 flex justify-end gap-6 items-center">
            <Button
              type="button"
              disabled={loading || updating || fetchingDraftDetails}
              onClick={handleUpdateLiveProduct}
              className="max-w-32.5"
            >
              {updating ? <LoadingSpinner color="border-white" /> : "Update Product"}
            </Button>
          </div>
        ) : (
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
                loading || updating || fetchingDraftDetails || savingDraft || fetchingNextDraftDetails
              }
              type="button"
              onClick={handleNext}
              className="max-w-32.5"
            >
              {updating || fetchingNextDraftDetails ? <LoadingSpinner color="border-white" /> : "Next"}
            </Button>
          </div>
        )}
      </form>
      <ResultModal
        title="Saved as Draft"
        message="Your product details have been securely saved as a draft."
        discRescription="You can continue editing now, or go back to your products dashboard."
        buttenText="Continue Editing"
        secondaryButtonText="Go to Products"
        isOpen={showDraftSuccess}
        onConfirm={() => setShowDraftSuccess(false)}
        onCancel={() => setShowDraftSuccess(false)}
        onSecondaryAction={() => router.push("/dashboard/seller/products")}
      />
      
      <ResultModal
        title="Update Submitted for Review"
        message="Your product updates have been successfully submitted."
        discRescription="Changes will be visible to customers once approved by an admin."
        buttenText="Continue Editing"
        secondaryButtonText="Go to Dashboard"
        isOpen={showLiveSuccess}
        onConfirm={() => setShowLiveSuccess(false)}
        onCancel={() => setShowLiveSuccess(false)}
        onSecondaryAction={() => router.push("/dashboard/seller/products")}
      />
    </AddProductLayout>
  );
}
