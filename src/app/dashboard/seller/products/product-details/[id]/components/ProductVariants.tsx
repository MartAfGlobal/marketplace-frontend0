import Image from "next/image";

interface ProductVariantsProps {
  variations: any[];
}

export default function ProductVariants({ variations }: ProductVariantsProps) {
  if (!variations || variations.length === 0) return null;

  return (
    <>
      <p className="text-c18 font-MontserratSemiBold mt-c32">Variants</p>
      <div className="grid grid-cols-2 gap-y-12 gap-x-16 mt-c48">
        {variations.map((variant, index) => (
          <div key={variant.id ?? `variant-${index}`} className="flex gap-6 bg">
            <div className="space-y-4">
              <Image
                src={variant.main_image_url || variant.images?.[0]?.url || "/placeholder.png"}
                alt={variant.name || `Variant ${index + 1}`}
                width={96}
                height={96}
              />
              <div className="mt-4 space-y-1">
                <h1 className="text-c12 font-MontserratNormal">Variant name</h1>
                <p className="text-base flex-nowrap font-MontserratSemiBold">{variant.name}</p>
              </div>
              <div className="mt-4 space-y-1">
                <h1 className="text-c12 font-MontserratNormal">Price</h1>
                <p className="text-base font-MontserratSemiBold">N{variant.base_price}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-c12 font-MontserratNormal">
              {Object.entries(variant.attribute_summary || {}).map(([attribute, value]) => (
                <div key={attribute} className="flex gap-4 text-c12 font-MontserratNormal">
                  <div className="flex flex-col gap-1">
                    <p>Attribute</p>
                    <span className="font-semibold">{attribute}:</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>Value</p>
                    <span>{String(value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
