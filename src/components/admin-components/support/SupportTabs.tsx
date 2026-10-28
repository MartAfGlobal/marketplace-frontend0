import { UsersRound } from "lucide-react";

export type SupportTabKey = "tickets" | "staff";

interface SupportTabsProps {
  activeTab: SupportTabKey;
  onChange: (tab: SupportTabKey) => void;
}

export default function SupportTabs({ activeTab, onChange }: SupportTabsProps) {
  return (
    <div className="mb-6  flex gap-0 items-center ">
      <button
        type="button"
        onClick={() => onChange("tickets")}
        className={`border-b-2 p-4 text-base font-MontserratNormal text-000000/68  transition-colors  ${
          activeTab === "tickets"
            ? "border-6a0dad text-6a0dad"
            : "border-transparent text-000000/68 hover:text-[#161616]"
        }`}
      >
        Tickets
      </button>
      <button
        type="button"
        onClick={() => onChange("staff")}
        className={`flex items-center gap-1.5 border-b-2 p-4 text-base font-MontserratMedium transition-colors ${
          activeTab === "staff"
            ? "border-6ad0dad text-6a0dad"
            : "border-transparent text-000000/68 hover:text-[#161616]"
        }`}
      >
        
        Support staff
      </button>
    </div>
  );
}
