interface ProductInfoProps {
  productDetails: any;
  published: string | undefined;
}

export default function ProductInfo({ productDetails, published }: ProductInfoProps) {
  if (!productDetails) return null;

  return (
    <>
      {/* --- MOBILE VIEW (Unchanged) --- */}
      <div className="lg:hidden">
        <div className="space-y-2 mt-6">
          <h1 className="text-sm font-MontserratNormal text-gray-400">Product name</h1>
          <p className="text-c18 font-MontserratMedium">
            {productDetails?.name || "Product name not available"}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className={`px-6 py-2 rounded-full text-xs font-MontserratMedium flex items-center justify-center ${
            published === "true" 
              ? (productDetails?.is_active ? "bg-[#28A745]/12 text-[#28A745]" : "bg-red-100 text-red-700") 
              : "bg-gray-100 text-gray-700"
          }`}>
            {published === "true" ? (productDetails?.is_active ? "Live" : "Inactive") : "Draft"}
          </div>
          {productDetails?.category?.name && (
            <div className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-MontserratMedium">
              {productDetails.category.name}
            </div>
          )}
          {productDetails?.category?.subcategory?.name && (
            <div className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-MontserratMedium">
              {productDetails.category.subcategory.name}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="space-y-2">
            <h1 className="text-sm font-MontserratNormal text-000000/44">Price</h1>
            <p className="text-lg font-MontserratSemiBold">N{productDetails?.base_price?.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <h1 className="text-sm font-MontserratNormal text-000000/44">Quantity sold</h1>
            <p className="text-lg font-MontserratNormal">{productDetails?.sold || 0}</p>
          </div>
          <div className="space-y-2">
            <h1 className="text-sm font-MontserratNormal text-000000/44">Quantity in stock</h1>
            <p className="text-lg font-MontserratNormal">
              {productDetails.stock || productDetails.inventory || productDetails.quantity || 0}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-base font-MontserratNormal text-000000">Product description</h1>
          <div className="mt-3 text-sm font-MontserratNormal text-000000 leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: productDetails?.description_html || productDetails?.description || "No description provided.",
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-base font-MontserratNormal text-000000">Product specification</h1>
          <div className="mt-3 text-sm font-MontserratNormal text-000000 leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: productDetails?.specifications_html || productDetails?.draft_data?.specifications_text || "No specifications provided.",
              }}
            />
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden lg:block mt-8">
        <div className="flex gap-12">
          <div className="space-y-2">
            <h2 className="text-base font-MontserratNormal text-000000">Quantity sold</h2>
            <p className="text-c20 font-MontserratSemiBold">{productDetails?.sold || 0}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-MontserratNormal text-000000">Quantity in stock</h2>
            <p className="text-c20 font-MontserratSemiBold">{productDetails.stock || productDetails.inventory || productDetails.quantity || 0}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <h1 className="text-[12px] font-MontserratNormal text-000000">Product name</h1>
          <p className="text-base font-MontserratMedium">{productDetails?.name || "Product name not available"}</p>
        </div>

        <div className="mt-6 space-y-2">
          <h1 className="text-[12px] font-MontserratNormal text-000000">Status</h1>
          <p className={`text-c18 font-MontserratMedium ${published === "true" && productDetails?.is_active ? "text-[#00B69B]" : "text-gray-800"}`}>
            {published === "true" ? (productDetails?.is_active ? "Live" : "Inactive") : "Draft"}
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <h1 className="text-[12px] font-MontserratNormal text-000000">Price</h1>
          <p className="text-c24 font-MontserratSemiBold">N{productDetails?.base_price?.toLocaleString()}</p>
        </div>

        <div className="mt-6 flex gap-8">
          <div className="space-y-2">
            <h1 className="text-[12px] font-MontserratNormal text-000000">Category</h1>
            <p className="text-base font-MontserratMedium">{productDetails?.category?.name || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <h1 className="text-[12px] font-MontserratNormal text-000000">Subcategory</h1>
            <p className="text-base font-MontserratMedium">{productDetails?.category?.subcategory?.name || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <h1 className="text-[12px] font-MontserratNormal text-000000">Stock Code</h1>
            <p className="text-base font-MontserratMedium">{productDetails?.stockcode || "N/A"}</p>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-sm font-MontserratSemiBold text-000000">Product description</h1>
          <div className="mt-2 text-xs font-MontserratNormal text-000000 leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: productDetails?.description_html || productDetails?.description || "No description provided.",
              }}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h1 className="text-sm font-MontserratSemiBold text-gray-800">Product specification</h1>
          <div className="text-xs font-MontserratNormal text-000000 leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: productDetails?.specifications_html || productDetails?.draft_data?.specifications_text || "No specifications provided.",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
