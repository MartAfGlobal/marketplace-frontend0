interface ProductInfoProps {
  productDetails: any;
  published: string | undefined;
}

export default function ProductInfo({ productDetails, published }: ProductInfoProps) {
  if (!productDetails) return null;

  return (
    <>
      <div className="flex gap-4 mt-8">
        <div className="space-y-2">
          <h2 className="text-base font-MontserratNormal">Quantity sold</h2>
          <p className="text-c20 font-MontserratNormal ">{productDetails?.sold || 0}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-MontserratNormal">Quantity in stock</h2>
          <p className="text-c20 font-MontserratNormal text-000000/78">
            {productDetails.inventory || productDetails.quantity || 0}
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-1">
        <h1 className="text-c12 font-MontserratNormal">Product name</h1>
        <p className="text-c18 font-MontserratMedium">
          {productDetails?.name || "Product name not available"}
        </p>
      </div>
      <div className="mt-4 space-y-1">
        <h1 className="text-c12 font-MontserratNormal">Status</h1>
        <p className="text-c18 font-MontserratMedium">
          {published === "true" ? (productDetails?.is_active ? "Live" : "Inactive") : "Draft"}
        </p>
      </div>
      <div className="mt-4 space-y-1">
        <h1 className="text-c12 font-MontserratNormal">Price</h1>
        <p className="text-c24 font-MontserratSemiBold">N{productDetails?.base_price}</p>
      </div>
      <div className="mt-6 flex gap-6">
        <div>
          <h1 className="text-c12 font-MontserratNormal">Category</h1>
          <p className="text-c18 font-MontserratMedium">
            {productDetails?.category?.name || productDetails.category_info?.category?.name || "N/A"}
          </p>
        </div>
        <div>
          <h1 className="text-c12 font-MontserratNormal">Subcategory</h1>
          <p className="text-c18 font-MontserratMedium">
            {productDetails?.category?.subcategory?.name || productDetails.category_info?.subcategory?.name || "N/A"}
          </p>
        </div>
        <div>
          <h1 className="text-c12 font-MontserratNormal">Stock code</h1>
          {!published && (
            <p className="text-c18 font-MontserratMedium">{productDetails?.stockcode || "N/A"}</p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <h1 className="text-sm font-MontserratSemiBold">Product description</h1>
        <div className=" text-c12 font-MontserratNormal prose max-w-none prose-p:mt-0 prose-p:mb-0">
          <div
            dangerouslySetInnerHTML={{
              __html: productDetails?.description_html || productDetails?.description || "",
            }}
          />
        </div>
      </div>
      <div className="mt-6">
        <h1 className="text-sm font-MontserratSemiBold">Product specification</h1>
        <div className=" text-c12 font-MontserratNormal prose max-w-none prose-p:mt-0 prose-p:mb-0">
          <div
            dangerouslySetInnerHTML={{
              __html: productDetails?.specifications_html || productDetails?.draft_data?.specifications_text || "",
            }}
          />
        </div>
      </div>
    </>
  );
}
