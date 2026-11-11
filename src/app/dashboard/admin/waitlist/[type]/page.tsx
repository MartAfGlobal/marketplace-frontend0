"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BriefcaseBusiness, Store, Users, X } from "lucide-react";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";
import { RootState } from "@/store";
import { useAdminAccess } from "@/helpers/admin/useAdminAccess";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import StatusFrame from "@/components/admin-components/users/status-frame";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import HandBug from "@/assets/Seller/handBug.png";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";

const PAGE_SIZE = 20;

type WaitlistType = "buyers" | "sellers" | "investors";
type WaitlistEntry = Record<string, unknown>;

interface WaitlistColumn {
  label: string;
  keys: string[];
  date?: boolean;
  businessType?: boolean;
}

interface WaitlistConfig {
  title: string;
  endpoint: string;
  icon: React.ReactNode;
  columns: WaitlistColumn[];
}

const WAITLIST_CONFIG: Record<WaitlistType, WaitlistConfig> = {
  buyers: {
    title: "Buyers",
    endpoint: "/website/admin/waitlist/buyers/",
    icon: <Users className="h-5 w-5 text-[#6a0dad]" />,
    columns: [
      { label: "Date joined", keys: ["created_at", "submitted_at"], date: true },
      { label: "Full name", keys: ["full_name", "name"] },
      { label: "Email", keys: ["email", "work_email"] },
      { label: "Country", keys: ["country_name", "country"] },
      { label: "Preferred category", keys: ["preferred_categories", "category"] },
      { label: "Purpose", keys: ["purpose"] },
    ],
  },
  sellers: {
    title: "Sellers",
    endpoint: "/website/admin/waitlist/sellers/",
    icon: <Store className="h-5 w-5 text-[#6a0dad]" />,
    columns: [
      { label: "Date joined", keys: ["created_at", "submitted_at"], date: true },
      { label: "Full name", keys: ["full_name", "name"] },
      { label: "Email", keys: ["email", "work_email"] },
      { label: "Country", keys: ["country_name", "country"] },
      { label: "Business type", keys: ["business_type"], businessType: true },
      { label: "Purpose", keys: ["purpose"] },
    ],
  },
  investors: {
    title: "Investors",
    endpoint: "/website/admin/waitlist/investors/",
    icon: <BriefcaseBusiness className="h-5 w-5 text-[#6a0dad]" />,
    columns: [
      { label: "Date joined", keys: ["created_at", "submitted_at"], date: true },
      { label: "Full name", keys: ["full_name", "name"] },
      { label: "Work email", keys: ["work_email", "email"] },
      { label: "Organization", keys: ["organisation_name", "organization_name"] },
      { label: "Investor type", keys: ["investor_type"] },
      { label: "Country", keys: ["country_name", "country"] },
    ],
  },
};

function isWaitlistType(value: string): value is WaitlistType {
  return value in WAITLIST_CONFIG;
}

function isWaitlistEntry(value: unknown): value is WaitlistEntry {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getEntryList(responseData: unknown): {
  rows: WaitlistEntry[];
  totalCount: number;
  serverPaginated: boolean;
} {
  if (Array.isArray(responseData)) {
    const rows = responseData.filter(isWaitlistEntry);
    return { rows, totalCount: rows.length, serverPaginated: false };
  }

  if (!responseData || typeof responseData !== "object") {
    return { rows: [], totalCount: 0, serverPaginated: false };
  }

  const data = responseData as Record<string, unknown>;
  const nestedData = data.data && typeof data.data === "object"
    ? data.data as Record<string, unknown>
    : null;
  const items = Array.isArray(data.results)
    ? data.results
    : Array.isArray(nestedData?.results)
      ? nestedData.results
      : Array.isArray(data.data)
        ? data.data
        : [];
  const total = data.count ?? data.total_count ?? data.total ?? nestedData?.count ?? nestedData?.total;
  const serverPaginated = typeof total === "number" || "next" in data || "previous" in data;

  return {
    rows: items.filter(isWaitlistEntry),
    totalCount: typeof total === "number" ? total : items.length,
    serverPaginated,
  };
}

function getCellValue(row: WaitlistEntry, column: WaitlistColumn): string {
  const rawValue = column.keys.map((key) => row[key]).find((value) => value !== null && value !== undefined && value !== "");

  if (rawValue === null || rawValue === undefined || rawValue === "") return "—";

  if (column.businessType) {
    return String(rawValue).toLowerCase() === "registered_company" ? "Registered" : "Individual";
  }

  if (column.date) {
    return formatWaitlistDate(rawValue);
  }

  if (Array.isArray(rawValue)) {
    return rawValue.map(getDisplayValue).filter(Boolean).join(", ") || "—";
  }

  return getDisplayValue(rawValue);
}

function formatWaitlistDate(value: unknown): string {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getDetailLabel(key: string): string {
  if (["created_at", "submitted_at", "date_joined"].includes(key.toLowerCase())) {
    return "Date joined";
  }
  return key.replace(/_/g, " ");
}

function getDisplayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    const displayValue = objectValue.name ?? objectValue.label ?? objectValue.title ?? objectValue.country_name;
    if (displayValue !== undefined) return String(displayValue);
  }
  return "—";
}

export default function AdminWaitlistPage() {
  const params = useParams<{ type: string }>();
  const type = isWaitlistType(params.type) ? params.type : null;
  const config = type ? WAITLIST_CONFIG[type] : null;
  const token = useSelector((state: RootState) => state.token?.token);
  const { loaded: accessLoaded, isFullAccess } = useAdminAccess();

  const [rows, setRows] = useState<WaitlistEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [serverPaginated, setServerPaginated] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [detailEntry, setDetailEntry] = useState<WaitlistEntry | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);

  const getEntryId = (row: WaitlistEntry) =>
    row.id ?? row.uuid ?? row.buyer_uuid ?? row.seller_uuid ?? row.investor_uuid;

  const openEntryDetails = async (row: WaitlistEntry) => {
    if (!config || !isFullAccess) return;
    const id = getEntryId(row);
    if (id === undefined || id === null || id === "") {
      setDetailEntry(null);
      setDetailError("This waitlist entry does not include an ID.");
      setDetailOpen(true);
      return;
    }

    setDetailOpen(true);
    setDetailLoading(true);
    setDetailError("");
    setDetailEntry(null);

    try {
      const response = await axios.get(
        `${config.endpoint}${encodeURIComponent(String(id))}/`,
      );
      console.log(`${config.title} waitlist detail response`, response.data);
      const responseData = response.data;
      const data = isWaitlistEntry(responseData) ? responseData : {};
      const nestedEntry = isWaitlistEntry(data.data)
        ? data.data
        : isWaitlistEntry(data.detail)
          ? data.detail
          : data;
      setDetailEntry(nestedEntry);
    } catch (requestError) {
      const status = isAxiosError(requestError)
        ? requestError.response?.status
        : undefined;
      console.error(`Failed to load ${config.title.toLowerCase()} waitlist details`, {
        status,
      });
      setDetailError(
        status
          ? `Unable to load entry details (HTTP ${status}).`
          : "Unable to load entry details.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchValue.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const fetchWaitlist = useCallback(async () => {
    if (!token || !config || !accessLoaded || !isFullAccess) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(config.endpoint, {
        params: {
          page,
          ...(search ? { search } : {}),
        },
      });
      console.log(`${config.title} waitlist response`, response.data);
      const result = getEntryList(response.data);
      setRows(result.rows);
      setTotalCount(result.totalCount);
      setServerPaginated(result.serverPaginated);
    } catch (requestError) {
      const status = isAxiosError(requestError)
        ? requestError.response?.status
        : undefined;
      console.error(`Failed to load ${config.title.toLowerCase()} waitlist`, {
        status,
      });
      setError(
        status
          ? `Unable to load waitlist entries (HTTP ${status}). Please try again.`
          : "Unable to load waitlist entries. Please try again.",
      );
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [accessLoaded, config, isFullAccess, page, search, token]);

  useEffect(() => {
    if (!type) {
      setLoading(false);
      setError("This waitlist section does not exist.");
      return;
    }
    if (!token || !accessLoaded || !isFullAccess) return;
    void fetchWaitlist();
  }, [accessLoaded, fetchWaitlist, isFullAccess, token, type, retry]);

  const matchingRows = useMemo(() => {
    if (serverPaginated || !search) return rows;
    const searchTerm = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row)
        .map(getDisplayValue)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm),
    );
  }, [rows, search, serverPaginated]);

  const visibleRows = serverPaginated
    ? rows
    : matchingRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const displayedTotal = serverPaginated ? totalCount : matchingRows.length;
  const totalPages = Math.max(1, Math.ceil(displayedTotal / PAGE_SIZE));

  if (!config) {
    return (
      <div className="rounded-c16 bg-white p-6 text-sm font-MontserratNormal text-000000/68">
        This waitlist section does not exist.
      </div>
    );
  }

  // Keep the waitlist data and controls unavailable until full-admin access is confirmed.
  if (!accessLoaded) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size={32} color="border-ff715b" />
      </div>
    );
  }

  if (!isFullAccess) {
    return (
      <div className="rounded-c16 bg-white p-6 text-sm font-MontserratNormal text-000000/68">
        You do not have permission to view the waitlist.
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-c16 bg-white p-6">
      <div>
        <h1 className="py-2 text-c20 font-MontserratMedium">{config.title} waitlist</h1>
        <p className="text-sm font-MontserratNormal text-000000/44">
          Review people who joined the {config.title.toLowerCase()} waitlist.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusFrame title="Total entries" quantity={displayedTotal} icon={config.icon} />
        <StatusFrame title="Entries on this page" quantity={visibleRows.length} icon={<Users className="h-5 w-5 text-[#6a0dad]" />} />
        <StatusFrame title="Current page" quantity={`${page} / ${totalPages}`} icon={<BriefcaseBusiness className="h-5 w-5 text-[#6a0dad]" />} />
      </div>

      <section>
        <h2 className="mb-6 text-base font-MontserratNormal text-000000/68">
          {config.title} waitlist table
        </h2>
        <AdminListHeader
          searchVal={searchValue}
          setSearchVal={setSearchValue}
          placeholder={`Search ${config.title.toLowerCase()} waitlist...`}
          searchExpandable
          hidePeriod
        />

        <div className="min-h-[250px] overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="h-10.5 whitespace-nowrap bg-947fff text-ffffff">
                {config.columns.map((column) => (
                  <th key={column.label} className="p-3 font-MontserratNormal text-sm">
                    {column.label}
                  </th>
                ))}
                <th className="w-10 p-3" />
              </tr>
            </thead>
            <tbody className="text-sm font-MontserratNormal text-000000/68">
              {loading ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="py-12 text-center">
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size={32} color="border-ff715b" />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="py-12 text-center">
                    <p className="mb-3 text-[#CA0202]">{error}</p>
                    <button
                      type="button"
                      onClick={() => setRetry((attempt) => attempt + 1)}
                      className="font-MontserratSemiBold text-6a0dad hover:underline"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : visibleRows.length > 0 ? (
                visibleRows.map((row, index) => {
                  const rowKey = String(
                    getEntryId(row) ?? row.email ?? row.work_email ?? `${page}-${index}`,
                  );
                  return (
                    <tr
                      key={rowKey}
                      className="h-10.5 transition-colors"
                    >
                      {config.columns.map((column) => (
                        <td key={column.label} className="max-w-[240px] p-3">
                          <span className="block truncate" title={getCellValue(row, column)}>
                            {getCellValue(row, column)}
                          </span>
                        </td>
                      ))}
                      <td className="relative px-3 py-2 text-center">
                        <button
                          type="button"
                          aria-label={`View ${config.title.toLowerCase()} waitlist details`}
                          onClick={() => setActiveRowId((current) => current === rowKey ? null : rowKey)}
                          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-200"
                        >
                          <Image src={HandBug} alt="" width={16} height={16} />
                        </button>
                        <AnimatePresence>
                          {activeRowId === rowKey && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute right-0 top-full z-50 mt-2 w-39.75 overflow-hidden rounded-c8 border border-000000/4 bg-white px-4 text-c12 font-MontserratNormal shadow-custom"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRowId(null);
                                  void openEntryDetails(row);
                                }}
                                className="w-full py-2 text-left text-[#ff715b] transition-colors hover:text-[#ff715b]/80"
                              >
                                More Details
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={config.columns.length + 1} className="py-12 text-center text-000000/44">
                    No waitlist entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && displayedTotal > PAGE_SIZE && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </section>

      <DrawerWrapper
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidthClassName="max-w-[560px]"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-MontserratBold text-[#161616]">
                {config.title} waitlist details
              </h2>
              <p className="mt-1 text-sm font-MontserratNormal text-000000/44">
                Full information for this waitlist entry.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDetailOpen(false)}
              aria-label="Close details"
              className="text-gray-400 transition-colors hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {detailLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size={32} color="border-ff715b" />
              </div>
            ) : detailError ? (
              <p className="py-8 text-sm font-MontserratNormal text-[#CA0202]">
                {detailError}
              </p>
            ) : detailEntry ? (
              <dl className="divide-y divide-000000/5">
                {Object.entries(detailEntry)
                  .filter(([key]) => key.toLowerCase() !== "id")
                  .map(([key, value]) => (
                  <div key={key} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(130px,1fr)_2fr] sm:gap-4">
                    <dt className="text-xs font-MontserratSemiBold capitalize text-000000/44">
                      {getDetailLabel(key)}
                    </dt>
                    <dd className="break-words text-sm font-MontserratNormal text-000000/80">
                      {["created_at", "submitted_at", "date_joined"].includes(key.toLowerCase())
                        ? formatWaitlistDate(value)
                        : Array.isArray(value)
                        ? value.map(getDisplayValue).filter(Boolean).join(", ") || "—"
                        : getDisplayValue(value)}
                    </dd>
                  </div>
                  ))}
              </dl>
            ) : null}
          </div>
        </div>
      </DrawerWrapper>
    </div>
  );
}
