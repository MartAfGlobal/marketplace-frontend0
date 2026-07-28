const TABS = [
  { label: "All Category", width: "w-27" },
  { label: "Active", width: "w-21.25" },
  { label: "Hidden", width: "w-21.25" },
  { label: "Subcategories", width: "w-30.25" },
  { label: "Attributes", width: "w-23.75" },
];

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(tab.label)}
          className={`${tab.width} pb-4 h-12 text-c12 font-MontserratSemiBold transition-colors relative ${
            activeTab === tab.label
              ? "text-6a0dad border-b-6a0dad border-b-3"
              : "text-000000/68 hover:text-6a0dad border-b border-b-000000/2"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
