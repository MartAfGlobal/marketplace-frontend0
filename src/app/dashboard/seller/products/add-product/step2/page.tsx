"use client";

import Image from "next/image";
import AddProductLayout from "../AddProductLayoutProps";
import Plus from "@/assets/icons/plusOrange.svg";
import Trash from "@/assets/icons/trash.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";
import {
  AttributesSection,
  Category,
  SubCategory,
  EffectiveAttribute,
  Values,
} from "@/components/ui/seller-components/body-components/products/add-form/categorySelector";
import { setStep1Data, Variation } from "@/store/sellers/addProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import ResultModal from "@/components/ui/forms/resultModal";

export interface VariantForm {
  id: string;
  name: string;
  attributesValues: Record<string, string>;
  price?: number | string;
  stock?: number | string;
  images: (File | null)[];
}

export default function AddProductStep1Page() {
  const dispatch = useDispatch();
  const step1Data = useSelector((state: RootState) => state.addProduct);
  const token = useSelector((state: RootState) => state.token?.token);
  const router = useRouter();

  const { sendHttpRequest: savingToDraftReq, loading: savingDraft, error: saveDraftError, setError: setSaveDraftError } = useHttp();
  const { sendHttpRequest, loading: nexting, error: nextingError, setError: setNextingError } = useHttp();

  const anyError = saveDraftError || nextingError;
  const clearError = () => {
    setSaveDraftError(null);
    setNextingError(null);
  };

  // const [category, setCategory] = useState<Category | undefined>();
  // const [subCategory, setSubCategory] = useState<SubCategory | undefined>();
  // const [productName, setProductName] = useState("");
  // const [description, setDescription] = useState("");
  // const [basePrice, setBasePrice] = useState<number | undefined>();
  // const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
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

  const [showDraftSuccess, setShowDraftSuccess] = useState(false);

  console.log("step1Data in step2", step1Data);
  /* ---------------- ATTRIBUTE DISPLAY ---------------- */
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

  const isVariantValid = (v: VariantForm) =>
    Object.values(v.attributesValues).every(
      (val) => val && val.trim() !== "",
    ) && v.images.some((img) => img !== null);

  const areAllVariantsValid =
    variants.length > 0 && variants.every(isVariantValid);

  /* ---------------- ATTRIBUTE VALUE ID ---------------- */
  const getAttributeValueId = (attributeSlug: string, value: string) => {
    const attribute = step1Data.step1.attributes?.find(
      (attr) => attr.attribute_slug === attributeSlug,
    );
    if (!attribute) return null;

    const foundValue = attribute.values?.find((v: Values) => v.value === value);
    if (foundValue) return foundValue.id;

    for (const extra of attribute.extra_fields || []) {
      if (extra.default === value || extra.name === value) return extra.name;
    }

    return null;
  };

  // const compileStep2Payload = (): Variation[] =>
  //   variants.map((v, idx) => ({
  //     attribute_value_ids: Object.entries(v.attributesValues)
  //       .map(([slug, value]) => getAttributeValueId(slug, value))
  //       .filter((id): id is string => id !== null),
  //     base_price: (v.price ?? 0).toFixed(2),
  //     stock: v.stock ?? 0,
  //     is_default: idx === 0,
  //     gender: "unisex",
  //     age_group: "adult",
  //     low_stock_threshold: 10,
  //     images: v.images.filter((i): i is File => i !== null),
  //   }));

  const buildFormData = () => {
    const formData = new FormData();

    const variationsPayload = variants.map((v, idx) => ({
      attribute_value_ids: Object.entries(v.attributesValues)
        .map(([slug, value]) => getAttributeValueId(slug, value))
        .filter((id): id is string => id !== null),

      base_price: Number(v.price ?? 0).toFixed(2),
      stock: Number(v.stock ?? 0),
      is_default: idx === 0,
      gender: "unisex",
      age_group: "adult",
      low_stock_threshold: 10,
    }));

    // send variations JSON
    formData.append("variations", JSON.stringify(variationsPayload));

    // send images per variation
    variants.forEach((variant, vIndex) => {
      variant.images.forEach((file) => {
        if (file) {
          formData.append(`variation_${vIndex}_images`, file);
        }
      });
    });

    return formData;
  };
  const isFirstVariantValid = (() => {
    if (!variants.length) return false;

    const first = variants[0];

    const attributesFilled = Object.values(first.attributesValues).every(
      (val) => val && val.trim() !== "",
    );

    const hasImage = first.images.some((img) => img !== null);

    const hasPrice = first.price !== undefined && Number(first.price) > 0;

    const hasStock = first.stock !== undefined && Number(first.stock) > 0;

    return attributesFilled && hasImage && hasPrice && hasStock;
  })();
  const handleSaveDraft = () => {
    if (!token) return;

    const formData = buildFormData();
    savingToDraftReq({
      requestConfig: {
        url: `/products/manufacturer/drafts/${step1Data.step1.id}/`,
        method: "PUT",
        token,
        body: formData,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        const id = responseData.data.id;
        sendHttpRequest({
          requestConfig: {
            url: `/products/manufacturer/drafts/${id}/`,
            method: "GET",
            token,
            isAuth: true,
            userType: "seller",
          },
          successRes: (responseData: any) => {
            setShowDraftSuccess(true);
          },
        });
      },
    });
  };

  const handleNext = () => {
    if (!areAllVariantsValid || !token) return;

    const formData = buildFormData();
    sendHttpRequest({
      requestConfig: {
        url: `/products/manufacturer/drafts/${step1Data.step1.id}/`,
        method: "PUT",
        token,
        body: formData,
        isAuth: true,
        userType: "seller",
      },
      successRes: (responseData: any) => {
        console.log("new updated", responseData);

        router.push("/dashboard/seller/products/add-product/step3");
      },
    });
  };

  useEffect(() => {
    if (step1Data?.step1.attributes?.length) {
      const initialValues: Record<string, string> = {};
      step1Data.step1.attributes.forEach((attr) => {
        initialValues[attr.attribute_slug] = "";
      });
      setVariants((prev) =>
        prev.map((v) => ({ ...v, attributesValues: initialValues })),
      );
    }
  }, [step1Data]);

  return (
    <AddProductLayout stage={2} title="Variants">
      <form className="lg:mt-8.5">
        {variants.map((variant) => (
          <div key={variant.id} className="mb-10">
            {/* Images */}
            <div className="flex flex-wrap gap-4 mt-8 lg:mt-4">
              {variant.images.filter(Boolean).length < 4 && (
                <label className="relative lg:h-24 lg:w-24 h-20 w-20 rounded-c8 border flex flex-col items-center justify-center cursor-pointer overflow-hidden">
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
                          v.id === variant.id ? { ...v, images: newImages } : v,
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
                    src={URL.createObjectURL(img!)}
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
              <div className="w-full hidden lg:block max-w-198 border h-0.25 border-000000/18" />
              <button
                type="button"
                onClick={() => handleDeleteVariant(variant.id)}
                className="rounded-c8 bg-ca0202 flex items-center justify-center h-12 w-12 flex-shrink-0"
              >
                <Image src={DeleteIcon} alt="delete" width={20} height={20} />
              </button>
            </div>

            {/* Attributes, price, stock */}
            <div className="flex w-full gap-6 mt-6 lg:flex-row  flex-col">
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
                  type="text"
                  inputMode="decimal"
                  className=""
                  value={variant.price ?? ""}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((v) =>
                        v.id === variant.id
                          ? { ...v, price: e.target.value.replace(/[^0-9.]/g, '') }
                          : v,
                      ),
                    )
                  }
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  className=""
                  value={variant.stock ?? ""}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((v) =>
                        v.id === variant.id
                          ? { ...v, stock: e.target.value.replace(/[^0-9.]/g, '') }
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

        <div className="mt-c48 flex justify-end gap-6 items-center">
          <Button
            type="button"
            disabled={savingDraft}
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
            disabled={!areAllVariantsValid || nexting}
            type="button"
            onClick={handleNext}
            className="max-w-32.5"
          >
            {nexting ? <LoadingSpinner /> : "Next"}
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
