"use client";

import {
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import type { RootState } from "@/store";
import type { sellerProduct, ProductDraftPayload } from "@/types/global";
import type { Transaction } from "@/store/finance/transactionsSlice";

interface SellerAccountSearchProps {
  placeholder?: string;
  className?: string;
}

interface SellerSearchResult {
  id: string;
  title: string;
  detail: string;
  type: "Page" | "Product" | "Draft" | "Order" | "Transaction" | "Account";
  href: string;
  searchableText: string;
}

const sellerPages: SellerSearchResult[] = [
  {
    id: "overview",
    title: "Overview",
    detail: "Seller dashboard overview and performance",
    type: "Page",
    href: "/dashboard/seller/overview",
    searchableText: "overview dashboard performance analytics sales",
  },
  {
    id: "products",
    title: "Products",
    detail: "Manage your product inventory",
    type: "Page",
    href: "/dashboard/seller/products",
    searchableText: "products inventory catalog listings",
  },
  {
    id: "add-product",
    title: "Add a product",
    detail: "Create a new product listing",
    type: "Page",
    href: "/dashboard/seller/products/add-product",
    searchableText: "add create new product listing",
  },
  {
    id: "drafts",
    title: "Product drafts",
    detail: "Continue working on saved product drafts",
    type: "Page",
    href: "/dashboard/seller/products/add-product/add-to-draft",
    searchableText: "draft drafts saved incomplete products",
  },
  {
    id: "orders",
    title: "Orders",
    detail: "View and manage customer orders",
    type: "Page",
    href: "/dashboard/seller/orders",
    searchableText: "orders order management shipments",
  },
  {
    id: "my-orders",
    title: "My orders",
    detail: "View and process your orders",
    type: "Page",
    href: "/dashboard/seller/orders/my-orders",
    searchableText: "my orders order list",
  },
  {
    id: "order-analytics",
    title: "Order analytics",
    detail: "Review order trends and performance",
    type: "Page",
    href: "/dashboard/seller/orders/analytics",
    searchableText: "order analytics trends performance",
  },
  {
    id: "disputes",
    title: "Order disputes",
    detail: "Review order disputes",
    type: "Page",
    href: "/dashboard/seller/orders/disputes",
    searchableText: "order disputes returns cancellation",
  },
  {
    id: "returns",
    title: "Returns",
    detail: "Manage order returns",
    type: "Page",
    href: "/dashboard/seller/orders/dispute-returns",
    searchableText: "returns return requests order",
  },
  {
    id: "finance",
    title: "Finance",
    detail: "View your seller wallet and transactions",
    type: "Page",
    href: "/dashboard/seller/finance",
    searchableText: "finance wallet balance payments transactions payouts",
  },
  {
    id: "customers",
    title: "Customers",
    detail: "Open customer management",
    type: "Page",
    href: "/dashboard/seller/customers",
    searchableText: "customers customer management buyers",
  },
  {
    id: "chat",
    title: "Chats",
    detail: "Open seller conversations",
    type: "Page",
    href: "/dashboard/seller/chat",
    searchableText: "chat chats messages conversations",
  },
  {
    id: "settings",
    title: "Settings",
    detail: "Manage your seller account settings",
    type: "Page",
    href: "/dashboard/seller/settings",
    searchableText: "settings account profile business shop documents payout shipping",
  },
  {
    id: "settings-profile",
    title: "Seller profile settings",
    detail: "Manage your seller profile",
    type: "Page",
    href: "/dashboard/seller/settings?section=Profile",
    searchableText: "settings seller profile business profile",
  },
  {
    id: "settings-account",
    title: "Account settings",
    detail: "Manage your seller account",
    type: "Page",
    href: "/dashboard/seller/settings?section=Account",
    searchableText: "settings account shop information",
  },
  {
    id: "settings-payout",
    title: "Payout settings",
    detail: "Manage payout details",
    type: "Page",
    href: "/dashboard/seller/settings?section=Payout",
    searchableText: "settings payout bank account",
  },
  {
    id: "settings-documents",
    title: "Seller documents",
    detail: "View or update verification documents",
    type: "Page",
    href: "/dashboard/seller/settings?section=Documents",
    searchableText: "settings documents verification kyb",
  },
  {
    id: "settings-notifications",
    title: "Notification settings",
    detail: "Manage seller notifications",
    type: "Page",
    href: "/dashboard/seller/settings?section=Notifications",
    searchableText: "settings notifications alerts",
  },
  {
    id: "settings-language",
    title: "Language and region settings",
    detail: "Manage language and region preferences",
    type: "Page",
    href: "/dashboard/seller/settings?section=Language",
    searchableText: "settings language region country",
  },
  {
    id: "settings-password",
    title: "Password and security",
    detail: "Manage password and security",
    type: "Page",
    href: "/dashboard/seller/settings?section=Password",
    searchableText: "settings password security login",
  },
  {
    id: "settings-privacy",
    title: "Privacy policy",
    detail: "Review privacy settings",
    type: "Page",
    href: "/dashboard/seller/settings?section=Privacy",
    searchableText: "settings privacy policy",
  },
  {
    id: "settings-legal",
    title: "Legal information",
    detail: "Review legal information",
    type: "Page",
    href: "/dashboard/seller/settings?section=Legal",
    searchableText: "settings legal information terms",
  },
  {
    id: "settings-delete",
    title: "Delete account",
    detail: "Manage account deletion",
    type: "Page",
    href: "/dashboard/seller/settings?section=Delete",
    searchableText: "settings delete account",
  },
];

const searchableText = (value: unknown) =>
  JSON.stringify(value ?? "").toLowerCase();

const getOrderLabel = (order: RootState["orders"]["orders"][number]) =>
  order.order_no || order.order_id || order.id;

export default function SellerAccountSearch({
  placeholder = "Search your seller account",
  className = "",
}: SellerAccountSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const products = useSelector(
    (state: RootState) => state.sellerProduct.product ?? [],
  );
  const drafts = useSelector((state: RootState) => state.draft.draft ?? []);
  const orders = useSelector((state: RootState) => state.orders.orders ?? []);
  const transactions = useSelector(
    (state: RootState) => state.transactions.items ?? [],
  );
  const sellerData = useSelector((state: RootState) => state.seller.data);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const accountResults: SellerSearchResult[] = [
      ...products.map((product: sellerProduct) => ({
        id: `product-${product.id}`,
        title: product.name,
        detail: `${product.stockcode || "No SKU"} · ${
          product.is_active ? "Live" : "Inactive"
        } product`,
        type: "Product" as const,
        href: `/dashboard/seller/products/product-details/${product.id}`,
        searchableText: searchableText(product),
      })),
      ...drafts.map((draft: ProductDraftPayload) => ({
        id: `draft-${draft.id}`,
        title: draft.name || "Untitled draft",
        detail: "Saved product draft",
        type: "Draft" as const,
        href: "/dashboard/seller/products/add-product/add-to-draft",
        searchableText: searchableText(draft),
      })),
      ...orders.map((order) => ({
        id: `order-${order.id}`,
        title: `Order ${getOrderLabel(order)}`,
        detail: `${order.status} · ${order.payment_status}`,
        type: "Order" as const,
        href: `/dashboard/seller/orders/order-details/${order.id}`,
        searchableText: searchableText(order),
      })),
      ...transactions.map((transaction: Transaction) => ({
        id: `transaction-${transaction.transaction_id || transaction.id}`,
        title: transaction.transaction_id || `Transaction ${transaction.id}`,
        detail: [transaction.type || transaction.transaction_type, transaction.status]
          .filter(Boolean)
          .join(" · "),
        type: "Transaction" as const,
        href: "/dashboard/seller/finance",
        searchableText: searchableText(transaction),
      })),
      {
        id: "seller-account",
        title: "Seller account",
        detail: "Your profile and business details",
        type: "Account",
        href: "/dashboard/seller/settings",
        searchableText: searchableText(sellerData),
      },
    ];

    return [...accountResults, ...sellerPages]
      .filter((result) =>
        `${result.title} ${result.detail} ${result.searchableText}`
          .toLowerCase()
          .includes(term),
      );
  }, [drafts, orders, products, query, sellerData, transactions]);

  const openResult = (result: SellerSearchResult) => {
    setIsFocused(false);
    router.push(result.href);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsFocused(false);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (matches[0]) openResult(matches[0]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative z-50 w-full ${className}`}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        const nextTarget = event.relatedTarget;
        if (
          !(nextTarget instanceof Node) ||
          !containerRef.current?.contains(nextTarget)
        ) {
          setIsFocused(false);
        }
      }}
    >
      <div className="relative flex h-12 w-full items-center rounded-c8 bg-ffffff shadow-customW">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 h-5 w-5 text-000000/50"
        />
        <input
          type="search"
          value={query}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={isFocused}
          aria-controls="seller-account-search-results"
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="h-full w-full rounded-c8 bg-transparent py-2 pl-11 pr-4 font-MontserratNormal text-sm text-000000 focus:outline-none"
        />
      </div>

      {isFocused && (
        <div
          id="seller-account-search-results"
          className="absolute left-0 top-full mt-2 max-h-80 w-full overflow-y-auto rounded-c8 bg-white p-2 text-left shadow-lg"
        >
          {query.trim() ? (
            matches.length > 0 ? (
              <>
                <ul role="listbox" aria-label="Seller account search results">
                  {matches.slice(0, 20).map((result) => (
                    <li key={result.id} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected="false"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => openResult(result)}
                        className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <Search
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-000000/40"
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-MontserratMedium text-sm text-000000">
                            {result.title}
                          </span>
                          <span className="block truncate text-xs text-000000/50">
                            {result.detail}
                          </span>
                        </span>
                        <span className="shrink-0 rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
                          {result.type}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {matches.length > 20 && (
                  <p className="px-3 py-2 text-xs text-000000/50">
                    Showing the first 20 results. Refine your search to narrow
                    the matches.
                  </p>
                )}
              </>
            ) : (
              <p className="px-3 py-4 text-sm text-000000/50">
                No matches in your seller account.
              </p>
            )
          ) : (
            <p className="px-3 py-4 text-sm text-000000/50">
              Search seller pages, products, drafts, orders, and transactions.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
