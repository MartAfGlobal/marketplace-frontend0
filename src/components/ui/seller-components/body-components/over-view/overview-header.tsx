"use client";

import FilterDropdown from "./Filter-components/filterButton";
import SellerAccountSearch from "./Filter-components/SellerAccountSearch";

export default function OverviewHeader({
  period,
  onPeriodChange,
}: {
  period: "month" | "year";
  onPeriodChange: (period: "month" | "year") => void;
}) {
  const selectedPeriod = period === "year" ? "This Year" : "This Month";
  const overviewPeriodOptions = ["This Month", "This Year"];

  return (
    <div className="relative flex w-full flex-col items-center justify-between gap-4 px-3 md:h-c48 md:flex-row md:gap-0">
      <div className="w-full md:hidden">
        <SellerAccountSearch placeholder="Search your seller account" />
      </div>

      <div className="flex w-full items-center justify-between md:hidden">
        <p className="text-c18 font-MontserratMedium">Overview</p>
        <FilterDropdown
          options={overviewPeriodOptions}
          defaultValue={selectedPeriod}
          onChange={(value) =>
            onPeriodChange(value === "This Year" ? "year" : "month")
          }
        />
      </div>

      <div className="flex w-full items-center lg:justify-between">
        <div className="hidden w-full items-center gap-12 md:flex">
          <p className="text-c18 font-MontserratMedium">Overview</p>
          <SellerAccountSearch
            placeholder="Search for anything"
            className="max-w-97"
          />
        </div>

        <div className="hidden lg:block">
          <FilterDropdown
            options={overviewPeriodOptions}
            defaultValue={selectedPeriod}
            onChange={(value) =>
              onPeriodChange(value === "This Year" ? "year" : "month")
            }
          />
        </div>
      </div>
    </div>
  );
}
