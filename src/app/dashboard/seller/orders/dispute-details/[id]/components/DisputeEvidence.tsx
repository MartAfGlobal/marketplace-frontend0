import Image from "next/image";

interface DisputeEvidenceProps {
  dispute: any;
}

export const DisputeEvidence = ({ dispute }: DisputeEvidenceProps) => {
  return (
    <>
      {/* Mobile Layout (lg:hidden) */}
      <div className="lg:hidden space-y-6 pt-6 border-t border-gray-50">
        <h2 className="text-lg font-MontserratSemiBold text-000000">
          Dispute information
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-700 font-MontserratMedium leading-relaxed">
            <span className="text-gray-900 font-MontserratSemiBold">
              Buyer&apos;s Claim:
            </span>{" "}
            {dispute.cancellation_reason_title || dispute.reason || "N/A"}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-900 font-MontserratSemiBold">
            Evidence provided:
          </p>
          <div className="grid grid-cols-2 gap-4 w-full">
            {(dispute.evidence_images || dispute.evidence || []).map(
              (img: any, idx: number) => (
                <div
                  key={idx}
                  className="relative bg-6a0dad w-full aspect-square border border-gray-100 rounded-lg overflow-hidden shadow-sm cursor-pointer"
                >
                  <Image
                    src={
                      img.file_url ||
                      img.image ||
                      (typeof img === "string" ? img : "/placeholder.png")
                    }
                    alt={`Evidence ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )
            )}
            {!(dispute.evidence_images || dispute.evidence || [])?.length && (
              <p className="text-sm text-gray-400 font-MontserratMedium italic col-span-full">
                No evidence images provided.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout (hidden lg:block) */}
      <div className="hidden lg:block space-y-6 pt-10 border-t border-gray-50">
        <h2 className="text-lg font-MontserratSemiBold text-000000">
          Dispute information
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-700 font-MontserratMedium leading-relaxed">
            <span className="text-gray-900 font-MontserratSemiBold">
              Buyer&apos;s Claim:
            </span>{" "}
            {dispute.cancellation_reason_title || dispute.reason || "N/A"}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-900 font-MontserratSemiBold">
            Evidence provided:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-162">
            {(dispute.evidence_images || dispute.evidence || []).map(
              (img: any, idx: number) => (
                <div
                  key={idx}
                  className="relative bg-6a0dad w-full max-w-50 h-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Image
                    src={
                      img.file_url ||
                      img.image ||
                      (typeof img === "string" ? img : "/placeholder.png")
                    }
                    alt={`Evidence ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )
            )}
            {!(dispute.evidence_images || dispute.evidence || [])?.length && (
              <p className="text-sm text-gray-400 font-MontserratMedium italic col-span-full">
                No evidence images provided.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
