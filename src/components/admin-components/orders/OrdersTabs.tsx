export type OrdersTabKey =
  | "all"
  | "unprocessed"
  | "processed"
  | "shipped"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled"
  | "cancel_request";

interface Tab {
  key: OrdersTabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "all", label: "All Orders" },
  { key: "unprocessed", label: "Unprocessed" },
  { key: "processed", label: "Processed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
  { key: "disputed", label: "Disputed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "cancel_request", label: "Cancel Request" },
];

interface OrdersTabsProps {
  activeTab: OrdersTabKey;
  onTabChange: (tab: OrdersTabKey) => void;
}

export default function OrdersTabs({ activeTab, onTabChange }: OrdersTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto hcustom-scroll border-b border-000000/8">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`whitespace-nowrap pb-4 px-1 h-12 text-c12 font-MontserratSemiBold transition-colors relative ${
            activeTab === tab.key
              ? "text-6a0dad border-b-2 border-b-6a0dad"
              : "text-000000/68 hover:text-6a0dad border-b-2 border-b-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
