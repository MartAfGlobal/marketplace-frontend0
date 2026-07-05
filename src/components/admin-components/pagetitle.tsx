import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";

interface PageTitleProps {
  title: string;
  selectedMonth?: string;
  onMonthChange?: (val: string) => void;
}

export default function PageTitle({
  title,
  selectedMonth = "This month",
  onMonthChange,
}: PageTitleProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-c20 font-MontserratMedium text-[#000000]">
        {title}
      </h1>

      <FilterDropdown 
        options={["This Week", "This Month", "This Year"]}
        defaultValue={selectedMonth}
        onChange={onMonthChange}
        className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
      />
    </div>
  );
}
