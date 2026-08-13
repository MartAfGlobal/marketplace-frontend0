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
  attributeValueIds?: Record<string, string>;
  rawAttributeValueIds?: string[];
  isApiVariant?: boolean;
  price?: number | string;
  stock?: number | string;
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
  const [basePrice, setBasePrice] = useState<number | string | undefined>();
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        setDescription(draft.description_html || draft.description || draft.draft_data?.description || "");
        setBasePrice(draft.base_price ?? undefined);
        setSpecificationsText(draft.specifications_html || draft.specifications_text || draft.draft_data?.specifications_text || "");

        const cat = draft.category_info?.category || draft.category;
        if (cat) {
          setCategory(typeof cat === "string" ? { id: cat, name: "" } : cat);
        }

        const subCat =
          draft.category_info?.subcategory ||
          draft.subcategory ||
          draft.sub_category ||
          draft.category?.subcategory;
        if (subCat) {
          const normalizedSub = typeof subCat === "string" ? { id: subCat, name: "", effective_attributes: [] } : subCat;
          setSubCategory(normalizedSub);
          // Dispatch attributes immediately if the draft already carries them
          const earlyAttrs =
            normalizedSub.effective_attributes ||
            draft.category_info?.effective_attributes ||
            draft.effective_attributes;
          if (earlyAttrs?.length) {
            dispatch(
              setStep1Data({
                id: draft.id ?? "",
                attributes: earlyAttrs,
              }),
            );
          }
        }

        let draftImages = draft.draft_data?.product_images || draft.product_images || draft.images || [];
        if (!Array.isArray(draftImages)) draftImages = [draftImages];
        
        if (draftImages.length === 0) {
           if (draft.main_image_url) draftImages.push(draft.main_image_url);
           else if (draft.main_image) draftImages.push(
               typeof draft.main_image === 'string' 
                   ? draft.main_image 
                   : (draft.main_image.original || draft.main_image.url || draft.main_image.medium || draft.main_image.thumbnail)
           );
        }

        if (draftImages.length > 0) {
          const newImages: (File | string | null)[] = [null, null, null, null];
          draftImages.forEach((img: any, idx: number) => {
            if (idx < 4) {
               if (typeof img === 'string') newImages[idx] = img;
               else if (img) newImages[idx] = img.original || img.image || img.image_url || img.url || img.thumbnail || null;
            }
          });
          setImages(newImages);
        }

        const draftVariants = draft.variations || draft.draft_data?.variations || [];
        if (draftVariants.length > 0) {
          const mappedVariants = draftVariants.map((v: any) => {
            const variantImages: (File | string | null)[] = [null, null, null, null];
            let vImgs = v.images || v.product_images || v.variation_images || [];
            if (!Array.isArray(vImgs)) vImgs = [vImgs];
            
            // fallback if arrays are empty
            if (vImgs.length === 0) {
               if (v.main_image_url) vImgs.push(v.main_image_url);
               else if (v.main_image?.image_urls) vImgs.push(v.main_image.image_urls.original || v.main_image.image_urls.thumbnail);
               else if (v.image) vImgs.push(v.image);
            }

            vImgs.forEach((img: any, idx: number) => {
              if (idx < 4) {
                 if (typeof img === 'string') variantImages[idx] = img;
                 else if (img) variantImages[idx] =
                   img.original ||
                   img.image ||
                   img.image_url ||
                   img.url ||
                   img.thumbnail ||
                   img.image_urls?.original ||
                   img.image_urls?.medium ||
                   img.image_urls?.thumbnail ||
                   null;
              }
            });
            const attrValues: Record<string, string> = {};
            // Use canonical slug as the only key to avoid duplicate values later
            const attrIds: Record<string, string> = {};
            const summary = v.attribute_summary || v.attribute_values || v.attributes || [];

            // Best source: attribute_value_ids directly from the API
            const rawAttributeValueIds: string[] = Array.isArray(v.attribute_value_ids)
              ? v.attribute_value_ids.map(String)
              : [];

            if (summary && !Array.isArray(summary)) {
              Object.entries(summary).forEach(([key, val]: [string, any]) => {
                const slug = key.replace(/[\s_]+/g, '-').toLowerCase();
                const valStr = val.value || val.name || val;
                attrValues[slug] = valStr;
                const idVal = val.id || val.value_id;
                if (idVal) attrIds[slug] = String(idVal);
              });
            } else if (Array.isArray(summary)) {
              summary.forEach((val: any) => {
                const slug =
                  val.attribute?.slug ||
                  val.slug ||
                  (val.attribute_name || val.name || "").replace(/[\s_]+/g, '-').toLowerCase();
                const valStr = val.value?.name || val.value || val.attribute_value;
                if (slug && valStr) attrValues[slug] = valStr;
                const idVal = val.value?.id || val.id;
                if (slug && idVal) attrIds[slug] = String(idVal);
              });
            }
            return {
              id: String(v.id || crypto.randomUUID()),
              name: v.variation_name || v.name || "",
              attributesValues: attrValues,
              attributeValueIds: attrIds,
              rawAttributeValueIds,
              isApiVariant: true,
              price: v.base_price || v.price || draft.base_price,
              stock: v.stock || v.inventory || v.quantity || draft.inventory || draft.quantity || 0,
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
    const catId = category?.id;
    const subCatId = subCategory?.id;
    if (!catId || !subCatId || !token) return;

    fetchAttributesReq({
      requestConfig: {
        url: `/products/manufacturer/categories/${catId}/subcategories/`,
        method: "GET",
        token,
      },
      successRes: (res: any) => {
        const subs: any[] = res.data?.subcategories || (Array.isArray(res.data) ? res.data : []);
        const fullSub = subs.find(
          (s: any) =>
            s.id === subCatId ||
            s._id === subCatId ||
            s.uuid === subCatId ||
            (s.name && subCategory?.name && s.name.toLowerCase() === subCategory.name.toLowerCase())
        );

        const attrs = fullSub?.effective_attributes || res.data?.effective_attributes;
        if (attrs?.length) {
          dispatch(
            setStep1Data({
              id: draftId || step1Data.step1.id,
              attributes: attrs,
            }),
          );
        }

        // If subCategory was missing details (like name), update it
        if (fullSub && (!subCategory.name || subCategory.name === "")) {
          setSubCategory(fullSub);
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

        const newId = getAttributeValueId(attributeSlug, value);
        const newIds = { ...(v.attributeValueIds || {}) };
        if (newId) newIds[attributeSlug] = newId;

        return {
          ...v,
          attributesValues: newValues,
          attributeValueIds: newIds,
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

  const getAttributeValueId = (attributeSlug: string, value: string) => {
    if (!value) return null;
    const allAttributes = step1Data.step1.attributes || [];

    // 1. Try finding attribute by slug or name
    const attribute = allAttributes.find(
      (attr) =>
        attr.attribute_slug === attributeSlug ||
        attr.attribute_slug?.toLowerCase() === attributeSlug?.toLowerCase() ||
        attr.attribute_name?.toLowerCase() === attributeSlug?.toLowerCase(),
    );

    if (attribute) {
      const foundValue = attribute.values?.find(
        (v: Values) =>
          String(v.value).toLowerCase().trim() === String(value).toLowerCase().trim() ||
          String(v.id) === String(value) ||
          String(v.slug).toLowerCase() === String(value).toLowerCase(),
      );
      if (foundValue) return foundValue.id;
    }

    // 2. Search across ALL attributes in step1Data
    for (const attr of allAttributes) {
      const foundValue = attr.values?.find(
        (v: Values) =>
          String(v.value).toLowerCase().trim() === String(value).toLowerCase().trim() ||
          String(v.id) === String(value) ||
          String(v.slug).toLowerCase() === String(value).toLowerCase(),
      );
      if (foundValue) return foundValue.id;
    }

    // 3. If value is already a UUID string, return it directly
    if (typeof value === "string" && value.length === 36 && value.includes("-")) {
      return value;
    }

    return null;
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    if (basePrice !== undefined) formData.append("base_price", String(basePrice));
    if (subCategory?.id) formData.append("category_id", subCategory.id);
    if (specificationsText) formData.append("specifications_text", specificationsText);

    images.forEach((file) => {
      if (file && typeof file !== "string") formData.append("images", file);
    });

    const variationsPayload = variants.map((v, idx) => {
      const idsSet = new Set<string>();

      // 1. Raw IDs from API response
      if (v.rawAttributeValueIds && v.rawAttributeValueIds.length > 0) {
        v.rawAttributeValueIds.forEach((id) => id && idsSet.add(id));
      }

      // 2. attributeValueIds map
      if (v.attributeValueIds) {
        Object.values(v.attributeValueIds).forEach((id) => id && idsSet.add(id));
      }

      // 3. Resolve from attributesValues
      if (v.attributesValues) {
        Object.entries(v.attributesValues).forEach(([slug, val]) => {
          if (val) {
            const resId = getAttributeValueId(slug, String(val));
            if (resId) idsSet.add(resId);
          }
        });
      }

      let finalIds = Array.from(idsSet);

      // 4. Fallback to subcategory's default attribute value IDs if still empty
      if (finalIds.length === 0 && step1Data.step1.attributes?.length) {
        const fallbackIds = step1Data.step1.attributes
          .map((attr) => attr.values?.[0]?.id)
          .filter((id): id is string => !!id);
        if (fallbackIds.length > 0) {
          finalIds = fallbackIds;
        }
      }

      return {
        attribute_value_ids: finalIds,
        base_price: Number(v.price ?? 0).toFixed(2),
        stock: Number(v.stock ?? 0),
        is_default: idx === 0,
        gender: "unisex",
        age_group: "adult",
        low_stock_threshold: 10,
        ...(v.isApiVariant ? { id: v.id } : {}),
      };
    });

    formData.append("variations", JSON.stringify(variationsPayload));

    variants.forEach((variant, vIndex) => {
      variant.images.forEach((file) => {
        if (file && typeof file !== "string") {
          formData.append(`variation_${vIndex}_images`, file);
        }
      });
    });

    return formData;
  };

  const validateForm = (): boolean => {
    if (variants.length === 0) {
      setErrorMessage("Please add at least one product variant.");
      setShowErrorModal(true);
      return false;
    }

    const hasAttributesRequired =
      step1Data.step1.attributes && step1Data.step1.attributes.length > 0;

    for (const v of variants) {
      // API variants are already valid on the server
      if (v.isApiVariant) continue;

      const hasFilledValues =
        (v.rawAttributeValueIds && v.rawAttributeValueIds.length > 0) ||
        (v.attributeValueIds && Object.keys(v.attributeValueIds).length > 0) ||
        (v.attributesValues && Object.values(v.attributesValues).some((val) => val && String(val).trim() !== ""));

      if (hasAttributesRequired && !hasFilledValues) {
        setErrorMessage(
          "Please completely select attributes for your variants before publishing.",
        );
        setShowErrorModal(true);
        return false;
      }
    }
    return true;
  };

  const handleUpdateLiveProduct = () => {
    if (!token) return;
    if (!validateForm()) return;

    const formData = buildFormData();

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
    if (!validateForm()) return;

    const formData = buildFormData();

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
        const id = responseData.data?.id || draftId;
        setDraftId(id);

        fetchNextDraftDetails({
          requestConfig: {
            url: `/products/manufacturer/drafts/${id}/publish/`,
            method: "POST",
            token,
            isAuth: true,
            userType: "seller",
          },
          successRes: (submitRes: any) => {
            setShowLiveSuccess(true);
          },
        });
      },
    });
  };

  const handleSaveDraft = () => {
    if (!isSaveEnabled || !token) return;

    const formData = buildFormData();

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
        const id = responseData.data?.id || draftId;
        if(id) setDraftId(id);
        
        sendHttpRequest({
          requestConfig: {
            url: `/products/manufacturer/drafts/${id}/`,
            method: "GET",
            token,
            isAuth: true,
            userType: "seller",
          },
          successRes: (fetchRes: any) => {
            const draft = fetchRes.data;
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
        <p className="text-c12 font-MontserratNormal lg:mt-3 mt-2">
          Images need to be between 500x500 and 1080x1080. White backgrounds are
          advised.
        </p>

        <fieldset
          disabled={loading || updating || fetchingDraftDetails || savingDraft}
        >
          <div className="mt-8 flex items-center flex-wrap gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative lg:h-24 lg:w-24 w-20 h-20 rounded-c8 border border-ff715b overflow-hidden"
              >
                {img ? (
                  <>
                    <Image
                      src={typeof img === "string" ? img : URL.createObjectURL(img!)}
                      alt={`image-${i}`}
                      width={96}
                      height={96}
                      unoptimized
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

            <div className="flex items-center md:flex-row flex-col  gap-8 justify-center">
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
                  <label className="relative lg:h-24 lg:w-24 w-20 h-20 rounded-c8 border flex flex-col items-center justify-center cursor-pointer overflow-hidden">
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
                {variant.images.map((img, originalIdx) =>
                  img ? (
                    <div
                      key={originalIdx}
                      className="relative h-24 w-24 overflow-hidden rounded-c8 border"
                    >
                      <Image
                        src={typeof img === "string" ? img : URL.createObjectURL(img as File)}
                        alt={`variant-${originalIdx}`}
                        width={96}
                        height={96}
                        unoptimized
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleVariantImageRemove(variant.id, originalIdx)}
                        className="absolute top-1 right-1 p-1 bg-white rounded"
                      >
                        <Image src={Trash} alt="delete" width={13} height={15} />
                      </button>
                    </div>
                  ) : null
                )}
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
                <div className="w-full max-w-198 hidden lg:block border h-0.25 border-000000/18" />
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(variant.id)}
                  className="rounded-c8 bg-ca0202 flex items-center justify-center h-12 w-12 flex-shrink-0"
                >
                  <Image src={DeleteIcon} alt="delete" width={20} height={20} />
                </button>
              </div>

              {/* Attributes, price, stock */}
              <div className="flex w-full gap-6 mt-6 md:flex-row flex-col">
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
                    className="mt-2"
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
                    className="mt-2"
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

      <ResultModal
        result="error"
        title="Validation Error"
        message={errorMessage}
        discRescription="Please fix the errors before submitting."
        buttenText="Close"
        isOpen={showErrorModal}
        onConfirm={() => setShowErrorModal(false)}
        onCancel={() => setShowErrorModal(false)}
      />
    </AddProductLayout>
  );
}
