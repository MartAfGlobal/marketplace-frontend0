import Image from "next/image";

interface ProductVariantsProps {
  variations: any[];
}

export default function ProductVariants({ variations }: ProductVariantsProps) {
  if (!variations || variations.length === 0) return null;

  return (
    <div className="w-full">
      <p className="hidden lg:block text-c18 font-MontserratSemiBold mt-c32 mb-6">Variants</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-16 lg:gap-y-12 lg:mt-0">
        {variations.map((variant, index) => (
          <div key={variant.id ?? `variant-${index}`} className="pb-8 border-b border-gray-100 last:border-0">
            {/* --- MOBILE VIEW (Unchanged) --- */}
            <div className="flex flex-col gap-6 lg:hidden">
              {/* Top Section: Image and Core Details */}
              <div className="flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 relative">
                  <Image
                    src={variant.main_image_url || variant.images?.[0]?.url || "/placeholder.png"}
                    alt={variant.name || `Variant ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <h1 className="text-sm text-000000/68 font-MontserratNormal">Variant name</h1>
                      <p className="text-sm font-MontserratNormal text-000000">{variant.name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <h1 className="text-sm text-000000/68 font-MontserratNormal">Quantity</h1>
                      <p className="text-sm font-MontserratNormal text-000000">{variant.stock || variant.inventory || variant.quantity || 0}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <h1 className="text-sm text-000000/68 font-MontserratNormal">Price</h1>
                    <p className="text-sm font-MontserratSemiBold text-gray-900">N{variant.base_price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Attributes Grid */}
              {variant.attribute_summary && Object.keys(variant.attribute_summary).length > 0 && (
                <div className="flex gap-4 flex-wrap">
                  {Object.entries(variant.attribute_summary).map(([attribute, value]) => (
                    <div key={attribute} className="flex gap-4 sm:gap-6">
                      <div className="flex flex-col gap-1 min-w-[60px]">
                        <p className="text-[10px] sm:text-xs font-MontserratSemiBold text-000000">Attribute</p>
                        <span className="text-xs sm:text-sm text-000000 capitalize">{attribute}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] sm:text-xs font-MontserratSemiBold text-000000">Value</p>
                        <span className="text-xs sm:text-sm text-000000 capitalize">{String(value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden lg:flex flex-row gap-6">
              {/* Left Column: Image and details stacked vertically */}
              <div className="flex flex-col gap-4 w-[120px] flex-shrink-0">
                <div className="w-[120px] h-[120px] relative">
                  <Image
                    src={variant.main_image_url || variant.images?.[0]?.url || "/placeholder.png"}
                    alt={variant.name || `Variant ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                
                <div className="space-y-1 mt-2">
                  <h1 className="text-xs text-gray-500 font-MontserratNormal">Variant name</h1>
                  <p className="text-sm font-MontserratMedium text-gray-800">{variant.name}</p>
                </div>
                
                <div className="space-y-1">
                  <h1 className="text-xs text-gray-500 font-MontserratNormal">Quantity</h1>
                  <p className="text-sm font-MontserratMedium text-gray-800">{variant.stock || variant.inventory || variant.quantity || 0}</p>
                </div>
                
                <div className="space-y-1">
                  <h1 className="text-xs text-gray-500 font-MontserratNormal">Price</h1>
                  <p className="text-sm font-MontserratSemiBold text-gray-900">N{variant.base_price?.toLocaleString()}</p>
                </div>
              </div>

              {/* Right Column: Attributes Grid */}
              <div className="flex-1">
                {variant.attribute_summary && Object.keys(variant.attribute_summary).length > 0 && (
                  <div className="flex gap-x-8 gap-y-6 flex-wrap">
                    {Object.entries(variant.attribute_summary).map(([attribute, value]) => (
                      <div key={attribute} className="flex gap-4">
                        <div className="flex flex-col gap-1 min-w-[60px]">
                          <p className="text-[10px] font-MontserratSemiBold text-gray-900">Attribute</p>
                          <span className="text-sm text-gray-600 capitalize">{attribute}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-MontserratSemiBold text-gray-900">Value</p>
                          <span className="text-sm text-gray-600 capitalize">{String(value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
